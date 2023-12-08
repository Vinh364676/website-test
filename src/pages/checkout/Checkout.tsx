import { RouteChildrenProps } from "react-router";
import { LayoutProps } from "../../components/views/layout/route-layout";
import Cart from "../../components/views/cart-page/Cart";
import Checkout from "../../components/views/checkout-page/Checkout";

interface Props extends RouteChildrenProps, LayoutProps { }

export default function CheckoutPage(props: Props) {
  return (
    <h1 className="homepage" >
      <Checkout/>
    </h1>
  )
}