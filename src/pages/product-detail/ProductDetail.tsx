import { LayoutProps } from "antd";
import { RouteChildrenProps } from "react-router";
import ProductDetailPage from "../../components/views/productdetail-page/ProductDetail";


interface Props extends RouteChildrenProps, LayoutProps { }

export default function ProductDetail(props: Props) {
  return (
    <h1 className="homepage" >
        <ProductDetailPage/>
    </h1>
  )
}