import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Result, Button, Spin, Row, Col, Descriptions } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useCart } from '../../context/CartContext';
import './PaymentCallback.css';

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    const parsePaymentData = () => {
      try {
        const success = searchParams.get('success') === 'true';
        const orderId = searchParams.get('orderId');
        const transactionId = searchParams.get('transactionId');
        const responseCode = searchParams.get('responseCode');
        const message = searchParams.get('message');
        const paymentStatusStr = searchParams.get('paymentStatus');

        const data = {
          success,
          orderId: orderId ? parseInt(orderId) : null,
          transactionId,
          responseCode,
          message,
          paymentStatus: paymentStatusStr,
        };

        setPaymentData(data);
        setPaymentStatus(success ? 'success' : 'error');

        // Handle cancellation - redirect after 2 seconds
        if (!success && responseCode === '24') {
          setTimeout(() => {
            window.location.href = `${window.location.origin}/checkout?cancelled=true`;
          }, 2000);
        }
      } catch (error) {
        console.error('Error parsing payment data:', error);
        setPaymentStatus('error');
      } finally {
        setLoading(false);
      }
    };

    parsePaymentData();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="payment-callback-container">
        <Spin size="large" tip="Đang xử lý kết quả thanh toán..." />
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="payment-callback-container">
        <Result
          status="error"
          title="Lỗi"
          subTitle="Không thể lấy thông tin thanh toán"
          extra={
            <Button type="primary" onClick={() => navigate('/')}>
              Về trang chủ
            </Button>
          }
        />
      </div>
    );
  }

  const { success, orderId, transactionId, responseCode, message: resultMessage, paymentStatus: paymentStatusFromData } = paymentData;

  // Clear cart only after successful payment
  useEffect(() => {
    if (success && !loading) {
      clearCart();
    }
  }, [success, loading, clearCart]);

  const responseCodeMap = {
    '00': 'Giao dịch thành công',
    '01': 'Không tìm thấy thanh toán',
    '02': 'Giao dịch bị từ chối',
    '04': 'Số tiền không khớp',
    '24': 'Giao dịch bị hủy',
    '97': 'Chữ ký không hợp lệ',
    '99': 'Lỗi khác',
  };

  const getResponseCodeMessage = (code) => {
    return responseCodeMap[code] || `Mã lỗi: ${code}`;
  };

  return (
    <div className="payment-callback-container">
      {success ? (
        <Result
          status="success"
          icon={<CheckCircleOutlined className="success-icon" />}
          title="Thanh toán thành công!"
          subTitle="Đơn hàng của bạn đã được xác nhận. Chúng tôi sẽ sớm xử lý và gửi hàng cho bạn."
          extra={[
            <Button type="primary" key="orders" onClick={() => navigate('/checkout')}>
              Xem đơn hàng
            </Button>,
            <Button key="home" onClick={() => navigate('/')}>
              Về trang chủ
            </Button>,
          ]}
        >
          <Row style={{ marginTop: '24px', justifyContent: 'center' }}>
            <Col xs={24} sm={20} md={16} lg={12}>
              <Descriptions
                column={1}
                bordered
                size="small"
                items={[
                  {
                    key: '1',
                    label: 'Mã đơn hàng',
                    children: `#${orderId}`,
                  },
                  {
                    key: '2',
                    label: 'Mã giao dịch',
                    children: transactionId || 'N/A',
                  },
                  {
                    key: '3',
                    label: 'Trạng thái',
                    children: <span style={{ color: '#52c41a' }}>{paymentStatusFromData === 'PAID' ? 'Đã thanh toán' : 'Đang xử lý'}</span>,
                  },
                ]}
              />
            </Col>
          </Row>
        </Result>
      ) : (
        <Result
          status="error"
          icon={<CloseCircleOutlined className="error-icon" />}
          title={responseCode === '24' ? "Giao dịch đã bị hủy" : "Thanh toán thất bại"}
          subTitle={responseCode === '24' ? "Giao dịch của bạn đã bị hủy. Hệ thống sẽ chuyển hướng bạn về trang chọn phương thức thanh toán..." : (resultMessage || getResponseCodeMessage(responseCode))}
          extra={responseCode === '24' ? [
            <Button type="primary" key="back" onClick={() => navigate('/checkout?cancelled=true')}>
              Quay lại thanh toán
            </Button>,
            <Button key="home" onClick={() => navigate('/')}>
              Về trang chủ
            </Button>,
          ] : [
            <Button type="primary" key="retry" onClick={() => navigate('/checkout')}>
              Thử lại
            </Button>,
            <Button key="home" onClick={() => navigate('/')}>
              Về trang chủ
            </Button>,
          ]}
        >
          <Row style={{ marginTop: '24px', justifyContent: 'center' }}>
            <Col xs={24} sm={20} md={16} lg={12}>
              <Descriptions
                column={1}
                bordered
                size="small"
                items={[
                  {
                    key: '1',
                    label: 'Mã đơn hàng',
                    children: orderId ? `#${orderId}` : 'N/A',
                  },
                  {
                    key: '2',
                    label: 'Mã lỗi',
                    children: responseCode || 'N/A',
                  },
                  {
                    key: '3',
                    label: 'Chi tiết',
                    children: getResponseCodeMessage(responseCode),
                  },
                ]}
              />
            </Col>
          </Row>
        </Result>
      )}
    </div>
  );
};

export default PaymentCallback;
