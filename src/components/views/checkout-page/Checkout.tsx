import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Steps,
  message,
  notification,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import productImg from "../../../assets/images/product/product.svg";
import "./Checkout.scss";
import { Link } from "react-router-dom";
import { ROUTE_PATHS } from "../../../constants/url-config";
import { dispatch, useSelector } from "../../../redux/store";
import {
  createAddress,
  deleteAddress,
  getAddress,
} from "../../../redux/slices/address";
import deleteIcon from "../../../assets/images/banner/deleteIcon.svg";
import moment from "moment";
import { getProduct } from "../../../redux/slices/product";
import LocalUtils from "../../../utils/local";
import { LOCAL_STORAGE_KEYS } from "../../../constants/local";
import jwt from "jsonwebtoken";
import { getVoucher } from "../../../redux/slices/voucher";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { createBill } from "../../../redux/slices/bill";
const Checkout = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAuthenticated } = useAuthContext();
  const [current, setCurrent] = useState(0);
  const { addressList } = useSelector((state) => state.address);
  const { productList } = useSelector((state) => state.product);
  const { voucherList } = useSelector((state) => state.voucher);
  console.log('====================================');
  console.log("voucherList",voucherList);
  console.log('====================================');
  useEffect(() => {
    dispatch(getAddress({ pageIndex: 1, pageSize: 100 }));
    dispatch(getProduct({ pageIndex: 1, pageSize: 100 }));
    dispatch(getVoucher({ pageIndex: 1, pageSize: 100 }));
  }, []);
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
  
  const filteredAddressList = addressList.filter(address => address.userId === username);
  // Use the username to create the product session storage key
  const productSessionStorageKey = `productList_${username}`;

  // Get the product list from sessionStorage
  const storedProductListString = sessionStorage.getItem(
    productSessionStorageKey
  );
  const storedProductList = storedProductListString
    ? JSON.parse(storedProductListString)
    : [];

  const combinedProductList = productList.map((product) => {
    const storedProduct = storedProductList.find(
      (item: any) => String(item.id) === String(product.productId)
    );

    return {
      ...product,
      product: storedProduct ? storedProduct.id : 0,
      quantity: storedProduct ? storedProduct.quantity : 0,
    };
  });
  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [currentDate, setCurrentDate] = useState(new Date());

  // Sao chép ngày hiện tại và thêm 7 ngày
  const newDate = moment(currentDate).add(7, "days");

  // Sao chép ngày hiện tại và thêm 7 ngày
  const shortDate = moment(currentDate).add(3, "days");
  const getDefaultCheckedIndex = () => {
    const defaultCheckedAddress = addressList.find(
      (address) => address.status === true
    );
    return defaultCheckedAddress?.id;
  };
  useEffect(() => {
    const defaultCheckedAddress = addressList.find(
      (address) => address.status === true
    );

    if (defaultCheckedAddress) {
      setValue(defaultCheckedAddress.id);
    }
  }, [addressList]); // This effect will run whenever addressList changes

  const onChange = (e: any) => {
    setValue(e.target.value);
  };
  const [value, setValue] = useState(getDefaultCheckedIndex());
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const showModalDelete = (id: number) => {
    setIsModalOpenDelete(true);
    setSelectedAddressId(id);
  };
  const handleOkDelete = () => {
    if (selectedAddressId) {
      const selectedAddress = addressList.find(
        (address) => address.id === selectedAddressId
      );

      // Check if the selected address has status === true
      if (selectedAddress && selectedAddress.status === true) {
        // Handle the case where the address cannot be deleted
        notification.error({
          className: "notification__item notification__item--error",
          message: "Lỗi",
          description: "Địa chỉ có trạng thái mặc định không thể xóa",
          duration: 3,
        });
      } else {
        // Dispatch the deleteAddress action with the selected address ID
        dispatch(deleteAddress(selectedAddressId));
        notification.success({
          className: "notification__item",
          message: "Xóa địa chỉ thành công",
          duration: 3,
        });
      }
    }

    setIsModalOpenDelete(false);
  };
  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };
  const [valueRadio, setValueRadio] = useState(99); // Default value, assuming free shipping

  const onChangeShip = (e: any) => {
    setValueRadio(e.target.value);
  };
  const totalProductAmount = combinedProductList
    .filter((product) => product.product !== 0)
    .reduce((total, product) => total + product.price * product.quantity, 0);

  // Calculate tax (8% of total product amount)
  const tax = 0.08 * totalProductAmount;

  // Calculate shipping cost
  const shippingCost = valueRadio === 100 ? 30000 : 0; // 30,000 VND if valueRadio is 100, else 0

  // Calculate total order amount
  const totalOrderAmount = totalProductAmount + tax + shippingCost;
  const showNotification = () => {
    notification.success({
      className: "notification__item",
      message: "Sử dụng mã thành công",
      //   description: 'Sản phẩm đã được xóa thành công!',
      duration: 3,
    });
  };
  const showNotificationError = () => {
    notification.error({
      className: "notification__item notification__item--error",
      message: "Mã code sai hoặc hết hạn",
      //   description: 'Sản phẩm đã được xóa thành công!',
      duration: 3,
    });
  };
  const showNotificationOrder = () => {
    notification.success({
      className: "notification__item",
      message: "Đặt hàng thành công",
      //   description: 'Sản phẩm đã được xóa thành công!',
      duration: 3,
      onClose: () => {
        // Redirect to the homepage after the notification is closed
        window.location.href = '/';
      },
    });
  };
  const [a, setA] = useState(totalProductAmount + tax + shippingCost);
