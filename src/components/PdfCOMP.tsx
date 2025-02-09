import { mssgInt } from "../types";
import store from "../APP/store";
import moment from "moment";
import { Button } from "@material-tailwind/react";
import {
  deleteMessageSYNC,
  deleteMessageASYNC,
} from "../Features/ACTIVECHATslice";

function PdfCOMP({ ele }: { ele: mssgInt }) {
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
    <div className="min-h-[5vh] flex p-2">
      <div
        className={`${
          userId == ele.senderId
            ? "bg-[#a5d6a7] ml-auto text-white"
            : "bg-black mr-auto text-white"
        } max-w-[80%] flex flex-col items-end gap-[5px] rounded-md p-2`}
      >
        {/* <Button href={`${ele.payload}`} fullWidth color="orange"> */}
        <a
          className="block  bg-[#4fc3f7] text-white mx-auto p-2 px-4 rounded-lg"
          href={`${ele.payload}`}
          target="_blank"
        >
          VIEW PDF
        </a>
        {/* </Button> */}

        <p className="p-2 rounded bg-white text-red-400">{formattedDate}</p>
        {ele.deleteState && ele.senderId == store.getState().USER.userId && (
          <Button onClick={deleteHandler} fullWidth color="red" size="sm">
            DELETE
          </Button>
        )}
      </div>
    </div>
  );
}

export default PdfCOMP;
