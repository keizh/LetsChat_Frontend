import { useState, useRef, createContext, useContext, useEffect } from "react";

import useSelectorHook from "../customHooks/useSelectorHook";

type WSContextType = {
  ws: React.MutableRefObject<WebSocket | null>;
  logoutHandler: () => void;
  attemptingToConnectState: boolean;
};

export const WSContext = createContext<WSContextType | null>(null);

export const useWSContext = () => useContext(WSContext);

const WSContextComp = ({ children }) => {
  const maxAttempt = useRef<number>(5);
  const currentAttempt = useRef<number>(0);
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
      if (logoutIntentionally) {
        return;
      }

      //   connection retry logic
      if (currentAttempt.current < maxAttempt.current) {
        let delay = Math.pow(2, currentAttempt.current);

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

  const value = { ws, logoutHandler, attemptingToConnectState };

  return <WSContext.Provider value={value}>{children}</WSContext.Provider>;
};

export default WSContextComp;
