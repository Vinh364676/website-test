import React from "react";
import "./anonymous.scss";
import MainHeader from "../main/header";
import MainFooter from "../main/footer";

const AnonymousLayout = ({ children }: any) => {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [children]);

  return <div>
    <MainHeader/>
    {children}
   <MainFooter/>
    </div>;
};

export default AnonymousLayout;
