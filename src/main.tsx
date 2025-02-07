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
import ListOfChats from "./components/ListOfChats.tsx";
import Contacts from "./components/Contacts.tsx";
import WSContextComp from "../src/contexts/WebSocketConnectionContext.tsx";

// PAGES
import LoginPage from "./pages/LoginPage.tsx";
import RedirectPage from "./pages/RedirectPage.tsx";
import ChatPage from "./pages/ChatPage.tsx";

// action-creators / thunk-action-creator
import {
  fetchActiveChats,
  fetchFriends,
} from "./Features/ChatsANDContactslice.ts";
import { fetchUserActiveChatsLastAccessTime } from "./Features/USERslice.ts";

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
        loader: (): null => {
          store.dispatch(fetchUserActiveChatsLastAccessTime());
          return null;
        },
        element: (
          <AuthorizedRoute>
            <WSContextComp>
              <ChatPage />
            </WSContextComp>
          </AuthorizedRoute>
        ),
        children: [
          {
            index: true,
            loader: (): null => {
              // const {
              // CHATSANDCONTACT: { ListOfActiveChats },
              // } = store.getState();
              // if (ListOfActiveChats.length == 0) {
              store.dispatch(fetchActiveChats({}));
              // }
              return null;
            },
            element: <ListOfChats />,
          },
          {
            loader: (): null => {
              // console.log(`line 65`);
              // const {
              //   CHATSANDCONTACT: { curPage },
              // } = store.getState();
              store.dispatch(fetchFriends(1));
              // console.log(`line 67`);
              return null;
            },
            path: "/user/auth/chat/contacts",
            element: <Contacts />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
