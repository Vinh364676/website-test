import { RouteChildrenProps } from "react-router";
import { LayoutProps } from "../../components/views/layout/route-layout";
import Cart from "../../components/views/cart-page/Cart";

interface Props extends RouteChildrenProps, LayoutProps { }

export default function CartPage(props: Props) {
  return (
    <h1 className="homepage" >
      <Cart/>
    </h1>
  )
}
