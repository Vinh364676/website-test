import { Button, Col, Radio, Rate, Row, Tabs, notification } from "antd";
import React, { useEffect, useState } from "react";
import product from "../../../assets/images/product-detail/1.png";
import product1 from "../../../assets/images/product-detail/2.png";
import product2 from "../../../assets/images/product-detail/3.png";
import product4 from "../../../assets/images/product-detail/4.png";
import "./ProductDetail.scss";
import DiliverIcon from "../../../assets/svg/deliver/diliver";
import CardComponent from "../card-component/CardComponent";
import NewProduct from "../home-page/new-product/NewProduct";
import RateCustomer from "./rateCustomer/rateCustomer";
import BannerComponent from "../banner/BannerComponent";
import { dispatch, useSelector } from "../../../redux/store";
import { getCategory } from "../../../redux/slices/category";
import { getOneProduct } from "../../../redux/slices/product";
import { useParams } from "react-router";
import LocalUtils from "../../../utils/local";
import { LOCAL_STORAGE_KEYS } from "../../../constants/local";
import jwt from "jsonwebtoken";
import { useAuthContext } from "../../../hooks/useAuthContext";
const items = [
  {
    key: "1",
    label: "Thông tin bổ sung",
    children: "Content of Tab Pane 1",
  },
  {
    key: "2",
    label: "Đánh giá",
    children: <RateCustomer />,
  },
];
const ProductDetailPage = () => {
  const { isAuthenticated } = useAuthContext();
  const productDetail = useSelector((state) => state.product.productDetail);

  const params = useParams<{ id: any }>();
  console.log("====================================");
  console.log("productDetail", productDetail);
  console.log("====================================");

  useEffect(() => {
    if (params) {
      dispatch(getOneProduct(params.id));
    }
  }, [params]);

  const imageArray = productDetail.img.split(",");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  useEffect(() => {
    if (selectedImage === null && imageArray.length > 0) {
      setSelectedImage(productDetail.thumnail);
    }
  }, []);
  const handleImageClick = (imagePath: any) => {
    setSelectedImage(imagePath);
  };

  console.log("====================================");
  console.log(imageArray[0]);
  console.log("====================================");
  const formattedPrice = (+productDetail.price).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  const showNotification = () => {
    notification.success({
      className: "notification__item",
      message: "Thêm vào giỏ hàng thành công",
      //   description: 'Sản phẩm đã được xóa thành công!',
      duration: 3,
    });
  };
  
  const showNotificationLogin = () => {
    notification.error({
      className: "notification__item notification__item--error",
      message: "Đăng nhập để thêm sản phẩm vào giỏ hàng",
     
      duration: 3,
    });
  };
  const handleCart = (productId: any) => {
    console.log("====================================");
    console.log("productId", productId);
    console.log("====================================");
    const accessToken = LocalUtils.get(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);

    // Decode the access token and explicitly assert the type
    const decodedToken = accessToken
      ? (jwt.decode(accessToken) as jwt.JwtPayload)
      : null;

    // Check if decodedToken is not null and has the expected property
    const username =
      decodedToken && typeof decodedToken === "object"
        ? decodedToken[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
          ]
        : null;
    try {
      showNotification();
      const productSessionStorageKey = `productList_${username}`;
      let productList: { id: string; quantity: number }[] = [];

      // Get the product list from sessionStorage
      const productSessionStorage = sessionStorage.getItem(
        productSessionStorageKey
      );

      // If there is data in sessionStorage, retrieve and convert it to an array of objects
      if (productSessionStorage) {
        productList = JSON.parse(productSessionStorage);
      }

      // Check if productId already exists in the list
      const existingIndex = productList.findIndex(
        (item) => item.id === productId
      );

      if (existingIndex !== -1) {
        // If it exists, increment the quantity
        console.log(
          `Product with ID ${productId} already exists. Incrementing quantity.`
        );
        // Example: incrementing quantity by 1
        productList[existingIndex].quantity += 1;
      } else {
        // If it doesn't exist, add it to the list with a quantity of 1
        productList.push({ id: productId, quantity: 1 });
      }

      // Save the product list to sessionStorage after converting it to a JSON string
      sessionStorage.setItem(
        productSessionStorageKey,
        JSON.stringify(productList)
      );

      console.log("Clicked on product with ID:", productId);

      // Return the new array containing the id and quantity of the added product
      return [
        {
          id: productId,
          quantity:
            productList.find((item) => item.id === productId)?.quantity || 1,
        },
      ];
    } catch (error) {
      console.error("Error handling product:", error);
      return []; // Return an empty array if there's an error
    }
  };
  return (
    <div className=" prDetail">
      <BannerComponent
        title="Chi tiết sản phẩm"
        desc="Đồng hồ sang trọng, hiện đại, đồng hành lý tưởng cho phong cách cá nhân."
      />
      <div className="containerCustom sectionCustom">
        <Row>
          <Col xl={12}>
            <Row>
              <Col xl={24}>
                {selectedImage !== null && (
                  <div className="prDetail__container">
                    <img
                      src={selectedImage}
                      alt="Selected Image"
                      className="prDetail__imgView"
                    />
                  </div>
                )}
              </Col>
              <Col xl={24}>
                <Row className="prDetail__children">
                  {imageArray.map((image, index) => (
                    <div
                      className="prDetail__children__img"
                      key={index}
                      onClick={() => handleImageClick(image)}
                    >
                      <img
                        src={image}
                        alt=""
                        style={{ cursor: "pointer" }}
                        className="imgChildren"
                      />
                    </div>
                  ))}
                </Row>
              </Col>
            </Row>
          </Col>
          <Col xl={12} className="prDetail__right">
            <h2 className="title">{productDetail.productName}</h2>
            <h5>{formattedPrice}</h5>
            <div className="prDetail__right__container">
              <div className="subTitle prDetail__right__container__buy">
                Đã bán 5
              </div>
              <div className="prDetail__right__rate">
                <p className="subTitle rateItem__text">5</p>
                <Rate disabled defaultValue={5} className="rateItem" />
              </div>
            </div>
            <div className="prDetail__right__color">
              <p className="subTitle prDetail__right__color--title">Màu sắc</p>
              <Radio.Group
                defaultValue="a"
                className="prDetail__right__color__group"
              >
                <Radio.Button
                  value="a"
                  className="prDetail__right__color__item"
                  style={{ background: productDetail.color }}
                ></Radio.Button>
                {/* <Radio.Button value="b">Shanghai</Radio.Button>
              <Radio.Button value="c">Beijing</Radio.Button>
              <Radio.Button value="d">Chengdu</Radio.Button> */}
              </Radio.Group>
            </div>

            <p className="subTitle prDetail__right__descItem">
              {productDetail.description}
            </p>
            <div className="prDetail__right__buttonItem">
              <Button className="buttonHeart">Thêm vào yêu thích</Button>
              {isAuthenticated ? (
                <Button
                  className="buttonCart"
                  onClick={() => handleCart(productDetail.productId)}
                >
                  Thêm vào giỏ hàng
                </Button>
              ) : (
                <Button
                  className="buttonCart"
                  onClick={showNotificationLogin}
                >
                  Thêm vào giỏ hàng
                </Button>
              )}
            </div>
            <div className="prDetail__foo">
              <div className="prDetail__right__footer">
                <DiliverIcon />
                <div className="prDetail__right__footer__text">
                  <span className="prDetail__right__footer__text--title">
                    Giao hàng miễn phí
                  </span>
                  <span className="prDetail__right__footer__text--desc">
                    1-2 ngày
                  </span>
                </div>
              </div>
              <div className="prDetail__right__footer">
                <DiliverIcon />
                <div className="prDetail__right__footer__text">
                  <span className="prDetail__right__footer__text--title">
                    Free Delivery
                  </span>
                  <span className="prDetail__right__footer__text--desc">
                    1-2 day
                  </span>
                </div>
              </div>
              <div className="prDetail__right__footer">
                <DiliverIcon />
                <div className="prDetail__right__footer__text">
                  <span className="prDetail__right__footer__text--title">
                    Bảo hành
                  </span>
                  <span className="prDetail__right__footer__text--desc">
                    1 năm
                  </span>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <Tabs
          defaultActiveKey="2"
          items={items}
          centered={true}
          className="tabDetail"
        />
        <Row gutter={[24, 0]} className="Similar">
          <div className="prSimilar ">
            <h2 className="title prSimilar__title">Sản phẩm tương tự</h2>
            <p className="subTitle prSimilar__desc">
              Đồng hồ thanh lịch - hoàn hảo cho mọi khoảnh khắc.
            </p>
          </div>

          <Col xl={6} className="">
            {/* <CardComponent/>
            </Col> 
            <Col xl={6} className="">
            <CardComponent/>
            </Col> 
            <Col xl={6} className="">
            <CardComponent/>
            </Col> 
            <Col xl={6} className="">
            <CardComponent/> */}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ProductDetailPage;
