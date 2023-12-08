import {
  Button,
  Col,
  Drawer,
  Empty,
  Input,
  Menu,
  Modal,
  Popover,
  Row,
  Table,
  notification,
} from "antd";
import "./index.scss";
import { Link, useParams } from "react-router-dom";
import {
  CloseCircleOutlined,
  MinusOutlined,
  PlusOutlined,
  DeleteOutlined,
  ShoppingCartOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { ROUTE_PATHS } from "../../../../../constants/url-config";
import { useEffect, useRef, useState } from "react";
import logo from "../../../../../assets/images/Logo.png";
import heart from "../../../../../assets/icon/heart.svg";
import search from "../../../../../assets/icon/search.svg";
import usera from "../../../../../assets/icon/user.svg";
import cart from "../../../../../assets/icon/cart.svg";
import product from "../../../../../assets/images/product/product.svg";
import { useAuthContext } from "../../../../../hooks/useAuthContext";
import { LOCAL_STORAGE_KEYS } from "../../../../../constants/local";
import { dispatch, useSelector } from "../../../../../redux/store";
import { getOneProduct, getProduct } from "../../../../../redux/slices/product";
import LocalUtils from "../../../../../utils/local";
import jwt from "jsonwebtoken";
type Props = {};
const items = [
  {
    label: <Link to={ROUTE_PATHS.Home}>Trang chủ</Link>,
    key: "home",
  },
  {
    label: <Link to={ROUTE_PATHS.Shop}>Cửa hàng</Link>,
    key: "shop",
  },
  {
    label: <Link to={ROUTE_PATHS.ProductDetail}>Liên hệ</Link>,
    key: "contact",
  },
];

const showNotification = () => {
  notification.success({
    className: "notification__item",
    message: "Đăng xuất thành công",
    //   description: 'Sản phẩm đã được xóa thành công!',
    duration: 3,
  });
};
const showNotificationDelete = () => {
  notification.success({
    className: "notification__item",
    message: "Xóa sản phẩm thành công",
    //   description: 'Sản phẩm đã được xóa thành công!',
    duration: 3,
  });
};
const MainHeader = (props: Props) => {
  const [isModalLogout, setIsModalLogout] = useState(false);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useAuthContext();
  const [inputVisible, setInputVisible] = useState(false);

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
    ? decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']
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
  
  // const productIdList = storedProductList.map(item => item.id);
  const showModalLogout = () => {
    setIsModalLogout(true);
  };
  const handleOkLog = () => {
    setIsModalLogout(false);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    showNotification();
    setTimeout(() => {
      window.location.href = "/";
    }, 3000); // Thời gian chờ 3 giây (3000 milliseconds
  };
  const handleCancelLog = () => {
    setIsModalLogout(false);
  };
  const [searchValue, setSearchValue] = useState("");
  const filteredProducts = productList.filter((product) =>
    product.productName.toLowerCase().includes(searchValue.toLowerCase())
  );
  const content = (
    <div>
      {isAuthenticated ? (
        <div className="account__profile">
          <Button
            className="popoverButton__button popoverButton__button__login account__profile__button"
            onClick={showModalLogout}
          >
            Đăng xuất
          </Button>
          <Link to={ROUTE_PATHS.History}>Lịch sử mua hàng</Link>
        </div>
      ) : (
        <div>
          <Link to={ROUTE_PATHS.SignIn}>
            <Button className="popoverButton__button popoverButton__button__login">
              Đăng nhập
            </Button>
          </Link>
          <Link to={ROUTE_PATHS.SignUp}>
            <Button className="">Đăng ký</Button>
          </Link>
        </div>
      )}
    </div>
  );
  const contentSearch = (
    <div>
      {searchValue && filteredProducts.length > 0 ? (
        filteredProducts.map((product) => (
          <Link
            to={ROUTE_PATHS.ProductDetail.replace(":id", product.productId.toString())}
          >
            <div className="searchData" key={product.productId}>
              <img src={product.thumnail} alt="" className="searchData__img" />
              <h5 className="subTitle">{product.productName}</h5>
            </div>
          </Link>
        ))
      ) : (
        <Empty className="emptySearch" />
      )}
    </div>
  );
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0 && !scrolled) {
        setScrolled(true);
      } else if (window.scrollY === 0 && scrolled) {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const [quantity, setQuantity] = useState(1);

  const inputRef = useRef<HTMLInputElement | null>(null); // Explicitly specify the type
  const liRef = useRef<HTMLLIElement | null>(null);
  const [hiding, setHiding] = useState(false);

  const handleLiClick = () => {
    setInputVisible(!inputVisible);
    setHiding(false);
  };

  const handleInputClick = (e: any) => {
    e.stopPropagation();
  };

  const handleClickOutside = (e: any) => {
    if (liRef.current && !liRef.current.contains(e.target)) {
      setHiding(true);
      // Delay hiding to allow time for the slideInOut animation
      setTimeout(() => setInputVisible(false), 500);
    }
  };

  useEffect(() => {
    // Thêm sự kiện lắng nghe cho click bên ngoài
    document.addEventListener("click", handleClickOutside);

    // Cleanup sự kiện khi component unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  const handleDeleteProduct = (record:any) => {
    console.log('====================================');
    console.log("record",record);
    console.log('====================================');
    // Lấy danh sách sản phẩm từ sessionStorage
    const storedProductListString = sessionStorage.getItem(productSessionStorageKey);
  
    if (storedProductListString) {
      let storedProductList = JSON.parse(storedProductListString);
  
      // Loại bỏ sản phẩm có id tương ứng
      storedProductList = storedProductList.filter((item:any) => String(item.id) !== String(record.key));
  
      // Cập nhật lại sessionStorage
      sessionStorage.setItem(productSessionStorageKey, JSON.stringify(storedProductList));
      showNotificationDelete()
    } else {
      
    }
  };
  const [cartItems, setCartItems] = useState(combinedProductList);
  const incrementQuantity = (productId:any) => {
    const updatedCart = cartItems.map((item) =>
      item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedCart);
    updateSessionStorage(updatedCart);
  };

  const decrementQuantity = (productId:any) => {
    const updatedCart = cartItems.map((item) =>
      item.productId === productId && item.quantity > 0 ? { ...item, quantity: item.quantity - 1 } : item
    );
    setCartItems(updatedCart);
    updateSessionStorage(updatedCart);
  };

  const updateSessionStorage = (cart:any) => {
    // Save the updated cart in sessionStorage
    sessionStorage.setItem(productSessionStorageKey, JSON.stringify(cart));
  };
  return (
    <>
      <Row className={`header ${scrolled ? "scrolled" : ""}`}>
        <Col xl={8}>
          <div className="test">
            <img src={logo} alt="" />
          </div>
        </Col>
        <Col xl={8}>
          <div>
            <Menu
              className="header__content"
              mode="horizontal"
              disabledOverflow={true}
              items={items}
            ></Menu>
          </div>
        </Col>
        <Col xl={8}>
          <div>
            <ul className="header__content header__content__right">
              <li
                className={`header__content__right__search ${
                  inputVisible ? "active" : ""
                } ${hiding ? "hiding" : ""}`}
                ref={liRef}
                onClick={handleLiClick}
              >
                {inputVisible && (
                  <div
                    className="input-container"
                    ref={inputRef}
                    onClick={handleInputClick}
                  >
                    <Popover
                      content={contentSearch}
                      placement="bottom"
                      trigger="click"
                    >
                      <Input
                        allowClear
                        type="text"
                        placeholder="Tìm kiếm"
                        bordered={false}
                        className="input__search"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                      />
                    </Popover>
                  </div>
                )}
                <img src={search} alt="" />
              </li>

              <li>
                <img src={heart} alt="" />
              </li>
              <li>
                {/* <Link to={ROUTE_PATHS.Home}> */}
                <img src={cart} alt="" onClick={showDrawer} />
                {/* </Link> */}
              </li>
              <li>
                <Popover
                  placement="bottomRight"
                  content={content}
                  trigger="hover"
                >
                  <img src={usera} alt="" />
                </Popover>
              </li>
            </ul>
          </div>
        </Col>
      </Row>
      <Drawer
        className="drawer__cart"
        onClose={onClose}
        open={open}
        title="Giỏ hàng"
      >
        <div>
          {combinedProductList
            .filter((product) => product.product !== 0)
            .map((product) => (
              <Row className="cartItem" key={product.productId}>
                <Col xl={4} className="cartItem__left">
                  <img
                    src={product.thumnail}
                    alt=""
                    className="cartItem__left__img"
                  />
                </Col>
                <Col xl={20} className="cartItem__right">
                  <div className="cartItem__content">
                    <h3>{product.productName}</h3>
                    <div className="cartItem__quantity">
                      <button
                        onClick={decrementQuantity}
                        className="cartItem__quantity__button"
                      >
                        <MinusOutlined />
                      </button>
                      <span className="cartItem__quantity__number">
                        {product.quantity}
                      </span>
                      <button
                        onClick={incrementQuantity}
                        className="cartItem__quantity__button"
                      >
                        <PlusOutlined />
                      </button>
                    </div>
                  </div>
                  <div>
                    <p>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(product.price * product.quantity)}
                    </p>
                    <button onClick={() => handleDeleteProduct({ key: product.productId, name: product.productName, image: product.img, quantity: product.quantity })} className="cartItem__delete">
  <DeleteOutlined />
</button>

                  </div>
                </Col>
              </Row>
            ))}
        </div>
        {isAuthenticated ? (
          <div>
            <div className="drawer__footer">
              <span>Subtotal</span>
              <span>
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
              </span>
            </div>
            <Row className="cart__checkout" gutter={[24, 0]}>
              <Col xl={12}>
                <Link to={ROUTE_PATHS.Cart}>
                  <Button className="cart__checkout__button">
                    <ShoppingCartOutlined />
                    <span className="subTitle">Giỏ hàng</span>
                  </Button>
                </Link>
              </Col>
              <Col xl={12}>
                <Link to={ROUTE_PATHS.Checkout}>
                  <Button className="cart__checkout__button">
                    <SendOutlined />
                    <span className="subTitle">Thanh toán</span>
                  </Button>
                </Link>
              </Col>
            </Row>
          </div>
        ) : (
          <Empty
            className="cart__checkout__empty"
            description="Đăng nhập để xem thông tin"
          >
            <Link to={ROUTE_PATHS.SignIn}>
              <Button type="primary">Đăng nhập</Button>
            </Link>
          </Empty>
        )}
      </Drawer>
      <Modal  okType={"danger"} className="modal__product" centered open={isModalLogout} onOk={handleOkLog} onCancel={handleCancelLog}>
        <div className="modal__product__content">
          <h2 className="modal__product__content--title">Đăng xuất</h2>
          <p className="modal__product__content--desc">
            Bạn có chắc chắn muốn đăng xuất không?
          </p>
        </div>
  
      </Modal>
    </>
  );
};

export default MainHeader;
