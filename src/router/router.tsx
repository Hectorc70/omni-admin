import AppLayout from "@/layout/AppLayout";
import { createBrowserRouter } from "react-router-dom";
import { routeNames } from "./routes-names";
import LoginPage from "@/modules/auth/pages/login/login";
import AuthLayout from "@/modules/auth/layout/auth.layout";
import RegisterPage from "@/modules/auth/pages/register/register";
import RequireAuth from "@/hooks/authguard";
import NotFoundPage from "@/layout/components/NotFound";
import HomePage from "@/modules/business/pages/home/home";
import StockPage from "@/modules/stock/pages/stock";
import StockLayout from "@/modules/stock/layout/stock.layout";
import ChatsLayout from "@/modules/chats/layout/chats.layout";
import ChatsPage from "@/modules/chats/pages/chats.page";

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
        path: routeNames.registerPage,
        element: <RegisterPage />,
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
      {
        path: routeNames.chatsPage,
        element: <ChatsLayout />,
        children: [
          {
            path: routeNames.chatsPage,
            element: <ChatsPage />,
          },
        ],
      }
    ],
  },

  {
    path: "*",
    element: <NotFoundPage />,
  },
])

export default router