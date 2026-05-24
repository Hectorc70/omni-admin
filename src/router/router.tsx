import AppLayout from "@/layout/AppLayout";
import { createBrowserRouter } from "react-router-dom";
import { routeNames } from "./routes-names";
import LoginPage from "@/modules/auth/pages/login/login";
import AuthLayout from "@/modules/auth/layout/auth.layout";
import RequireAuth from "@/hooks/authguard";
import NotFoundPage from "@/layout/components/NotFound";
import HomePage from "@/modules/business/pages/home/home";
import StockPage from "@/modules/customers/pages/customers";
import StockLayout from "@/modules/customers/layout/customer.layout";
import ValidateUserPage from "@/modules/auth/pages/activateUser/activateUser";
import NotificationsLayout from "@/modules/notifications/layout/notifications.layout";
import NotificationsTemplatesPage from "@/modules/notifications/pages/notificationsTemplates";
import CatalogLayout from "@/modules/catalog/layout/catalog.layout";
import CatalogPage from "@/modules/catalog/pages/Catalog";
import EventsLayout from "@/modules/events/layout/events.layout";
import EventsPage from "@/modules/events/pages/events";

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
        path: routeNames.customersPage,
        element: <StockLayout />,
        children: [
          {
            path: routeNames.customersPage,
            element: <StockPage />,
          },
        ],
      },
      {
        path: routeNames.notificationsTemplatesPage,
        element: <NotificationsLayout />,
        children: [
          {
            path: routeNames.notificationsTemplatesPage,
            element: <NotificationsTemplatesPage />,
          },
        ],
      },
      {
        path: routeNames.catalogPage,
        element: <CatalogLayout />,
        children: [
          {
            path: routeNames.catalogPage,
            element: <CatalogPage />,
          },
        ],
      },
      {
        path: routeNames.eventsPage,
        element: <EventsLayout />,
        children: [
          {
            path: routeNames.eventsPage,
            element: <EventsPage />,
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
