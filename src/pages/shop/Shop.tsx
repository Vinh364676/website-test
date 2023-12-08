import { RouteChildrenProps } from "react-router";
import { LayoutProps } from "../../components/views/layout/route-layout";

import ProductShop from "../../components/views/shop-page/product/Product";

import BannerLayout from "../../components/views/banner/BannerComponent";


interface Props extends RouteChildrenProps, LayoutProps { }

export default function ShopPage(props: Props) {
  return (
    <h1 className="homepage" >
    <BannerLayout title="Cửa hàng" desc="Cửa hàng đồng hồ của chúng tôi - thời gian và phong cách gặp gỡ."/>
     <ProductShop/>
    </h1>
  )
}