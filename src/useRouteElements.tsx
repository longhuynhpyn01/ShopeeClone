import { useContext } from "react";
import { Navigate, Outlet, useRoutes } from "react-router-dom";

import path from "src/constants/path";

import { AppContext } from "./contexts/app.context";
import CartLayout from "./layouts/CartLayout";
import MainLayout from "./layouts/MainLayout";
import RegisterLayout from "./layouts/RegisterLayout";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import ProductDetail from "./pages/ProductDetail";
import ProductList from "./pages/ProductList";
import Register from "./pages/Register";
import UserLayout from "./pages/User/layouts/UserLayout";
import ChangePassword from "./pages/User/pages/ChangePassword";
import HistoryPurchase from "./pages/User/pages/HistoryPurchase";
import NotFound from "./pages/User/pages/NotFound";
import Profile from "./pages/User/pages/Profile";

function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext);

  return !isAuthenticated ? <Outlet /> : <Navigate to="/" />;
}

export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: "",
      element: <RejectedRoute />,
      children: [
        {
          path: path.login,
          element: (
            <RegisterLayout>
              <Login />
            </RegisterLayout>
          )
        },
        {
          path: path.register,
          element: (
            <RegisterLayout>
              <Register />
            </RegisterLayout>
          )
        }
      ]
    },
    {
      path: "",
      element: <ProtectedRoute />,
      children: [
        {
          path: path.cart,
          element: (
            <CartLayout>
              <Cart />
            </CartLayout>
          )
        },
        {
          path: path.user,
          element: (
            <MainLayout>
              <UserLayout />
            </MainLayout>
          ),
          children: [
            {
              path: path.profile,
              element: <Profile />
            },
            {
              path: path.changePassword,
              element: <ChangePassword />
            },
            {
              path: path.historyPurchase,
              element: <HistoryPurchase />
            }
          ]
        }
      ]
    },
    {
      path: path.productDetail,
      element: (
        <MainLayout>
          <ProductDetail />
        </MainLayout>
      )
    },
    {
      path: "/",
      index: true, // để luôn match url "/" dù đặt trên hay dưới
      element: (
        <MainLayout>
          <ProductList />
        </MainLayout>
      )
    },
    {
      path: "*",
      element: (
        <MainLayout>
          <NotFound />
        </MainLayout>
      )
    }
  ]);

  return routeElements;
}
