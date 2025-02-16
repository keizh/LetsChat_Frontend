/* eslint-disable react-refresh/only-export-components */
import { useState, useRef, createContext, useContext, useEffect } from "react";
import { AuxProps } from "../types";
import useSelectorHook from "../customHooks/useSelectorHook";
import useDispatchHook from "../customHooks/useDispatchHook";
import {
  addNewActiveChat,
  updateActiveChatsArraay,
  removeGroupChat,
} from "../Features/ChatsANDContactslice";
import {
  addMessageRecieved,
  deleteMessageSYNC,
  setInActiveChatBox,
} from "../Features/ACTIVECHATslice";
type WSContextType = {
  ws: React.MutableRefObject<WebSocket | null> | null;
  logoutHandler: () => void;
  attemptingToConnectState: boolean;
  wsSET: boolean;
};
import store from "../APP/store";

export const WSContext = createContext<WSContextType>({
  ws: null,
  logoutHandler: () => {},
  attemptingToConnectState: false,
  wsSET: false,
});

export const useWSContext = () => useContext(WSContext);

const WSContextComp = (Props: AuxProps) => {
  const dispatch = useDispatchHook();
  const maxAttempt = useRef<number>(5);
  const currentAttempt = useRef<number>(0);
  const [wsSET, setWSSET] = useState<boolean>(false);
  /* ⭐ The below var : logoutIntentionally
  This variable is used to mark when when we click the logut button intentionally or 
  When we close the browser , the beforeunload is triggered
*/
  const logoutIntentionally = useRef<boolean>(false);
  //   ⭐ attemptingToConnectState = true , connection has been made
  //   ⭐ attemptingToConnectState = false , connection has not been made yet
  const [attemptingToConnectState, setAttemptingToConnectState] =
    useState<boolean>(true);
  const ws = useRef<null | WebSocket>(null);

  const { userId } = useSelectorHook(`USER`);

  // const { ActiveChatRoom } = useSelectorHook(`ACTIVECHAT`);

  // ⭐ : USER CLICK LOGOUT HANDLER
  const logoutHandler = () => {
    if (ws.current != null && ws.current?.readyState === WebSocket.OPEN) {
      logoutIntentionally.current = true;
      ws.current?.send(
        JSON.stringify({ type: "LOGOUT", payload: { userId: userId } })
      );
      ws.current?.close(1000, `${userId} logout voluntarily `);
    }
  };

  const connectionFunction = () => {
    ws.current = new WebSocket(import.meta.env.VITE_BACKEND_URL);

    if (ws.current) {
      setWSSET(true);
    }

    ws.current.onopen = () => {
      currentAttempt.current = 0;
      setAttemptingToConnectState(false);
      ws.current?.send(
        JSON.stringify({ type: "LOGIN", payload: { userId: userId } })
      );
    };

    ws.current.onclose = () => {
      // ⚠️ onclose gets triggered due to connection failure or when .close is executed
      // is  logoutIntentionally = true , it is due to .close  , meaning intentional
      if (logoutIntentionally.current) {
        return;
      }

      //   connection retry logic
      if (currentAttempt.current < maxAttempt.current) {
        const delay = Math.pow(2, currentAttempt.current) * 1000;

        setTimeout(() => {
          currentAttempt.current += 1;
          console.log(`WebSocket connection TRY: ${currentAttempt.current}`);
          connectionFunction();
        }, delay);
      }
    };
  };

  useEffect(() => {
    // start ws connection on mount of component
    connectionFunction();

    const handler = () => {
      // ⭐ Checking if connection has been established or not
      // IF Established
      if (attemptingToConnectState) {
        logoutHandler();
      }
    };

    window.addEventListener("beforeunload", handler);

    return () => {
      window.removeEventListener("beforeunload", handler);
    };
  }, []);

  useEffect(() => {
    // console.log(`first mount`);
    const handler = (event: MessageEvent) => {
      const parse = JSON.parse(event.data as string);
      const { type, payload } = parse;
      // console.log(`ACTIVE/CHAT/ACTIVATION gonna be hit`);
      // console.log(type, payload);

      switch (type) {
        case "ACTIVE/CHAT/ACTIVATION":
          // console.log(`ACTIVE/CHAT/ACTIVATION hit`);
          // console.log(`new chat`, payload);
          dispatch(addNewActiveChat(payload));
          break;

        case "Message/ALERT":
          // console.log(`Message/ALERT -> hit`);
          // const { roomId, lastUpdated, lastMessageSender, lastMessageTime } =
          //   payload;
          dispatch(
            updateActiveChatsArraay({
              roomId: payload.roomId,
              lastUpdated: payload.lastUpdated,
              lastMessageSender: payload.lastMessageSender,
              lastMessageTime: payload.lastMessageTime,
            })
          );
          break;

        case "RECEIVE/MESSAGE":
          // const { mssgData, roomId } = payload;
          // console.log(`RECIEVE/MESSAGE`, mssgData, roomId);
          // console.log(`roomId`, roomId, typeof roomId);
          console.log(`message reciveved , checking if roomId also matched`);
          console.log(`payload.roomId`, payload.roomId);
          console.log(
            `ActiveChatRoom`,
            store.getState().ACTIVECHAT.ActiveChatRoom
          );
          if (payload.roomId == store.getState().ACTIVECHAT.ActiveChatRoom) {
            console.log(`message will get added`, payload.mssgData);
            dispatch(addMessageRecieved(payload.mssgData));
          }
          break;

        case "DELETE/MESSAGE":
          console.log(`DELETE/MESSAGE from server recieved`);
          dispatch(
            deleteMessageSYNC({
              mssgId: payload.mssgId,
              chatId: payload.chatId,
            })
          );
          break;

        case "REMOVE/GROUP/CHAT":
          console.log(`007 removeGroupChat hit`);
          dispatch(
            removeGroupChat({
              roomId: payload.roomId,
              chatId: payload.chatId,
            })
          );
          break;

        case "ADD/GROUP/CHAT":
          console.log(`007 addGroupChat hit`);
          dispatch(addNewActiveChat(payload));
          break;

        case "DELETE/GROUP/CHAT":
          if (store.getState().ACTIVECHAT.ActiveChatId == payload.chatId) {
            dispatch(setInActiveChatBox());
          }
          dispatch(removeGroupChat({ roomId: payload.roomId }));
          break;

        default:
          console.log(`Unhandled message type: ${type}`);
      }
    };

    if (ws?.current != null) {
      // console.log(`second mount`);
      ws.current.addEventListener("message", handler);
    }
    return () => {
      if (ws?.current != null) {
        ws.current.removeEventListener("message", handler);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ws, wsSET]);

  const value = { ws, logoutHandler, attemptingToConnectState, wsSET };

  return (
    <WSContext.Provider value={value}>{Props.children}</WSContext.Provider>
  );
};

export default WSContextComp;