const [voucherId, setVoucherId] = useState<string | null>(null);

const onFinishVoucher = (values: any) => {
  const enteredCode = values.code;

  // Check if enteredCode exists in voucherList
  const voucher = voucherList.find((voucher) => voucher.code === enteredCode);

  const isCodeValid = voucherList.some(
    (voucher) => voucher.code === enteredCode
  );

  let newTotalOrderAmount;

  // Check if voucher is valid based on the date
  const currentDate = new Date();
  const startDate = voucher ? new Date(voucher.startDate) : null;
  const endDate = voucher ? new Date(voucher.endDate) : null;

  const isDateValid =
    voucher &&
    startDate &&
    endDate &&
    startDate <= currentDate &&
    currentDate <= endDate;

  if (isCodeValid && voucher && isDateValid) {
    console.log("Matching voucher found. Code is valid:", enteredCode);
    showNotification();
    newTotalOrderAmount =
      totalProductAmount -
      totalProductAmount * (voucher.value ?? 0) +
      tax +
      shippingCost;

    // Ensure newTotalOrderAmount is at least 0
    newTotalOrderAmount = Math.max(newTotalOrderAmount, 0);

    // Set voucherId in state
    setVoucherId(String(voucher.id));
  } else {
    showNotificationError();
    newTotalOrderAmount = totalProductAmount + tax + shippingCost;

    // Set voucherId as empty string if no valid voucher
    setVoucherId(null);
  }

  // Ensure a is at least 0
  newTotalOrderAmount = Math.max(newTotalOrderAmount, 0);

  setA(newTotalOrderAmount);
};

  
  
  const dataToSend = {
    products: combinedProductList
      .filter((product) => product.product !== 0)
      .map((product) => ({
        id: product.productId,
        quantity: product.quantity,
        price: product.price,
      })),
    address: addressList
      .filter((address) => address.id === value)
      .map((address) => ({
        id: address.id,
        houseNumber: address.houseNumber,
        ward: address.ward,
        district: address.district,
        province: address.province,
      }))[0],

    voucherId: voucherId,

    totalAmount: a,
  };
  const [radioValue, setRadioValue] = useState('a');
  const onRadioChange = (e:any) => {
    setRadioValue(e.target.value);
  };
  const [paymentInfo, setPaymentInfo] = useState(null);
  const submitCart = () => {
    const requestBody = {
      userId: username,
      deliverAddress: "",
     createDate: new Date().toISOString(),
     totalPrice: dataToSend.totalAmount,
     voucherId: dataToSend.voucherId ?? null,
      billDetailDTOList: dataToSend.products.map((product) => ({
        productId: product.id,
        quantity: product.quantity,
      })),
    };

    if (radioValue === 'a') {
      dispatch(createBill(requestBody));
      showNotificationOrder()
      sessionStorage.removeItem(productSessionStorageKey);
    }  else if (radioValue === 'b') {
      sessionStorage.removeItem(productSessionStorageKey);
      showNotificationOrder()
      // dispatch(createBillVNpay(requestBody))
      //   .then(response => handlePaymentResponse(response));
    }
    const handlePaymentResponse = (response:any) => {
      // Check if response.payload.paymentUrl is defined before accessing its properties
      if (response.payload && response.payload.paymentUrl && response.payload.paymentUrl.result) {
        const paymentUrl = response.payload.paymentUrl.result;
    
        // Redirect to the payment URL
        window.location.href = paymentUrl;
      } else {
        // Handle the case where paymentUrl or its result property is undefined
        console.error('Invalid payment response:', response);
        // You might want to show an error message to the user or take appropriate action.
      }
      
      
    };
    
  };


  const steps = [
    {
      title: "Địa chỉ",
      icon: <EnvironmentOutlined />,
      content: (
        <>
          <Row gutter={[40, 0]} className="checkout__row">
            <Col xl={14}>
              <h5 className="checkout__title">Chọn địa chỉ</h5>
              <Radio.Group
                defaultValue={getDefaultCheckedIndex()}
                onChange={onChange}
                className="radio__custom"
              >
                {filteredAddressList.map((address) => (
                  <div key={address.id} className="radio__container">
                    <Radio
                      value={address.id}
                      checked={address.status}
                      className="radio__custom__check"
                    >
                      <div className="radio__item">
                        <div className="radio__address">
                          <div className="radio__address__header">
                            <h4 className="radio__address__title">
                              {address.houseNumber} {address.ward}
                            </h4>
                            <p className="radio__address__location">
                              {address.note}
                            </p>
                          </div>
                          <p className="radio__address__desc">
                            {address.ward}, {address.district},{" "}
                            {address.province}
                          </p>
                          <p className="radio__address__desc">
                            {address.phoneNumber}
                          </p>
                        </div>
                      </div>
                    </Radio>
                    <div className="radio__action">
                      <Button
                        className="radio__action__button"
                        onClick={showModal}
                      >
                        <EditOutlined />
                      </Button>
                      <Button
                        className="radio__action__button"
                        onClick={() => showModalDelete(address.id)}
                      >
                        <DeleteOutlined />
                      </Button>
                    </div>
                  </div>
                ))}
              </Radio.Group>
            </Col>
            <Col xl={10} className="checkout__right">
              <div className="checkout__right__item">
                <h5>Order Summary</h5>
                <div className="cart__right__content ">
                  <p className="subTitle cart__right__content__subTotal">
                    Tổng sản phẩm
                  </p>
                  <p className="subTitle cart__right__content__subTotal">
                    {new Intl.NumberFormat("vi-VN", {
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
                    )}
                  </p>
                </div>
                <div className="cart__right__content">
                  <p className="subTitle cart__right__content__text">Thuế</p>
                  <p className="subTitle cart__right__content__text">8%</p>
                </div>
                <div className="cart__right__content">
                  <p className="subTitle cart__right__content__subTotal">
                    Tổng cộng
                  </p>
                  <p className="subTitle cart__right__content__subTotal">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(
                      combinedProductList
                        .filter((product) => product.product !== 0)
                        .reduce(
                          (total, product) =>
                            total + product.price * product.quantity,
                          0
                        ) *
                        (1 + 0.08) // Adding 8% tax
                    )}
                  </p>
                </div>
              </div>
            </Col>
          </Row>

          <div className="checkout__add">
            <div className="checkout__add__left"></div>
            <Button className="checkout__add__button" onClick={showModal}>
              <PlusOutlined />
            </Button>
            <div className="checkout__add__right"></div>
          </div>
          <div className="checkout__add__title">Thêm địa chỉ</div>
        </>
      ),
    },
    {
      title: "Vận chuyển",
      content: (
        <>
          <Row gutter={[40, 0]} className="checkout__row">
            <Col xl={14}>
              <h5 className="checkout__title">Phương thức vận chuyển</h5>
              <Radio.Group
                onChange={onChangeShip}
                value={valueRadio}
                defaultValue={99}
                className="radio__custom"
              >
                <div className="radio__container">
                  <Radio value={99} className="radio__custom__check">
                    <div className="radio__item">
                      <div className="radio__address radio__address__ship">
                        <p className="radio__address__desc radio__address__desc__ship radio__address__desc__ship__title">
                          Miễn phí
                        </p>
                        <p className="radio__address__desc radio__address__desc__ship">
                          Giao hàng tiết kiệm
                        </p>
                      </div>
                    </div>
                  </Radio>
                  <div className="radio__action">
                    <Button className="radio__action__button">
                      {newDate.format("DD-MM-YYYY")}
                    </Button>
                  </div>
                </div>
                <div className="radio__container">
                  <Radio value={100} className="radio__custom__check">
                    <div className="radio__item">
                      <div className="radio__address radio__address__ship">
                        <p className="radio__address__desc radio__address__desc__ship radio__address__desc__ship__title">
                          30.000đ
                        </p>
                        <p className="radio__address__desc radio__address__desc__ship">
                          Giao hàng hỏa tốc
                        </p>
                      </div>
                    </div>
                  </Radio>
                  <div className="radio__action">
                    <Button className="radio__action__button">
                      {shortDate.format("DD-MM-YYYY")}
                    </Button>
                  </div>
                </div>
              </Radio.Group>
            </Col>
            <Col xl={10} className="checkout__right">
              <div className="checkout__right__item">
                <h5>Order Summary</h5>
                <div className="cart__right__content ">
                  <p className="subTitle cart__right__content__subTotal">
                    Tổng sản phẩm
                  </p>
                  <p className="subTitle cart__right__content__subTotal">
                    {new Intl.NumberFormat("vi-VN", {
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
                    )}
                  </p>
                </div>
                <div className="cart__right__content">
                  <p className="subTitle cart__right__content__text">Thuế</p>
                  <p className="subTitle cart__right__content__text">8%</p>
                </div>
                <div className="cart__right__content">
                  <p className="subTitle cart__right__content__text">
                    Vận chuyển
                  </p>
                  <p className="subTitle cart__right__content__text">
                    {valueRadio === 100 ? "30.000đ" : "Miễn phí"}
                  </p>
                </div>
                <div className="cart__right__content">
                  <p className="subTitle cart__right__content__subTotal">
                    Tổng cộng
                  </p>
                  <p className="subTitle cart__right__content__subTotal">
                    {" "}
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(totalOrderAmount)}
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </>
      ),
    },
    {
      title: "Thanh toán",
      content: (
        <>
         <Radio.Group defaultValue="a" size="large" onChange={onRadioChange}>
      <Radio.Button value="a">Thanh toán khi nhận hàng</Radio.Button>
      <Radio.Button value="b">Thanh toán qua VNpay</Radio.Button>
    </Radio.Group>
          <Row gutter={[96, 0]} className="checkout__row">
            <Col xl={12} className="checkout__pay">
              <div className="checkout__pay__item">
                <h5 className="checkout">Summary</h5>
                {combinedProductList
                  .filter((product) => product.product !== 0)
                  .map((product) => (
                    <div key={product.productId} className="checkout__pay__product">
                      <div className="checkout__pay__product__name">
                        <img
                          className="checkout__pay__product__img"
                          src={product.thumnail}
                          alt=""
                        />
                        <p className="checkout__pay__product__descSub">
                          {product.productName} x {product.quantity}
                        </p>
                      </div>
                      <p className="checkout__pay__product__descSub">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(product.price * product.quantity)}
                      </p>
                    </div>
                  ))}
                {value && (
                  <>
                    <p className="checkout__pay__product__subTitle">Address</p>
                    <p className="checkout__pay__product__descSub">
                      {addressList.map((address) => {
                        if (address.id === value) {
                          return (
                            <div key={address.id}>
                              <p>
                                {address.houseNumber} {address.ward},{" "}
                                {address.district}, {address.province}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </p>
                  </>
                )}
                <Form
                  labelCol={{
                    span: 24,
                  }}
                  wrapperCol={{
                    span: 24,
                  }}
                  onFinish={onFinishVoucher}
                >
                  <Row >
                    <Col xl={24}>
                    <Form.Item
                      label="Mã giảm giá"
                      name="code"
                      requiredMark="optional"
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: "Vui lòng nhập mã code!",
                      //   },
                      // ]}
                    >
                      <Row gutter={[20, 0]}>
                      <Col xl={18}>
                        <Input
                          allowClear
                          placeholder="Nhập mã (nếu có)"
                          className="cart__right__input"
                        />
                      </Col>
                      <Col xl={6}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="cart__right__button"
                      >
                        Kiểm tra
                      </Button>
                    </Col>
                      </Row>
                      
                    </Form.Item>
                    </Col>
                   

                    
                  </Row>
                </Form>
                <div className="cart__right__content ">
                  <p className="subTitle cart__right__content__subTotal">
                    Tổng sản phẩm
                  </p>
                  <p className="subTitle cart__right__content__subTotal">
                    {new Intl.NumberFormat("vi-VN", {
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
                    )}
                  </p>
                </div>
                <div className="cart__right__content">
                  <p className="subTitle cart__right__content__text">Thuế</p>
                  <p className="subTitle cart__right__content__text">8%</p>
                </div>
                <div className="cart__right__content">
                  <p className="subTitle cart__right__content__text">
                    Vận chuyển
                  </p>
                  <p className="subTitle cart__right__content__text">
                    {valueRadio === 100 ? "30.000đ" : "Miễn phí"}
                  </p>
                </div>
                <div className="cart__right__content">
                  <p className="subTitle cart__right__content__subTotal">
                    Tổng cộng
                  </p>
                  <p className="subTitle cart__right__content__subTotal">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(a)}
                  </p>
                </div>
              </div>
             
            </Col>
            <Col>
           
    <Button onClick={submitCart}>Đặt hàng</Button>
    
            </Col>
          </Row>
        </>
      ),
    },
  ];

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));
  const onFinish = async (values: any) => {
    try {
      // Call the createAddress action with the form values
      const response = await dispatch(createAddress(values));
      notification.success({
        className: "notification__item",
        message: "Thêm địa chỉ thành công",
        duration: 3,
      });
      setTimeout(function () {
        window.location.href = "/checkout";
      }, 3000);
      setIsModalOpen(false);
      console.log("Response:", response);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="containerCustom sectionCustom checkout">
      <Steps current={current} items={items} />
      <div className="steps-content">{steps[current].content}</div>
      <div className="steps-action">
        {current < steps.length - 1 && (
          <Button
            className="buttonCustom"
            type="primary"
            onClick={() => next()}
          >
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button
            type="primary"
            onClick={() => message.success("Processing complete!")}
          >
            Done
          </Button>
        )}
        {current > 0 && (
          <Button
            style={{
              margin: "0 8px",
            }}
            onClick={() => prev()}
          >
            Previous
          </Button>
        )}
        <Modal
          title="Thêm địa chỉ"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          centered={true}
          className="modal__address"
          footer={false}
        >
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
            onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
            requiredMark={"optional"}
          >
            <Row gutter={[20, 0]}>
              <Col xl={12}>
                <Form.Item
                  label="Số điện thoại"
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
                          return Promise.reject(
                            "Số điện thoại phải bắt đầu bằng 0 và đủ 10 hoặc 11 số!"
                          );
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <Input
                    placeholder="Số điện thoại"
                    className="formAddress__input"
                  />
                </Form.Item>
              </Col>
              <Col xl={12}>
                <Form.Item
                  label="Ghi chú địa chỉ"
                  name="note"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: "Vui lòng ghi ghi chú địa chỉ!",
                  //   },
                  // ]}
                >
                  <Input placeholder="Ghi chú" className="formAddress__input" />
                </Form.Item>
              </Col>
              <Col xl={12}>
                <Form.Item
                  label="Trạng thái"
                  name="status"
                  valuePropName="checked"
                  initialValue={false}
                >
                  <Checkbox>Mặc định</Checkbox>
                </Form.Item>
              </Col>
              <Col xl={12}>
                <Form.Item
                  label="Tỉnh - Thành phố"
                  name="province"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tỉnh - thành phố!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Tỉnh - Thành phố"
                    className="formAddress__input"
                  />
                </Form.Item>
              </Col>
              <Col xl={12}>
                <Form.Item
                  label="Quận - Huyện"
                  name="district"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập quận - huyện!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Quận - Huyện"
                    className="formAddress__input"
                  />
                </Form.Item>
              </Col>
              <Col xl={12}>
                <Form.Item
                  label="Xã - Phường"
                  name="ward"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập xã - phường!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Xã - Phường"
                    className="formAddress__input"
                  />
                </Form.Item>
              </Col>
              <Col xl={12}>
                <Form.Item
                  label="Số nhà"
                  name="houseNumber"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập số nhà!",
                    },
                  ]}
                >
                  <Input placeholder="Số nhà" className="formAddress__input" />
                </Form.Item>
              </Col>
            </Row>
            <Button
              htmlType="submit"
              type="primary"
              className="formAddress__button"
            >
              Thêm
            </Button>
          </Form>
        </Modal>
        <Modal
          centered
          open={isModalOpenDelete}
          onOk={handleOkDelete}
          onCancel={handleCancelDelete}
          className="modal__product"
          okType={"danger"}
        >
          <img src={deleteIcon} alt="" className="modal__product__icon" />
          <div className="modal__product__content">
            <h2 className="modal__product__content--title">Xóa địa chỉ</h2>
            <p className="modal__product__content--desc">
              Bạn có chắc chắn muốn xóa địa chỉ này không?
            </p>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Checkout;
