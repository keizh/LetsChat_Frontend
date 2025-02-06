import { useEffect, useState } from "react";
import { Avatar, Typography, Chip } from "@material-tailwind/react";
import { useWSContext } from "../contexts/WebSocketConnectionContext";
import useDispatchHook from "../customHooks/useDispatchHook";
import {
  setActiveChatBox,
  fetchChatHistory,
  setdontJumpToNextChatWithoutLeaveingCurrentChatTRUE,
} from "../Features/ACTIVECHATslice";
import useSelectorHook from "../customHooks/useSelectorHook";
import { ActiveChatInterface } from "../types";

function ActiveChatRectangleTab({ ele }: { ele: ActiveChatInterface }) {
  const [isAlert, setIsAlert] = useState<boolean>(false);
  const { ws } = useWSContext();
  const dispatch = useDispatchHook();
  const { userId } = useSelectorHook("USER");
  const { ActiveChat } = useSelectorHook("ACTIVECHAT");

  useEffect(() => {
    if (ws?.current != null) {
      console.log(`active listening to ws?.curren `);
      ws.current.onmessage = (event: MessageEvent) => {
        const parse = JSON.parse(event.data as string);
        const { type, payload } = parse;
        if (type == "Message/ALERT") {
          console.log(`Message/ALERT -> hit`);
          const { roomId } = payload;
          if (ele.roomId == roomId) {
            setIsAlert(true);
          }
        }
      };
    }
  }, [ele.roomId, ws]);

  const onClickHandler = () => {
    if (!ActiveChat) {
      // mark alert to false
      setIsAlert(false);
      // chatID in case of group is chatId of group
      // in case of personal it is ~ userId of oppoiste user
      if (!ele.chatId.includes("GROUP")) {
        // if GROUP IS FALSE ~ PERSONAL
        // if GROUP IS TRUE ~ GROUP
        dispatch(
          setActiveChatBox({
            email: "PERSONAL CHAT",
            name: ele.chatName,
            profileURL: ele.profileURL,
          })
        );
        dispatch(
          fetchChatHistory({
            participants: [userId, ele.chatId],
            userIdOfClient: userId,
            userIdOfOppositeUser: ele.chatId,
          })
        );
      } else {
        dispatch(
          setActiveChatBox({
            email: "GROUP CHAT",
            name: ele.chatName,
            profileURL: ele.profileURL,
          })
        );
        //   dispatch(DIFFERENT PROTOCOL TO FETCH GROUP CHAT);
      }
    } else {
      dispatch(setdontJumpToNextChatWithoutLeaveingCurrentChatTRUE());
    }
  };

  return (
    <div
      onClick={onClickHandler}
      className="cursor-pointer min-h-[8vh] py-4 px-4 border-2 rounded-md mb-[10px]"
    >
      <div className="flex items-center gap-4">
        <Avatar src={ele.profileURL} alt="avatar" variant="rounded" />
        <div>
          <Typography variant="h6">{ele.chatName}</Typography>
          <Typography variant="small" color="gray" className="font-normal">
            ALERT{" "}
            {isAlert && (
              <Chip
                size="sm"
                className="ml-2 inline"
                color="green"
                value="New Message"
              />
            )}
          </Typography>
        </div>
      </div>
    </div>
  );
}

export default ActiveChatRectangleTab;
