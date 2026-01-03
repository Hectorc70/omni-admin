import AppLayout from "@/layout/AppLayout";
import { createBrowserRouter } from "react-router-dom";
import { routeNames } from "./routes-names";
import LoginPage from "@/modules/auth/pages/login/login";
import AuthLayout from "@/modules/auth/layout/auth.layout";
import RequireAuth from "@/hooks/authguard";
import NotFoundPage from "@/layout/components/NotFound";
import HomePage from "@/modules/business/pages/home/home";
import StockPage from "@/modules/stock/pages/stock";
import StockLayout from "@/modules/stock/layout/stock.layout";
import ValidateUserPage from "@/modules/auth/pages/activateUser/activateUser";

const router = createBrowserRouter([
  {
    path: routeNames.initPage,
    element: <AuthLayout />,
    children: [
      {
        path: routeNames.initPage,
        element: <LoginPage />,
      },
      {
        path: routeNames.loginPage,
        element: <LoginPage />,
      },
      {
        path: routeNames.ValidateUserPage,
        element: <ValidateUserPage />,
      },
    ],
  },
  {
    path: routeNames.initPage,
    element: <RequireAuth> <AppLayout /> </RequireAuth>,
    children: [
      {
        path: routeNames.homePage,
        element: <HomePage />,
      },
      {
        path: routeNames.stockPage,
        element: <StockLayout />,
        children: [
          {
            path: routeNames.stockPage,
            element: <StockPage />,
          },
        ],
      },
    ],
  },

  {
    path: "*",
    element: <NotFoundPage />,
  },
])

export default router