import { RouteChildrenProps } from "react-router";
import { LayoutProps } from "../../components/views/layout/route-layout";
import Cart from "../../components/views/cart-page/Cart";
import Checkout from "../../components/views/checkout-page/Checkout";
import HistoryCart from "../../components/views/history-cart/HistoryCart";

interface Props extends RouteChildrenProps, LayoutProps { }

export default function HistoryCartPage(props: Props) {
  return (
    <h1 className="homepage" >
      <HistoryCart/>
    </h1>
  )
}