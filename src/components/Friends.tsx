import React from "react";
import { Avatar, Typography } from "@material-tailwind/react";
import { friendsInterface } from "../types";

function Friends({ ele }: { ele: friendsInterface }) {
  console.log(ele.name);
  return (
    <div className="min-h-[8vh] py-2 px-4 border-2 rounded-md mb-[10px]">
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
