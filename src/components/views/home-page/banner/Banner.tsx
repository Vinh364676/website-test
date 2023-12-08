import { Carousel } from 'antd';
import React from 'react';
import banner1 from "../../../../assets/images/banner/slide1.jpg";
const contentStyle = {
  height: '630px',
  color: '#fff',
  lineHeight: '160px',
  background: `url(${banner1})`
};
const BannerComponent = () => (
  <Carousel autoplay className=''>
    <div>
      <h3 style={contentStyle} className='banner'>1</h3>
    </div>
    <div>
      <h3 style={contentStyle}>2</h3>
    </div>
    <div>
      <h3 style={contentStyle}>3</h3>
    </div>
    <div>
      <h3 style={contentStyle}>4</h3>
    </div>
  </Carousel>
);
export default BannerComponent;