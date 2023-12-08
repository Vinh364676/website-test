import { Avatar, Button, Form, Input, Rate, Select, notification } from "antd";
import { UserOutlined } from "@ant-design/icons";
import React, { useEffect } from "react";
import "./rateCustom.scss";
import { dispatch, useSelector } from "../../../../redux/store";
import { createReview, getReview } from "../../../../redux/slices/review";
import { getOneProduct, getProduct } from "../../../../redux/slices/product";
import { useParams } from "react-router";
import { useAuthContext } from "../../../../hooks/useAuthContext";
import { getCustomer } from "../../../../redux/slices/customer";
import { getUser } from "../../../../redux/slices/user";
import LocalUtils from "../../../../utils/local";
import { LOCAL_STORAGE_KEYS } from "../../../../constants/local";
import jwt from 'jsonwebtoken';
const RateCustomer = () => {
  const {isAuthenticated} = useAuthContext();
  const { reviewList } = useSelector((state) => state.review);
  console.log('====================================');
  console.log("reviewList",reviewList);
  console.log('====================================');
  const { productList } = useSelector((state) => state.product);
  const { customerList } = useSelector((state) => state.customer);
  const { userList } = useSelector((state) => state.user);
  console.log('====================================');
  console.log("customerList",customerList);
  console.log('====================================');
  console.log('====================================');
  console.log("userList",userList);
  console.log('====================================');

  useEffect(() => {
    dispatch(getReview({ pageIndex: 1, pageSize: 100 }));
    dispatch(getProduct({ pageIndex: 1, pageSize: 100 }));
    dispatch(getCustomer({ pageIndex: 1, pageSize: 100 }));
    dispatch(getUser({ pageIndex: 1, pageSize: 100 }));
  }, []);

  const productDetail = useSelector((state) => state.product.productDetail);
  const params = useParams<{ id: any }>();
  useEffect(() => {
    if (params) {
      dispatch(getOneProduct(params.id));
    }
  }, [params]);
  
  const productReviews = reviewList.filter(
    (review) => review.productId === productDetail.productId
  );
  console.log('====================================');
  console.log("productReviews",productReviews);
  console.log('====================================');
  const getCustomerNameById = (userId:any) => {
    // Find the user associated with the review
    const user = userList.find((user) => user.id === userId);
  
    // If user is found, find the corresponding customer
    if (user) {
      const customer = customerList.find((customer) => customer.id === user.customerId);
      return customer ? customer.fullName : 'Unknown';
    } else {
      return 'Unknown';
    }
  };
  // ... (your existing code)
 
    const productReviewsWithCustomerName = productReviews.map((review) => ({
      ...review,
      customerName: getCustomerNameById(review.userId),
    }));
  
    console.log('====================================');
    console.log("productReviewsWithCustomerName", productReviewsWithCustomerName);
    console.log('====================================');
 
  const showNotificationError = () => {
    notification.error({
      className: "notification__item notification__item--error",
      message: "Vui lòng đăng nhập để đánh giá",
      duration: 3,
    });
  };
  const showNotification = () => {
    notification.success({
      className: "notification__item",
      message: "Đánh giá của bạn đã được ghi nhận lại!",
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
  const accessToken = LocalUtils.get(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);

  // Decode the access token and explicitly assert the type
  const decodedToken = accessToken
    ? (jwt.decode(accessToken) as jwt.JwtPayload)
    : null;

  // Check if decodedToken is not null and has the expected property
  const username =
    decodedToken && typeof decodedToken === "object"
      ? decodedToken.userId
      : null;
  const onFinish = async (values: any) => {
    if (isAuthenticated) {
      try {
        
        const reviewData = { ...values, productId: productDetail.productId,userId:username };
  
        // Dispatch the action to add a review
        await dispatch(createReview(reviewData));
        showNotification()
        // Reset the form after successful submission if needed
        // form.resetFields();
      } catch (error) {
        console.error('Failed to submit review:', error);
      }
    } else {
      showNotificationError();
    }
  };
  return (
    <div className="rate">
      <h2 className="title rate__title">Đánh giá từ khách hàng</h2>
      <Form
        name="basic"
        labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 24,
        }}
        initialValues={
          {
            //   remember: true,
          }
        }
        className="formRate"
          onFinish={onFinish}
        //   onFinishFailed={onFinishFailed}
        autoComplete="off"
        requiredMark="optional"
      >
        <Form.Item
  label="Chọn số sao"
  name="rating"  // Adjust the name to match the server's expectation
  rules={[
    {
      required: true,
      message: 'Vui lòng chọn số sao!',
    },
  ]}
>
  <Rate allowHalf className="formRate__icon" />
</Form.Item>
<Form.Item
  label="Nhập đánh giá của bạn"
  name="comment"  // Adjust the name to match the server's expectation
  rules={[
    {
      required: true,
      message: 'Vui lòng nhập đánh giá!',
    },
  ]}
>
  <Input
    className="formRate__grInput__input"
    style={{
      width: 'calc(100% - 100px)',
    }}
    placeholder="Nhập đánh giá của bạn"
  />
</Form.Item>
<Button className="formRate__grInput__button" type="primary" htmlType="submit">
  Submit
</Button>
      </Form>
      <div className="rate__container">
        <div className="rate__quantity">
          <h2>{productReviews.length} Đánh giá</h2>
        </div>
        {/* <div className="rate__customer">
          {productReviews.map((review) => (
            <div>
              <div>
                <Avatar size={48} icon={<UserOutlined />} />
              </div>
              <div>
                <h3 className="rate__customer__title">{review.reviewId}</h3>
                <Rate
                  disabled
                  defaultValue={5}
                  className="rate__customer__icon"
                />
                <p className="subTitle">{review.comment}</p>
              </div>
            </div>
          ))}
        </div> */}
        {productReviewsWithCustomerName.map((review) => (
          <div className="rate__customer">
            <div>
              <Avatar size={48} icon={<UserOutlined />} />
            </div>
            <div>
              <h3 className="rate__customer__title">{review.customerName}</h3>
              <Rate
                disabled
                value={parseFloat(review.rating)}
  allowHalf  // Allow half-star selections
                className="rate__customer__icon"
              />
              <p className="subTitle">
                {review.comment}
              </p>
            </div>
          </div>
        ))}

        <div className="rate__button">
          <Button type="primary" className="buttonItem">
            Xem thêm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RateCustomer;
