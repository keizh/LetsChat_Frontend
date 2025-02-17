import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Typography,
} from "@material-tailwind/react";

import Select from "react-select";
import {
  // fetchedFriendsToMakeGroup,
  updateOpenCreateModel,
  // updateCreatingGroupLoadingState,
  createGROUPchat,
} from "../Features/GroupSlice";
import useDispatchHook from "../customHooks/useDispatchHook";
import useSelectorHook from "../customHooks/useSelectorHook";
import React, { useEffect, useState } from "react";
import store from "../APP/store";

export default function CreateGroup() {
  const { openCreateModel, creatingGroupLoadingState, allContacts } =
    useSelectorHook("GROUP");
  const [GN, setGN] = useState<string>("");
  const [message, setMESSAGE] = useState<string>("");
  const [file, setFILE] = useState<File | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [renderFriends, setRF] = useState<{ value: string; label: string }[]>(
    []
  );
  const [canSubmit, setCanSubmit] = useState<boolean>(false);

  useEffect(() => {
    if (Array.isArray(allContacts) && allContacts.length > 0) {
      const ans = allContacts.map((ele) => ({
        value: ele._id,
        label: ele.name,
      }));
      console.log(`ans -->`, ans);
      setRF(ans);
    }
    console.log(`allcontact`, allContacts);
  }, [allContacts]);

  useEffect(() => {
    if (GN != "" && message != "" && file != null && selected.length > 0) {
      setCanSubmit(true);
    } else {
      if (canSubmit == true) {
        setCanSubmit(false);
      }
    }
  }, [GN, message, file, selected, canSubmit]);

  const dispatch = useDispatchHook();

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const FD = new FormData();
    if (GN != "" && message != "" && file != null && selected.length > 0) {
      FD.append("groupChatImage", file);
      FD.append("groupName", GN);
      FD.append(
        "participants",
        JSON.stringify([...selected, store.getState().USER.userId])
      );
      FD.append("firstMessage", message);
      FD.append("senderName", store.getState().USER.userName);
      dispatch(createGROUPchat(FD));
      setGN("");
      setMESSAGE("");
      setFILE(null);
      setSelected([]);
    }
  };

  return (
    <>
      <Dialog handler={() => {}} open={openCreateModel}>
        <DialogHeader>Create a Group</DialogHeader>
        <DialogBody>
          <form onSubmit={onSubmitHandler} className="flex flex-col gap-2">
            <Input
              label="Group Name"
              required
              value={GN}
              onChange={(e) => setGN(e.target.value)}
              crossOrigin="anonymous"
            />
            <Input
              label="First Message"
              required
              value={message}
              onChange={(e) => setMESSAGE(e.target.value)}
              crossOrigin="anonymous"
            />
            <input
              type="file"
              required
              onChange={(e) => {
                console.log(renderFriends);
                const file = e.target.files ? e.target.files[0] : null;
                if (
                  file &&
                  file.type.split("/")[0] == "image" &&
                  file.size < 4.2 * 1024 * 1024
                ) {
                  setFILE(e.target.files ? e.target.files[0] : null);
                }
              }}
            />
            <Typography>Image Name : {file?.name}</Typography>

            <Select
              required
              isMulti
              name="colors"
              options={renderFriends}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={(e) => {
                const participants = e.map((ele) => ele.value);
                setSelected(participants);
              }}
            />
            <Button
              type="submit"
              fullWidth
              color={canSubmit ? "green" : "red"}
              disabled={!canSubmit}
              loading={creatingGroupLoadingState}
            >
              Create Group
            </Button>
          </form>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => {
              dispatch(updateOpenCreateModel(false));
            }}
            className="mr-1"
          >
            <span>Close</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
