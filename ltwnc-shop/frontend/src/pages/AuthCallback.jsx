import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { message } from "antd";
import { useAuth } from "../context/AuthContext";
import logger from "../utils/logger";

const API_BASE_URL = "http://localhost:8080/api";

const resolveProvider = (state) => {
  if (!state) {
    return "";
  }

  const [provider] = state.split(":");
  return provider;
};

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [status, setStatus] = useState("Đang xử lý đăng nhập...");

  const redirectUri = useMemo(() => `${window.location.origin}/auth/callback`, []);

  useEffect(() => {
    const executeOAuthLogin = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state") || "";
      const oauthError = searchParams.get("error");
      const savedState = sessionStorage.getItem("oauth_state") || "";

      if (oauthError) {
        message.error("Bạn đã hủy hoặc OAuth bị lỗi.");
        navigate("/login", { replace: true });
        return;
      }

      if (!code) {
        message.error("Không nhận được authorization code.");
        navigate("/login", { replace: true });
        return;
      }

      if (!state || !savedState || state !== savedState) {
        message.error("Trạng thái OAuth không hợp lệ.");
        navigate("/login", { replace: true });
        return;
      }

      const provider = resolveProvider(state);
      if (provider !== "google" && provider !== "facebook") {
        message.error("Không xác định được nhà cung cấp OAuth.");
        navigate("/login", { replace: true });
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/oauth/${provider}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code,
            redirectUri,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Đăng nhập OAuth thất bại");
        }

        login(data);
        sessionStorage.removeItem("oauth_state");
        setStatus("Đăng nhập thành công. Đang chuyển hướng...");
        message.success("Đăng nhập thành công!");
        navigate("/", { replace: true });
      } catch (error) {
        logger.error("OAuth callback error:", error);
        message.error(error.message || "Có lỗi khi xử lý OAuth");
        navigate("/login", { replace: true });
      }
    };

    executeOAuthLogin();
  }, [login, navigate, redirectUri, searchParams]);

  return (
    <div className="login-page">
      <div className="login-card" style={{ padding: "32px" }}>
        <div className="login-header" style={{ padding: 0 }}>
          <h2 style={{ margin: 0, color: "#1f2937" }}>OAuth Callback</h2>
          <p style={{ marginTop: "10px" }}>{status}</p>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
