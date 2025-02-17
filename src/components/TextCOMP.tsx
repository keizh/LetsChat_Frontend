import store from "../APP/store";
import moment from "moment";
import { mssgInt } from "../types";
import { Button } from "@material-tailwind/react";
import { memo } from "react";
import {
  deleteMessageSYNC,
  deleteMessageASYNC,
} from "../Features/ACTIVECHATslice";

function TextCOMP({ ele }: { ele: mssgInt }) {
  const momentObj = moment(ele.uploadTime);
  const formattedDate = momentObj.format("MMMM Do YYYY, h:mm:ss a");
  const userId = store.getState().USER.userId;
  const deleteHandler = () => {
    store.dispatch(
      deleteMessageSYNC({
        mssgId: ele.mssgId,
        chatId: store.getState().ACTIVECHAT.ActiveChatId,
      })
    );
    store.dispatch(
      deleteMessageASYNC({
        mssgId: ele.mssgId,
        chatId: store.getState().ACTIVECHAT.ActiveChatId,
      })
    );
  };
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
        <p>{ele.senderName}</p>
        {ele.deleteState && ele.senderId == store.getState().USER.userId && (
          <Button onClick={deleteHandler} fullWidth color="red" size="sm">
            DELETE
          </Button>
        )}
      </div>
    </div>
  );
}

const arePropsEqual = (
  prevProps: { ele: mssgInt },
  nextProps: { ele: mssgInt }
) => {
  return prevProps.ele.mssgId === nextProps.ele.mssgId;
};

const MemoizedTextComp = memo(TextCOMP, arePropsEqual);

export default MemoizedTextComp;
