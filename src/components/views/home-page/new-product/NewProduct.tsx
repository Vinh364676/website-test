import React, { useEffect } from "react";
import "./NewProduct.scss";
import { Button, Col, Row } from "antd";
import { ArrowRightOutlined } from '@ant-design/icons';
import deliver from "../../../../assets/images/new/deliveri.png";
import banner from "../../../../assets/images/new/banner.png";
import CardComponent from "../../card-component/CardComponent";
import { ROUTE_PATHS } from "../../../../constants/url-config";
import { dispatch, useSelector } from "../../../../redux/store";
import { getProduct } from "../../../../redux/slices/product";
import { getBrand } from "../../../../redux/slices/brand";
const NewProduct = () => {
  const {productList} = useSelector(state => state.product)
  const {brandList} = useSelector(state => state.brand)
  useEffect(() => {
    dispatch(getProduct({ pageIndex: 1, pageSize: 100 }));
    dispatch(getBrand({ pageIndex: 1, pageSize: 100 }));
  }, []);
  const filteredProducts = productList.filter(product => product.status === "2");
  return (
    <div className="containerCustom newProduct sectionCustom">
        <div className="newProduct__header">
        <h2 className="newProduct__header__title title">Mới nhất</h2>
      <Button className="newProduct__header__button"><span className="subTitle">Xem thêm</span> <ArrowRightOutlined /></Button>
        </div>
        <Row gutter={24} className="newProduct__product">
  {filteredProducts.slice(0, 4).map((product, index) => {
    const brand = brandList.find(brand => brand.idBrand === product.brandId);
    const handleItem = ( productId: string) => {
   
    };
  
    return (
      <Col xl={6} key={index}> {/* Added key prop to Col for React performance */}
        <CardComponent
          href={ROUTE_PATHS.ProductDetail.replace(":id", product.productId.toString())}
          image={product.thumnail} 
          name={product.productName}
          brand={brand ? brand.name : 'Unknown Brand'}
          price={product.price}
          productId={product.productId.toString()}
  onClickItem={(productId) => handleItem(productId)}
        />
      </Col>
    );
  })}
</Row>
        
        {/* <Row gutter={24} className="sectionCustom">
        <Col xl={6} className="newProduct__footer">
          <div className="newProduct__footer__item">
          <img src={deliver} alt="" className="newProduct__footer__item--img"/>
          <h5 className="newProduct__footer__item--title">Free Shipping</h5>
          <p className="newProduct__footer__item--desc">Order above $200</p>
          </div>
        </Col>
        <Col xl={6} className="newProduct__footer">
          <div className="newProduct__footer__item">
          <img src={deliver} alt="" className="newProduct__footer__item--img"/>
          <h5 className="newProduct__footer__item--title">Free Shipping</h5>
          <p className="newProduct__footer__item--desc">Order above $200</p>
          </div>
          
        </Col>
        <Col xl={6} className="newProduct__footer">
          <div className="newProduct__footer__item">
          <img src={deliver} alt="" className="newProduct__footer__item--img"/>
          <h5 className="newProduct__footer__item--title">Free Shipping</h5>
          <p className="newProduct__footer__item--desc">Order above $200</p>
          </div>
          
        </Col>
        <Col xl={6} className="newProduct__footer">
          <div className="newProduct__footer__item">
          <img src={deliver} alt="" className="newProduct__footer__item--img"/>
          <h5 className="newProduct__footer__item--title">Free Shipping</h5>
          <p className="newProduct__footer__item--desc">Order above $200</p>
          </div>
          
        </Col>
        
      </Row> */}


      </div>
  );
};

export default NewProduct;
