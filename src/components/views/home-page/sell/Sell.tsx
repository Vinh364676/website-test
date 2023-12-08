import { Button, Card, Col, Row } from 'antd';
import React from 'react';
import "./Sell.scss";
import sell1 from "../../../../assets/images/sell/sell1.svg";
import sell2 from "../../../../assets/images/sell/sell2.png";
import { ArrowRightOutlined } from '@ant-design/icons';
const Sell = () => {
    return (
        <div className='containerCustom sell sectionCustom'>
            <Row>
                <Col xl={8} > 
                <p>Top 3</p>
                <h2 className='sell__productName'>Sản phẩm</h2>
                <p>Bán chạy nhất</p>
                </Col>
                <Col xl={16}>
                    
                    <Row  gutter={[24,0]}>
                    <Col xl={12}>
                    <Card className='sell__card'>
                        <div className='sell__card__title'>
                        <h5 className='sell__card__title--h5'>Living Room</h5>
                        <Button className='sell__card__title__button'><span className='subTitle'>Shop Now</span> <ArrowRightOutlined /></Button>
                        </div>
                        <img src={sell1} alt="" />
                    </Card>
                </Col>
                <Col xl={12}>
                    <Row gutter={[0,24]}>
                    <Col xl={24}>
                    <Card className='sell__card'>
                        <div className='sell__card__title'>
                        <h5 className='sell__card__title--h5'>Bedroom</h5>
                        <Button className='sell__card__title__button'><span className='subTitle'>Shop Now</span> <ArrowRightOutlined /></Button>
                        </div>
                        <img src={sell2} alt="" />
                    </Card>
                    </Col>
                    <Col xl={24}>
                    <Card className='sell__card'>
                        <div className='sell__card__title'>
                        <h5 className='sell__card__title--h5'>Kitchen</h5>
                        <Button className='sell__card__title__button'><span className='subTitle'>Shop Now</span> <ArrowRightOutlined /></Button>
                        </div>
                        <img src={sell2} alt="" />
                    </Card>
                    </Col>
                    </Row>
                    
                </Col>
                    </Row>
                </Col>
                
            </Row>
        </div>
    );
};

export default Sell;