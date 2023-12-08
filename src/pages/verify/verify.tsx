import { Button, Col, Form, Input, Row, notification } from "antd";
import React, { useState } from "react";
import { RouteChildrenProps } from "react-router";
import banner from "../../assets/images/banner/c.jpg";
import { useDispatch } from "react-redux";
import { getUser } from "../../redux/slices/user";
import axios from "axios";

interface Props extends RouteChildrenProps {}

const VerifyPage: React.FC<Props> = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [form] = Form.useForm(); // Hook to use the form instance
  const showNotification = () => {
    notification.success({
      className: "notification__item",
      message: "Mã OTP hợp lệ",
      //   description: 'Sản phẩm đã được xóa thành công!',
      duration: 3,
    });
  };
  const showNotificationReload = () => {
    notification.success({
      className: "notification__item",
      message: "Mã OTP đã được gửi lại",
      //   description: 'Sản phẩm đã được xóa thành công!',
      duration: 3,
    });
  };
  const showNotificationReloadError = () => {
    notification.success({
      className: "notification__item",
      message: "Gửi mã thất bại",
      //   description: 'Sản phẩm đã được xóa thành công!',
      duration: 3,
    });
  };
  const showNotificationError = () => {
    notification.success({
      className: "notification__item",
      message: "Mã OTP hết hạn hoặc không đúng",
      //   description: 'Sản phẩm đã được xóa thành công!',
      duration: 3,
    });
  };
  const onFinish = async (values: { [key: string]: string }) => {
    try {
      const otpDigits = [];
      for (let index = 1; index <= 6; index++) {
        const digitKey = `digit-${index}`;
        const digitValue = values[digitKey].trim();
        otpDigits.push(digitValue);
      }
  
      const otp = otpDigits.join('');
  
      // Validate or process the concatenated string as needed
      console.log("Entered digits:", otp);
  
      // Extract email and otp values from the form
      const email = values.email.trim();
  
      // Call the API
      const response = await axios.post(
        "http://localhost:8080/api/auth/verify-otp-registration",
        {
          email,
          otp,
        }
      );
      showNotification()
      setTimeout(() => {
        window.location.href = '/SignIn';
      }, 3000); // Thời gian chờ 3 giây (3000 milliseconds
      
      console.log("API response:", response.data);
      // Your existing code...
    } catch (error) {
      console.error("API call error:", error);
      // You can add notification or other error handling logic here
    }
  };
  

  const handleKeyPress = (index: number) => {
    if (index < 5) {
      // Focus on the next input field
      form.getFieldInstance(`digit-${index + 1}`).focus();
    } else {
      // If the last input is reached, submit the form
      form.submit();
    }
  };

  const handleResend = async () => {
    try {
      const email = form.getFieldValue('email');
  
      // Add your logic to resend the OTP by calling the API
      const response = await axios.post(
        "http://localhost:8080/api/auth/re-generate-otp",
        { email }
      );
  
      console.log("Resend API response:", response.data);
  
      showNotificationReload()
    } catch (error) {
      console.error("Resend API call error:", error);
      // Handle API call errors or show a notification for failure
      showNotificationReloadError()
    }
  };
  return (
    <div className="signIn">
      <Row>
        <Col span={12} className="signIn__banner">
          <img src={banner} alt="" />
        </Col>
        <Col span={12} className="signUp__content">
          <h2 className="signIn__content--title">Watch Store</h2>
          <p className="signIn__content--desc">Nhập mã xác thực</p>
          <Form form={form} onFinish={onFinish}>
            <Row gutter={16}>
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <Col key={index} span={4}>
                  <Form.Item
                    name={`digit-${index}`}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số",
                      },
                      {
                        pattern: /^\d{1}$/,
                        message: "Vui lòng chỉ nhập 1 số",
                      },
                    ]}
                  >
                    <Input
                      maxLength={1}
                      onPressEnter={() => handleKeyPress(index)}
                    />
                  </Form.Item>
                </Col>
              ))}
              {/* Additional Input for Email */}
              <Col span={24}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập địa chỉ email",
                    },
                    {
                      type: "email",
                      message: "Email không hợp lệ",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Xác thực
              </Button>
              <Button onClick={handleResend} disabled={loading}>
                Gửi lại mã
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default VerifyPage;
