import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import store from "./APP/store.ts";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

// COMPONENTS
import ReboundComp from "./components/ReboundComp.tsx";
import AuthorizedRoute from "./components/AuthorizedRoute.tsx";

// PAGES
import LoginPage from "./pages/LoginPage.tsx";
import RedirectPage from "./pages/RedirectPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/user/login" replace />,
  },
  {
    path: "/user",
    element: <App />,
    children: [
      {
        path: "/user/login",
        element: (
          <ReboundComp>
            <LoginPage />
          </ReboundComp>
        ),
        index: true,
      },
      {
        path: "/user/auth",
        element: <RedirectPage />,
      },
      {
        path: "/user/auth/chat",
        element: (
          <AuthorizedRoute>
            <div>you are on main chat</div>,
          </AuthorizedRoute>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
