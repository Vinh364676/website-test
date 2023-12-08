import { Button, Card, Rate, notification } from "antd";
import "./CardComponent.scss";
import Meta from "antd/lib/card/Meta";
import product from "../../../assets/images/product/a.png";
import heart from "../../../assets/icon/heart.svg";
import HeartIcon from "../../../assets/svg/heart/Heart";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import moment from "moment";
import { useAuthContext } from "../../../hooks/useAuthContext";
import LocalUtils from "../../../utils/local";
import { LOCAL_STORAGE_KEYS } from "../../../constants/local";
import jwt from 'jsonwebtoken';
type Props = {
  image: string;
  brand: string;
  name: string;
  price: number | String;
  href: any;
  productId:string
  onClickItem: (productId: string) => void;
};
const CardComponent = ({ image, brand, name, price,productId, href,onClickItem }: Props) => {
  const {isAuthenticated} = useAuthContext();
  const formattedPrice = (+price).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  const showNotification = () => {
    notification.error({
      className: "notification__item notification__item--error",
      message: "Đăng nhập để thêm sản phẩm vào giỏ hàng",
     
      duration: 3,
    });
  };
  const showNotificationAdd = () => {
    notification.success({
      className: "notification__item",
      message: "Thêm vào giỏ hàng thành công",
     
      duration: 3,
    });
  };
    const handleAddToCart = () => {
      // Use the productId prop directly
      onClickItem(productId);
      const accessToken = LocalUtils.get(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);

  const decodedToken = accessToken ? jwt.decode(accessToken) as jwt.JwtPayload : null;
  
  const username = decodedToken && typeof decodedToken === 'object'
    ? decodedToken.userId
    : null;
         try {
          showNotificationAdd();
      const productSessionStorageKey = `productList_${username}`;
      let productList: { id: string; quantity: number }[] = [];
  
      const productSessionStorage = sessionStorage.getItem(productSessionStorageKey);
  
      if (productSessionStorage) {
        productList = JSON.parse(productSessionStorage);
      }
  
      const existingIndex = productList.findIndex((item) => item.id === productId);
  
      if (existingIndex !== -1) {
      
        console.log(`Product with ID ${productId} already exists. Incrementing quantity.`);
       
        productList[existingIndex].quantity += 1;
      } else {
    
        productList.push({ id: productId, quantity: 1 });
      }
  
      sessionStorage.setItem(productSessionStorageKey, JSON.stringify(productList));
      return [{ id: productId, quantity: productList.find((item) => item.id === productId)?.quantity || 1 }];
    } catch (error) {
    
      return []; 
    }
    };
  return (
    <>
      <Card
        hoverable
        className="card"
        style={
          {
            // width:300,
          }
        }
        cover={
          <Link to={href}>
            <div className="card__item">
              <div className="zoom-effect">
                <img alt="example" src={image} className="card__image" />
              </div>
              <div className="card__item__heart">
                <HeartIcon />
              </div>
            </div>
          </Link>
        }
      >
        <div className="cart__layout">
          <div className="card__item__button">
            <div className="card__content">
              <h5 className="card__content--top">{brand}</h5>
              <h2 className="card__content__title">{name}</h2>
              <p className="card__content--bottom">{formattedPrice}</p>
              {/* <div className="card__content__footer">
                <p>$199.00</p>
                  <Rate className="card__rate" disabled defaultValue={5} />
                </div> */}
            </div>
          </div>
          <div className="card__footer">
          {isAuthenticated ? (
              <Button className="button__submit" type="primary" onClick={handleAddToCart}>
                <ShoppingCartOutlined /> Thêm vào giỏ
              </Button>
            ) : (
              <Button className="button__submit" type="primary" onClick={showNotification}>
                <ShoppingCartOutlined /> Thêm vào giỏ
              </Button>
            )}
          </div>
        </div>
      </Card>
    </>
  );
};

export default CardComponent;
