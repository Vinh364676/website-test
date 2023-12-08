import { Button, Col, Form, Input, Row, Table, notification } from "antd";
import React, { useEffect } from "react";
import cartImg from "../../../assets/images/product/cart.png";
import { MinusOutlined, PlusOutlined,DeleteOutlined } from "@ant-design/icons";
import productImg from "../../../assets/images/product/newproduct1.png"
import "./Cart.scss";
import { Link } from "react-router-dom";
import { ROUTE_PATHS } from "../../../constants/url-config";
import { dispatch, useSelector } from "../../../redux/store";
import { getProduct } from "../../../redux/slices/product";
import LocalUtils from "../../../utils/local";
import { LOCAL_STORAGE_KEYS } from "../../../constants/local";
import jwt from 'jsonwebtoken';
const Cart = () => {
  const showNotification = () => {
    notification.success({
      className: "notification__item",
      message: "Xóa thành công",
      //   description: 'Sản phẩm đã được xóa thành công!',
      duration: 3,
      onClose: () => {
        // Reload the page after the notification is closed
        setTimeout(() => {
          window.location.reload();
        },0); // Adjust the delay as needed
      },
    });
  };
  const handleQuantityChange = (recordKey: string, action: 'increment' | 'decrement') => {
    // Get the stored product list from sessionStorage
    const storedProductListString = sessionStorage.getItem(productSessionStorageKey);
  
    if (storedProductListString) {
      // Parse the stored product list
      let storedProductList = JSON.parse(storedProductListString);
  
      // Find the product in the stored list
      const index = storedProductList.findIndex((item: any) => String(item.id) === recordKey);
  
      if (index !== -1) {

        if (action === 'increment') {
          storedProductList[index].quantity += 1;
        } else if (action === 'decrement' && storedProductList[index].quantity > 1) {
          storedProductList[index].quantity -= 1;
        }
        sessionStorage.setItem(productSessionStorageKey, JSON.stringify(storedProductList));
        window.location.reload();
      }
    }
  };
  
  const handleDeleteProduct = (record:any) => {

    // Lấy danh sách sản phẩm từ sessionStorage
    const storedProductListString = sessionStorage.getItem(productSessionStorageKey);
  
    if (storedProductListString) {
      let storedProductList = JSON.parse(storedProductListString);
  
      // Loại bỏ sản phẩm có id tương ứng
      storedProductList = storedProductList.filter((item:any) => String(item.id) !== String(record.key));
  
      // Cập nhật lại sessionStorage
      sessionStorage.setItem(productSessionStorageKey, JSON.stringify(storedProductList));
      showNotification()
      // Hiển thị thông báo xóa thành công
      // message.success('Sản phẩm đã được xóa thành công!');
    } else {
      // Hiển thị thông báo nếu danh sách sản phẩm trống
      // message.warning('Danh sách sản phẩm trống!');
    }
  };
  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "name",
      width: 380,
      render: (text: any, record: any) => (
        <div className="cart__table__name">
          <img
            // className="product__table__img"
            src={record.image}
            style={{ width: "50px" }}
          />
          <span>
          {text}
          </span>
        </div>
      ),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity', // Use a unique dataIndex for 'Số lượng'
      key: 'quantity',
      width: 180,
      render: (text: any, record: any) => (
        <div>
          <Button
          className="cart__buttonQuantity"
            type="primary"
            onClick={() => handleQuantityChange(record.key, 'decrement')}
          ><MinusOutlined /></Button>
          <span className="cart__buttonQuantity__span">{text}</span>
          <Button
          className="cart__buttonQuantity"
            type="primary"
            onClick={() => handleQuantityChange(record.key, 'increment')}
          ><PlusOutlined /></Button>
        </div>
      ),
    },
    {
      title: 'Giá tiền',
      dataIndex: 'total',
      key: 'total',
      width: 280,
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      width: 80,
      key: 'action',
      render: (text: any, record: any) => (
        <Button
        onClick={() => handleDeleteProduct(record)}
        >
          <DeleteOutlined />
        </Button>
      ),
    },
  ];


  const { productList } = useSelector((state) => state.product);
  useEffect(() => {
    dispatch(getProduct({ pageIndex: 1, pageSize: 100 }));
  }, []);
  // Assuming you have a constant LOCAL_STORAGE_KEYS.ACCESS_TOKEN defined
const accessToken = LocalUtils.get(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);

// Decode the access token and explicitly assert the type
const decodedToken = accessToken ? jwt.decode(accessToken) as jwt.JwtPayload : null;

// Check if decodedToken is not null and has the expected property
const username = decodedToken && typeof decodedToken === 'object'
  ? decodedToken.userId
  : null;

  // Use the username to create the product session storage key
  const productSessionStorageKey = `productList_${username}`;

  // Get the product list from sessionStorage
  const storedProductListString = sessionStorage.getItem(productSessionStorageKey);
const storedProductList = storedProductListString ? JSON.parse(storedProductListString) : [];

const combinedProductList = productList.map((product) => {
  const storedProduct = storedProductList.find((item: any) => String(item.id) === String(product.productId));

  return {
    ...product,
    product: storedProduct ? storedProduct.id : 0,
    quantity: storedProduct ? storedProduct.quantity : 0,
  };
});


const data = combinedProductList
  .filter((product) => product.product !== 0)
  .map((product) => ({
    key: product.productId.toString(),
    name: product.productName,
    image: product.thumnail,
    quantity: product.quantity,
    total: product.quantity * product.price
  }));

  return (
    <div className="containerCustom sectionCustom cart">
      <Row gutter={[56,0]}> 
        <Col xl={16} className="cart__left">
          <h5>Shopping Cart</h5>
          <Table className="cart__table" pagination={false} columns={columns} dataSource={data} />
        </Col>
        <Col xl={8} className="cart__right">
          <h5>Order Summary</h5>
          <div className="cart__right__content">
          <p className="subTitle cart__right__content__subTotal">Tổng sản phẩm</p>
          <p className="subTitle cart__right__content__subTotal">{new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(
                  combinedProductList
                    .filter((product) => product.product !== 0)
                    .reduce(
                      (total, product) =>
                        total + product.price * product.quantity,
                      0
                    )
                )}</p>
          </div>
          <div className="cart__right__content">
          <p className="subTitle cart__right__content__text">Thuế</p>
          <p className="subTitle cart__right__content__text">8%</p>
          </div>
          <div className="cart__right__content">
          <p className="subTitle cart__right__content__subTotal">Tổng cộng</p>
          <p className="subTitle cart__right__content__subTotal">
  {new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(
    combinedProductList
      .filter((product) => product.product !== 0)
      .reduce(
        (total, product) => total + product.price * product.quantity,
        0
      ) *
      (1 + 0.08) // Adding 8% tax
  )}
</p>

          </div>
          <Link to={ROUTE_PATHS.Checkout}>
           <Button className="cart__right__checkout">Checkout</Button>
          
          </Link>
        </Col>
      </Row>
    </div>
  );
};

export default Cart;
