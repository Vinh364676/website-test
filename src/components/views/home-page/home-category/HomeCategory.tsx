import { Col, Row } from 'antd';
import React from 'react';
import './HomeCategory.scss';
import category1 from "../../../../assets/images/category/category3.jpg"
import category2 from "../../../../assets/images/category/category7.jpg"
import category4 from "../../../../assets/images/category/category4.jpg"
import category5 from "../../../../assets/images/category/category5.jpg"
import category6 from "../../../../assets/images/category/category6.jpg"
const HomeCategory = () => {
    return (
        <div className='homeCategory'>
            <Row gutter={[10,0]}>
                <Col xl={8} className='homeCategory__right'>
                    <div className='homeCategory__item'>
                    <img src={category5} alt=""  className='homeCategory__item__img'/>
                    </div>
                </Col>
                <Col xl={8} className='homeCategory__right'>
                    
                    <Row gutter={[0,8]}>
                        <Col xl={24}>
                        <div className='homeCategory__item'>
                    <img src={category2} alt=""  className='homeCategory__item__img'/>
                    </div>
                        </Col>
                        <Col xl={24}>
                        <div className='homeCategory__item'>
                    <img src={category2} alt=""  className='homeCategory__item__img'/>
                    </div>
                        </Col>
                    </Row>
                </Col>
                <Col xl={8} className='homeCategory__right'>
                <div className='homeCategory__item'>
                    <img src={category6} alt=""  className='homeCategory__item__img'/>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default HomeCategory;