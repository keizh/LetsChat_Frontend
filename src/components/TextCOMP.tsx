import store from "../APP/store";
import moment from "moment";
import { mssgInt } from "../types";
import { Button } from "@material-tailwind/react";
import { memo } from "react";

function TextCOMP({ ele }: { ele: mssgInt }) {
  const momentObj = moment(ele.uploadTime);
  const formattedDate = momentObj.format("MMMM Do YYYY, h:mm:ss a");
  const userId = store.getState().USER.userId;
  return (
    <div className="min-h-[5vh] flex p-2 ">
      <div
        className={`${
          userId == ele.senderId
            ? "bg-[#a5d6a7] ml-auto text-white"
            : "bg-black mr-auto text-white"
        } max-w-[80%] flex flex-col items-end gap-[5px] rounded-md p-2`}
      >
        <p>{ele.payload}</p>
        <p className="p-2 rounded bg-white text-red-400">{formattedDate}</p>
        {ele.deleteState && ele.senderId == store.getState().USER.userId && (
          <Button fullWidth color="red" size="sm">
            DELETE
          </Button>
        )}
      </div>
    </div>
  );
}

const arePropsEqual = (prevProps, nextProps) => {
  return prevProps.ele.mssgId === nextProps.ele.mssgId;
};

const MemoizedTextComp = memo(TextCOMP, arePropsEqual);

export default MemoizedTextComp;
