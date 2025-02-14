import React from "react";
import { Avatar, Typography } from "@material-tailwind/react";
import { friendsInterface } from "../types";
import useDispatchHook from "../customHooks/useDispatchHook";
import useSelectorHook from "../customHooks/useSelectorHook";
import {
  setActiveChatBox,
  fetchChatHistory,
} from "../Features/ACTIVECHATslice";
import store from "../APP/store";

function Friends({ ele }: { ele: friendsInterface }) {
  // console.log(ele.name);
  const dispatch = useDispatchHook();
  const { userId } = useSelectorHook("USER");
  const openChatBox = () => {
    dispatch(
      setActiveChatBox({
        email: ele.email,
        name: ele.name,
        profileURL: ele.profileURL,
      })
    );
    console.log("userId", ele._id);
    dispatch(
      fetchChatHistory({
        participants: [userId, ele._id],
        userIdOfClient: userId,
        userIdOfOppositeUser: ele._id,
        lastAccessMoment: Date.now(),
        messagesDeleted: 0,
        messagesRecieved: 0,
        PageNumber: 1,
        chatId: "",
      })
    );
    console.log("userId", ele._id);
  };
  return (
    <div
      onClick={openChatBox}
      className="cursor-pointer min-h-[8vh] py-2 px-4 border-2 rounded-md mb-[10px]"
    >
      <div className="flex items-center gap-4">
        <Avatar src={ele.profileURL} alt="avatar" variant="rounded" />
        <div>
          <Typography variant="h6">{ele.name}</Typography>
          <Typography variant="small" color="gray" className="font-normal">
            {ele.email}
          </Typography>
        </div>
      </div>
    </div>
  );
}

export default React.memo(
  Friends,
  (prev, next): boolean => prev.ele._id === next.ele._id
);
