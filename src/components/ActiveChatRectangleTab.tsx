import { useEffect, useState } from "react";
import { Avatar, Typography, Chip } from "@material-tailwind/react";
import useDispatchHook from "../customHooks/useDispatchHook";
import {
  setActiveChatBox,
  fetchChatHistory,
  setdontJumpToNextChatWithoutLeaveingCurrentChatTRUE,
} from "../Features/ACTIVECHATslice";
import useSelectorHook from "../customHooks/useSelectorHook";
import { ActiveChatInterface } from "../types";
import { update_USER_LAST_ACCESS_TIME_ListOfFriends } from "../Features/ChatsANDContactslice";
import store from "../APP/store";

function ActiveChatRectangleTab({ ele }: { ele: ActiveChatInterface }) {
  const dispatch = useDispatchHook();
  const { userId } = useSelectorHook("USER");
  const [isAlert, setIsAlert] = useState<boolean>(
    ele.lastMessageTime > ele.USER_LAST_ACCESS_TIME
      ? ele.lastMessageSender != userId
      : false
  );
  const { ActiveChat } = useSelectorHook("ACTIVECHAT");

  useEffect(() => {
    const newAlertState =
      ele.lastMessageTime > ele.USER_LAST_ACCESS_TIME &&
      ele.lastMessageSender !== userId;
    setIsAlert(newAlertState);
  }, [
    ele.lastMessageTime,
    ele.USER_LAST_ACCESS_TIME,
    ele.lastMessageSender,
    userId,
  ]);

  const onClickHandler = () => {
    const lastAccessMoment = Date.now();

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
            admin: ele.admin,
          })
        );
        // fetch ONE2ONE chat history
        // console.log(`lastAccessMoment 1 ⚠️`, lastAccessMoment);
        dispatch(
          fetchChatHistory({
            participants: [userId, ele.chatId],
            userIdOfClient: userId,
            userIdOfOppositeUser: ele.chatId,
            chatId: "",
            lastAccessMoment,
            messagesRecieved: store.getState().ACTIVECHAT.messagesRecieved,
            messagesDeleted: store.getState().ACTIVECHAT.messagesDeleted,
            PageNumber: store.getState().ACTIVECHAT.nextPage,
          })
        );
        // update last access time
        // console.log(
        //   `update_USER_LAST_ACCESS_TIME_ListOfFriends----> dispatched on clicking activeCHatRectangleTAB`
        // );
        // update_USER_LAST_ACCESS_TIME_ListOfFriends
      } else {
        dispatch(
          setActiveChatBox({
            email: "GROUP CHAT",
            name: ele.chatName,
            profileURL: ele.profileURL,
            admin: ele.admin,
          })
        );
        dispatch(
          fetchChatHistory({
            participants: [],
            userIdOfClient: userId,
            userIdOfOppositeUser: "",
            chatId: ele.chatId,
            lastAccessMoment,
            messagesRecieved: store.getState().ACTIVECHAT.messagesRecieved,
            messagesDeleted: store.getState().ACTIVECHAT.messagesDeleted,
            PageNumber: store.getState().ACTIVECHAT.nextPage,
          })
        );
      }
      // console.log(`lastAccessMoment 2 ⚠️`, lastAccessMoment);
      dispatch(
        update_USER_LAST_ACCESS_TIME_ListOfFriends({
          roomId: ele.roomId,
          USER_LAST_ACCESS_TIME: lastAccessMoment,
        })
      );
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
