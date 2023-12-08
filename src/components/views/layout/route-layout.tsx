import React from "react";
import cookie from 'react-cookies';
import { Redirect, Route } from "react-router-dom";
import { ROUTE_PATHS } from "../../../constants/url-config";
import { PERMISSION, hasPermission } from "../../../guards/role-guard";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { showMessage } from "../../atoms/notification/notification";
import AnonymousLayout from "./anonymous/anonymous";
import MainLayout from './main/main';
import SignIn from "../../../pages/sign-in/sign-in";

export interface LayoutProps {
  pageTitle: React.ReactNode;
  setPageTitle: (node: React.ReactNode) => void;
  avatar: string;
}

// const RouteLayout = ({ component: Component, ...rest }: any) => {
//   const homePage = ROUTE_PATHS.Home;
//   const [pageTitle, setPageTitle] = React.useState<React.ReactNode>("");
//   const { isAuthenticated } = useAuthContext();

//   const isLoginRequired = rest.loginRequired;
//   const expectedPermissions = rest.permissions as PERMISSION[];

//   React.useEffect(() => {
//     if (isAuthenticated && isLoginRequired && expectedPermissions.length > 0 && !hasPermission(expectedPermissions)) {
//       Object.keys(cookie.loadAll()).forEach((item) => {
//         cookie.remove(item);
//       });
//       showMessage({ message: "You don't have permission to do this action", type: "error" });
//     }
//   }, [isAuthenticated, isLoginRequired, expectedPermissions]);

//   const renderLayout = () => {
//     if (isAuthenticated) {
//       if (!isLoginRequired) {
//         return <Redirect to={{ pathname: homePage }} />;
//       }
//       if (isLoginRequired) {
//         return (
//           <MainLayout>
//             <Component
//               pageTitle={pageTitle}
//               setPageTitle={setPageTitle}
//             />
//           </MainLayout>
//         );
//       }
//     } else {
//       if (isLoginRequired) {
//         return <Redirect to={{ pathname: ROUTE_PATHS.SignIn }} />;
//       }
//       return (
//         <AnonymousLayout>
//           <Component />
//         </AnonymousLayout>
//       );
//     }
//   };

//   return <Route {...rest} render={renderLayout} />;
// };
const RouteLayout = ({ component: Component, ...rest }: any) => {
  const homePage = ROUTE_PATHS.Home;
  const [pageTitle, setPageTitle] = React.useState<React.ReactNode>("");
  const { isAuthenticated } = useAuthContext();
  console.log("rest: ",rest)


  const isLoginRequired = rest.loginRequired;
  const isLayout = rest.isLayout;
  const expectedPermissions = rest.permissions as PERMISSION[];

  React.useEffect(() => {
    if (isAuthenticated && isLoginRequired && expectedPermissions.length > 0 && !hasPermission(expectedPermissions)) {
      Object.keys(cookie.loadAll()).forEach((item) => {
        cookie.remove(item);
      });
      showMessage({ message: "You don't have permission to do this action", type: "error" });
    }
  }, [isAuthenticated, isLoginRequired, expectedPermissions]);

  const renderLayout = () => {
    console.log("islayout: ",isLayout)
    if(isLayout){
      return <Component />
    }
    if (isAuthenticated) {
      return (
          <AnonymousLayout>
            <Component />
          </AnonymousLayout>
        );
      // if (!isLoginRequired) {
        
      //   return <Redirect to={{ pathname: homePage }} />;
      // }
      // if (isLoginRequired) {
      //   return (
      //     <MainLayout>
      //       <Component
      //         pageTitle={pageTitle}
      //         setPageTitle={setPageTitle}
      //       />
      //     </MainLayout>
      //   );
      // }
    } else {
      if (isLoginRequired) {
        return <SignIn />;
      }
      return (
        <AnonymousLayout>
          <Component />
        </AnonymousLayout>
      );
    }
    
  };

  return <Route {...rest} render={renderLayout} />;
};
export default RouteLayout;
