import { Button, Checkbox, Col, Form, Input, Row, notification } from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { RouteChildrenProps } from "react-router";
import { Link } from "react-router-dom";
import "./sign-in.scss";
import { useAuthContext } from "../../hooks/useAuthContext";
import banner from "../../assets/images/banner/c.jpg";
import { UserOutlined,LinkOutlined } from '@ant-design/icons';
import accountService from "../../services/account/account.service";
import LocalUtils from "../../utils/local";
import { LOCAL_STORAGE_KEYS } from "../../constants/local";
import { ROUTE_PATHS } from "../../constants/url-config";
import jwt from 'jsonwebtoken';
interface Props extends RouteChildrenProps {}

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuthContext();
  const onFinish = async (values: any) => {
  try {
    setLoading(true);
    const loginData = {
      email: values.username,
      password: values.password,
    };

    console.log("Before API call");
    const response = await accountService.login(loginData);
    console.log("After API call");
    console.log(response); // Log the API response for debugging

    if (response.status === 200) {
      const token = response.data.accessToken;
      LocalUtils.set(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, token);
      login(loginData.email, loginData.password);
      try {
        const decodedToken = jwt.decode(token);
        console.log('====================================');
        console.log("decodedToken",decodedToken);
        console.log('====================================');
  // Check if decodedToken is not null
  if (decodedToken && typeof decodedToken === 'object') {
    // Retrieve the email address (username) from the decoded token
    const username = decodedToken.userId;
  } else {
    console.error('Decoded token is null or not an object');
  }
      } catch (error) {
        //console.error('Error decoding token:', error.message);
      }
      notification.success({
        className: "notification__item",
        message: 'Đăng nhập thành công',
        description: `Xin chào, ${loginData.email}!`,
        duration: 3,
      });
      setTimeout(function() {
        window.location.href = '/'; // Replace with the actual path to your home page
      }, 3000);
    } else if (response.status === 401) {
      // Unauthorized - Incorrect email or password
      notification.error({
        message: 'Lỗi Đăng Nhập',
        description: 'Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng thử lại sau.',
      });
    } else {
      // Handle other error cases
      notification.error({
        message: 'Lỗi Đăng Nhập',
        description: 'Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng thử lại sau.',
      });
    }
  } catch (error) {
    // Handle exceptions
    console.error(error);
    notification.error({
      message: 'Lỗi',
      description: 'Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng thử lại sau.',
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="signIn">
      <Row>
        <Col span={12} className="signIn__banner">
			<img src={banner} alt="" />
		</Col>
        <Col span={12} className="signIn__content">
          <h2 className="signIn__content--title">Welcome</h2>
          <p className="signIn__content--desc">Đăng nhập với Email</p>
          <Form
            name="basic"
            labelCol={{
              span: 24,
            }}
            wrapperCol={{
              span: 24,
            }}
            initialValues={{
              remember: true,
            }}
			requiredMark ={"optional"}
             onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
			className="signIn__form"
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập email!",
                },
              ]}
            >
              <Input allowClear bordered={false} placeholder="Nhập email" prefix={<UserOutlined />} className="signIn__form__input"/>
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu!",
                },
              ]}
            >
              <Input.Password allowClear bordered={false} placeholder="Nhập mật khẩu" prefix={<LinkOutlined />} className="signIn__form__input"/>
            </Form.Item>
			  <div className="signIn__form__option">
				
				<Checkbox>Ghi nhớ mật khẩu</Checkbox>
					<Link to={ROUTE_PATHS.ForgotPassword}>
          <p className="signIn__form__option--forgot">Quên mật khẩu?</p>
          </Link>
			  </div>
			  <Button className="signIn__button" type="primary" htmlType="submit">
                Đăng nhập
              </Button>
          </Form>
        </Col>
      </Row>
    </div>
  );
}
