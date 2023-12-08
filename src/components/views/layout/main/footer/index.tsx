import { Button, Col, Form, Input, Row } from "antd";
import "./index.scss";
import { MailOutlined } from '@ant-design/icons';
import logoFooter from "../../../../../assets/images/footer/logo.png";
import ins from "../../../../../assets/images/footer/instagram.svg";
import facebook from "../../../../../assets/images/footer/facebook.svg";
import ytb from "../../../../../assets/images/footer/youtube.svg";
type Props = {};
const MainFooter = (props: Props) => {
  return (
    <>
     <Row className="contact">
        <div className="contact__item">
            <h4 className="contact__item--title">Join Our Newsletter</h4>
            <p className="contact__item--desc">Sign up for deals, new products and promotions</p>

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
      className="contact__form"
    //   onFinish={onFinish}
    //   onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
        <Row>
            <Col><Form.Item
        name="username"
      >
        <Input bordered={false} prefix={<MailOutlined />} placeholder="Email của bạn" className="form__input"/>
      </Form.Item></Col>
      <Col><Form.Item
        wrapperCol={{
          offset: 24,
          span: 24,
        }}
      >
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item></Col>
        </Row>
    </Form>
        </div>
     </Row>
     <Row className="footer containerCustom">
        <div className="footer__top">
        <Col xl={12} className="footer__left">
        <img src={logoFooter} alt="" className="footer__left__img"/>
        <span className="footer__left__title">Gift & Decoration Store</span>
        </Col>
        <Col xl={12}>
            <ul className="footer__right">
                <li>Home</li>
                <li>Shop</li>
                <li>Product</li>
                <li>Blog</li>
                <li>Contact Us</li>
            </ul>
        </Col>
        </div>
        
       <div className="footer__bottom">
        <Col className="footer__bottom__layout">
            <ul className="footer__bottom__item">
                <li>Copyright © 2023 3legant. All rights reserved</li>
                <li>Privacy Policy</li>
                <li>Terms of Use</li>
            </ul>
            <div className="footer__bottom__item__right">
                <img src={ins} alt="" />
                <img src={facebook} alt="" />
                <img src={ytb} alt="" />
            </div>
        </Col>
       </div>
        
     </Row>
    </>
  );
};

export default MainFooter;
