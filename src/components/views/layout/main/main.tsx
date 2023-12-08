import React from "react";
import "./main.scss";

const MainLayout = ({ children }: any) => {

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [children]);


  return (
    <div>
      Main
      <main >{children}</main>
    </div>
  );
};

export default MainLayout;
