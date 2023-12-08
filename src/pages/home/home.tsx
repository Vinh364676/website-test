import { RouteChildrenProps } from "react-router";
import { LayoutProps } from "../../components/views/layout/route-layout";
import "./home.scss"
import BannerComponent from "../../components/views/home-page/banner/Banner";
import Sell from "../../components/views/home-page/sell/Sell";
import NewProduct from "../../components/views/home-page/new-product/NewProduct";
import SaleComponent from "../../components/views/home-page/sale/Sale";
import Popular from "../../components/views/home-page/popular/Popular";
import HomeCategory from "../../components/views/home-page/home-category/HomeCategory";

interface Props extends RouteChildrenProps, LayoutProps { }

export default function HomePage(props: Props) {
  return (
    <h1 className="homepage" >
      <BannerComponent/>
      <Sell/>
      <HomeCategory/>
      <NewProduct/>
      <SaleComponent/>
      <Popular/>
    </h1>
  )
}