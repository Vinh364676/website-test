import { Button, Carousel, Col, Row } from "antd";
import React from "react";
import { ArrowRightOutlined } from "@ant-design/icons";
import banner from "../../../../assets/images/new/banner.png";
import "./Sale.scss";

const SaleComponent = () => {
  const contentStyle = {
    height: "160px",
    color: "#fff",
    lineHeight: "160px",
    // textAlign: 'center',
    // background: '#364d79',
  };
  return (
    //   <div className='saleComponent'>
    //            <Row gutter={72}>
    //   <Col span={12} className="newProduct__banner">
    //     <img src={banner} alt="" />
    //   </Col>
    //   <Col span={12} className="newProduct__banner__right">
    //     <div className="">
    //     <p className="newProduct__banner__right--topTitle">SALE UP TO 35% OFF</p>
    //     <h4 className="newProduct__banner__right--content">HUNDREDS of <p>New lower prices!</p> </h4>
    //     <p className="newProduct__banner__right--botTitle">It’s more affordable than ever to give every room in your home a stylish makeover</p>
    //     <Button className='sell__card__title__button newProduct__banner__right__button'><span className='subTitle'>Shop Now</span> <ArrowRightOutlined /></Button>
    //     </div>

    //   </Col>
    // </Row>
    //  </div>
    <div className="saleComponent">
      <Row gutter={56}>
        <Col span={12} className="newProduct__banner">
          <Carousel>
            <div className="saleComponent__left">
              <div className="saleComponent__shape">
                <div className="saleComponent__shape__img">
                  <img src={banner} alt="" />
                </div>
              </div>
            </div>
            <div className="saleComponent__left">
              <div className="saleComponent__shape">
                <div className="saleComponent__shape__img">
                  <img src={banner} alt="" />
                </div>
              </div>
            </div>
          </Carousel>
        </Col>
        <Col span={12} className="newProduct__banner__right">
          <div className="">
            <p className="newProduct__banner__right--topTitle saleComponent--topTitle">
              SALE UP TO 35% OFF
            </p>
            <h4 className="newProduct__banner__right--content saleComponent--content">
              HUNDREDS of <p>New lower prices!</p>{" "}
            </h4>
            <p className="newProduct__banner__right--botTitle saleComponent--botTitle">
              It’s more affordable than ever to give every room in your home a
              stylish makeover
            </p>
            <Button className="sell__card__title__button newProduct__banner__right__button">
              <span className="subTitle">Shop Now</span> <ArrowRightOutlined />
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default SaleComponent;
