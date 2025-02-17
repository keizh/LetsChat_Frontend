import { useState } from "react";
import {
  Button,
  Avatar,
  Typography,
  Input,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import ChatPad from "../components/ChatPad";
import useWindow from "../customHooks/useWindow";
import useSelectorHook from "../customHooks/useSelectorHook";
import useDispatchHook from "../customHooks/useDispatchHook";
import { useWSContext } from "../contexts/WebSocketConnectionContext";
import { setInActiveChatBox, postFiles } from "../Features/ACTIVECHATslice";
import { update_USER_LAST_ACCESS_TIME_ListOfFriends } from "../Features/ChatsANDContactslice";
// import { setLastAccessToRoom } from "../Features/USERslice";
import store from "../APP/store";
import {
  fetchGroupMembers,
  fetchedFriendsToMakeGroup,
  updateOpenGroupEditState,
} from "../Features/GroupSlice";

function ChatBox() {
  const dispatch = useDispatchHook();
  const [text, setText] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const dimention = useWindow();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  //🌟 state from ACTIVECHAT  Slice
  const {
    activeChatloading,
    activeChatEmail,
    activeChatName,
    activeChatProfileURL,
    ActiveChatId,
    ActiveChatMessages,
    ActiveChatRoom,
    fileUploadLoadState,
  } = useSelectorHook(`ACTIVECHAT`);
  //🌟 state from USER Slice
  const { userId, userName } = useSelectorHook(`USER`);
  const storeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles([]);
    if (e.target.files) {
      const files: File[] = Array.from(e.target.files);
      files.forEach((file: File, index) => {
        const type = file.type.split("/")[1];
        const size = file.size;
        if (
          (type == "pdf" ||
            type == "png" ||
            type == "jpeg" ||
            type == "mpeg" ||
            type == "mp4") &&
          size < 4.2 * 1024 * 1024
        ) {
          if (index <= 7) setFiles((files) => [...files, file]);
        }
      });
    }
  };
  const { ws } = useWSContext();
  // EXIT HANDLER WORKING PERFECTLY
  const exitHandler = () => {
    // console.log(`clicked`);
    const lastAccessMoment = Date.now();
    // dispatch(setLastAccessToRoom(ActiveChatRoom));
    // console.log(
    //   `update_USER_LAST_ACCESS_TIME_ListOfFriends----> dispatched on clicking ext chat`
    // );
    dispatch(
      update_USER_LAST_ACCESS_TIME_ListOfFriends({
        roomId: ActiveChatRoom,
        USER_LAST_ACCESS_TIME: lastAccessMoment,
      })
    );

    dispatch(setInActiveChatBox());
    if (ws?.current != null) {
      ws.current.send(
        JSON.stringify({
          type: "CLOSE/CHAT",
          payload: {
            userId: userId,
            lastAccessMoment,
          },
        })
      );
    }
  };

  // MESSAGE SENT SUCCESSFULLY
  const sendMessageHandler = () => {
    // console.log(`clicked`);
    if (ws?.current != null) {
      ws?.current.send(
        JSON.stringify({
          type: "SEND/MESSAGE",
          payload: {
            userId: userId,
            userName: userName,
            roomId: ActiveChatRoom,
            chatId: ActiveChatId,
            message: text,
          },
        })
      );
      setText("");
    } else {
      // console.error(`Failed to make socket connection`);
    }
  };

  const sendFileHandler = () => {
    // console.log(`hit`);
    const FILES_FORMDATA = new FormData();

    files.forEach((file) => {
      FILES_FORMDATA.append("fileInput", file);
    });

    FILES_FORMDATA.append("userId", `${userId}`);
    FILES_FORMDATA.append("userName", `${userName}`);
    FILES_FORMDATA.append("roomId", `${ActiveChatRoom}`);
    FILES_FORMDATA.append("chatId", `${ActiveChatId}`);

    dispatch(postFiles({ FILES_FORMDATA }));
    handleOpen();
  };

  const editHandler = () => {
    dispatch(fetchGroupMembers({}));
    dispatch(fetchedFriendsToMakeGroup({}));
    dispatch(updateOpenGroupEditState(true));
  };

  if (activeChatloading) {
    return (
      <div className="h-[100%] w-[100%]  bg-[#f1f8e9] z-[100] flex justify-center items-center">
        <Button className="rounded-full" loading={true}>
          Loading
        </Button>
      </div>
    );
  } else {
    return (
      <div className="h-[100%] w-[100%]  bg-[#f1f8e9] z-[100]">
        {/* TOP section */}
        <div className=" h-[8%] flex justify-between items-center px-3 ">
          <div className="flex items-center gap-4">
            {dimention.x < 600 ? (
              <Avatar
                src={activeChatProfileURL}
                alt="avatar"
                variant="rounded"
                size="sm"
              />
            ) : (
              <Avatar
                src={activeChatProfileURL}
                alt="avatar"
                variant="rounded"
                size="md"
              />
            )}

            <div>
              <Typography variant="h6">{activeChatName}</Typography>
              <Typography variant="small" color="gray" className="font-normal">
                {activeChatEmail}
              </Typography>
            </div>
          </div>
          <div className="flex gap-4">
            {!ActiveChatId.includes("PERSONAL") &&
              store.getState().ACTIVECHAT.admin ==
                store.getState().USER.userId && (
                <Button onClick={editHandler} size="sm" color="blue">
                  EDIT
                </Button>
              )}
            <Button size="sm" color="red" onClick={exitHandler}>
              EXIT CHAT
            </Button>
          </div>
        </div>
        {/* MIddle Section */}
        <div className="h-[78vh]  sm:h-[84%] rounded p-2 ">
          <ChatPad />
        </div>
        {/* Bottom Section */}
        <div className="h-[14%] bg-white sm:h-[8%] flex flex-col justify-center sm:flex-row items-center gap-1 px-2">
          <div className="w-[100%] sm:w-fit sm:flex-grow">
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              label="text"
              crossOrigin="anonymous"
            />
          </div>
          <div className=" w-[100%] space-between sm:w-fit flex gap-2 ">
            <Button
              disabled={!text}
              color={text == "" ? "black" : "green"}
              fullWidth
              onClick={sendMessageHandler}
            >
              SEND
            </Button>

            {ActiveChatMessages.length > 0 && (
              <Button
                onClick={handleOpen}
                loading={fileUploadLoadState}
                disabled={fileUploadLoadState}
                fullWidth
                variant="gradient"
                color="blue"
                className="flex items-center gap-2 px-4 py-2 normal-case"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
                  />
                </svg>
                <span>Upload Files</span>
              </Button>
            )}
          </div>
        </div>
        ){/* DIALOG BOX */}
        <Dialog open={open} handler={handleOpen}>
          <DialogHeader>SEND</DialogHeader>
          <DialogBody>
            <Typography>
              AUDIO , VIDEO , PDF , IMAGES <br /> (AT MAX 8 files : 4MB EACH)
            </Typography>
            <input
              type="file"
              className="pt-[10px]"
              multiple
              onChange={(e) => storeFile(e)}
            />
            <ol>
              {files.map((ele, idx) => (
                <li key={idx}>
                  {idx + 1}{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="red"
                    className="size-4 inline"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                    />
                  </svg>
                  {ele.name}
                </li>
              ))}
            </ol>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              color="red"
              onClick={handleOpen}
              className="mr-1"
            >
              <span>Cancel</span>
            </Button>
            <Button
              loading={fileUploadLoadState}
              disabled={fileUploadLoadState}
              onClick={sendFileHandler}
              variant="gradient"
              color="green"
            >
              <span>SEND</span>
            </Button>
          </DialogFooter>
        </Dialog>
      </div>
    );
  }
}

export default ChatBox;
