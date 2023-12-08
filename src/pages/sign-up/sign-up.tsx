import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Radio,
  Row,
  notification,
} from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { RouteChildrenProps } from "react-router";
import { Link } from "react-router-dom";
import "./sign-up.scss";
import { useAuthContext } from "../../hooks/useAuthContext";
import banner from "../../assets/images/banner/c.jpg";
import {
  UserOutlined,
  LinkOutlined,
  MailOutlined,
  PhoneOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import accountService from "../../services/account/account.service";
import LocalUtils from "../../utils/local";
import { LOCAL_STORAGE_KEYS } from "../../constants/local";
import { ROUTE_PATHS } from "../../constants/url-config";
import { dispatch, useSelector } from "../../redux/store";
import { getUser } from "../../redux/slices/user";
import moment from "moment";
interface Props extends RouteChildrenProps {}

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const { userList } = useSelector((state) => state.user);
  console.log('====================================');
  console.log(userList);
  console.log('====================================');
  useEffect(() => {
    dispatch(getUser({ pageIndex: 1, pageSize: 100 }));
  }, []);
  const onFinish = async (values: any) => {
    try {
      setLoading(true);

      // Check if email or displayName already exists in the userList
      const isEmailExists = userList.some(
        (user) => user.email === values.email
      );
      const isDisplayNameExists = userList.some(
        (user) => user.displayName === values.displayName
      );

      if (isEmailExists) {
        // Display error notification and return without making the API call
        notification.error({
          className: "notification__item notification__item--error",
          message: "Lỗi",
          description: "Email đã tồn tại. Vui lòng chọn thông tin khác.",
          duration: 3,
        });
      } else if (isDisplayNameExists) {
        // Display error notification and return without making the API call
        notification.error({
          className: "notification__item notification__item--error",
          message: "Lỗi",
          description:
            "Tên đăng nhập đã tồn tại. Vui lòng chọn thông tin khác.",
          duration: 3,
        });
      } else {
        // Proceed with registration if email and displayName are unique
        const registerData = {
          firstName: values.firstName,
          lastName: values.lastName,
          gender: values.gender,
          displayName: values.displayName,
          phoneNumber: values.phoneNumber,
          dateOfBirth: values.dateOfBirth,
          email: values.email,
          password: values.password,
          address: "",
        };

        console.log("Before API call");
        const response = await accountService.register(registerData);
        console.log("After API call");
        console.log(response); // Log the API response for debugging
        notification.success({
          className: "notification__item",
          message: "Đăng ký thành công",
          duration: 3,
        });
        // setTimeout(function() {
        //   window.location.href = '/'; // Replace with the actual path to your home page
        // }, 3000);
        // Optionally, handle the success response here
      }
    } catch (error) {
      // Handle exceptions
      console.error(error);
      notification.error({
        message: "Lỗi",
        description:
          "Có lỗi xảy ra trong quá trình đăng ký. Vui lòng thử lại sau.",
      });
    } finally {
      setLoading(false);
    }
  };

  const [value, setValue] = useState(1);
  return (
    <div className="signIn">
      <Row>
        <Col span={12} className="signIn__banner">
          <img src={banner} alt="" />
        </Col>
        <Col span={12} className="signUp__content">
          <h2 className="signIn__content--title">Watch Store</h2>
          <p className="signIn__content--desc">Đăng ký tài khoản</p>
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
            requiredMark={"optional"}
            onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
            className="signUp__form"
          >
            <Row gutter={[20, 0]}>
              <Col xl={12}>
                <Form.Item
                  name="firstName"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập Họ, tên lót!",
                    },
                  ]}
                >
                  <Input
                    allowClear
                    bordered={false}
                    placeholder="Họ, tên lót"
                    prefix={<UserAddOutlined />}
                    className="signUp__input"
                  />
                </Form.Item>
              </Col>
              <Col xl={12}>
                <Form.Item
                  name="lastName"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tên!",
                    },
                  ]}
                >
                  <Input
                    allowClear
                    bordered={false}
                    placeholder="Tên"
                    prefix={<UserAddOutlined />}
                    className="signUp__input"
                  />
                </Form.Item>
              </Col>
              <Col xl={12}>
                <Form.Item name="gender">
                  <Radio.Group defaultValue={0} className="signUp__radio">
                    <Radio value={0}>Nam</Radio>
                    <Radio value={1}>Nữ</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col xl={12}>
                <Form.Item
                  name="dateOfBirth"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn ngày sinh!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const currentDate = moment();
                        if (value && value.isSameOrAfter(currentDate, 'day')) {
                          return Promise.reject('Ngày sinh không được lớn hơn hoặc bằng ngày hiện tại');
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <DatePicker
                    placeholder="Ngày sinh"
                    className="signUp__date"
                    format="DD-MM-YYYY"
                  />
                </Form.Item>
              </Col>
              <Col xl={12}>
              <Form.Item
        name="phoneNumber"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập số điện thoại!",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              // Sử dụng biểu thức chính quy để kiểm tra số điện thoại
              const phoneRegex = /^0\d{9,10}$/;
              if (value && !phoneRegex.test(value)) {
                return Promise.reject("Số điện thoại phải bắt đầu bằng 0 và đủ 10 hoặc 11 số!");
              }
              return Promise.resolve();
            },
          }),
        ]}
      >
                  <Input
                    allowClear
                    bordered={false}
                    placeholder="Điện thoại"
                    prefix={<PhoneOutlined />}
                    className="signUp__input"
                  />
                </Form.Item>
              </Col>
              <Col xl={12}>
                <Form.Item
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập email!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        // Sử dụng biểu thức chính quy để kiểm tra email
                        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
                        if (value && !emailRegex.test(value)) {
                          return Promise.reject("Email không hợp lệ! Vd:abc@abc.com");
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <Input
                    allowClear
                    bordered={false}
                    placeholder="Email"
                    prefix={<MailOutlined />}
                    className="signUp__input"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
        name="displayName"
        rules={[
          {
            required: true,
            message: 'Vui lòng nhập tên đăng nhập!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;

              if (specialCharacterRegex.test(value)) {
                return Promise.reject('Tên đăng nhập không được chứa kí tự đặc biệt!');
              }

              return Promise.resolve();
            },
          }),
        ]}
      >
              <Input
                allowClear
                bordered={false}
                placeholder="Tên đăng nhập"
                prefix={<UserOutlined />}
                className="signUp__input"
              />
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
              <Input.Password
                allowClear
                bordered={false}
                placeholder="Nhập mật khẩu"
                prefix={<LinkOutlined />}
                className="signUp__input"
              />
            </Form.Item>
            <div className="signIn__form__option">
              <p className="signIn__form__option">
                Bạn đã có tài khoản?{" "}
                <Link to={ROUTE_PATHS.SignIn}>Đăng nhập ngay</Link>
              </p>
            </div>
            <Button className="signUp__button" type="primary" htmlType="submit">
              Đăng ký
            </Button>
          </Form>
        </Col>
      </Row>
    </div>
  );
}
