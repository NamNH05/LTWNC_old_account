import jwt, { SignOptions } from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import { env } from "../config/env";

export type AccessTokenPayload = {
  sub: string;
  email: string;
  role: UserRole;
  type: "access";
};

export type RefreshTokenPayload = {
  sub: string;
  sid: string;
  type: "refresh";
};

export type ResetTokenPayload = {
  sub: string;
  jti: string;
  type: "reset-password";
};

const signToken = (payload: object, expiresIn: string) => {
  const ttl = expiresIn as NonNullable<SignOptions["expiresIn"]>;
  const options: SignOptions = { expiresIn: ttl };
  return jwt.sign(payload, env.jwtSecret, options);
};

export const signAccessToken = (payload: Omit<AccessTokenPayload, "type">) => {
  return signToken({ ...payload, type: "access" }, env.accessTokenTtl);
};

export const signRefreshToken = (payload: Omit<RefreshTokenPayload, "type">) => {
  return signToken({ ...payload, type: "refresh" }, env.refreshTokenTtl);
};

export const signResetPasswordToken = (payload: Omit<ResetTokenPayload, "type">) => {
  return signToken({ ...payload, type: "reset-password" }, env.resetTokenTtl);
};

export const verifyToken = <T>(token: string) => {
  return jwt.verify(token, env.jwtSecret) as T;
};
