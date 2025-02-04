import React from "react";
import { Avatar, Typography } from "@material-tailwind/react";
import { friendsInterface } from "../types";
import useDispatchHook from "../customHooks/useDispatchHook";
import useSelectorHook from "../customHooks/useSelectorHook";
import {
  setActiveChatBox,
  fetchChatHistory,
} from "../Features/ACTIVECHATslice";

function Friends({ ele }: { ele: friendsInterface }) {
  console.log(ele.name);
  const dispatch = useDispatchHook();
  const { userId } = useSelectorHook("USER");
  const openChatBox = () => {
    dispatch(setActiveChatBox());
    dispatch(fetchChatHistory({ participants: [userId, ele._id] }));
    console.log(userId, ele._id);
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
