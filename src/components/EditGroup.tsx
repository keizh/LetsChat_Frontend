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
import { updateGroup, updateOpenGroupEditState } from "../Features/GroupSlice";
import useDispatchHook from "../customHooks/useDispatchHook";
import useSelectorHook from "../customHooks/useSelectorHook";
import { useEffect, useState, useRef } from "react";
import store from "../APP/store";

const checkIfSame = (selected: string[], groupMembers: string[]) => {
  //   console.log(`-->`, selected);
  //   console.log(`-->`, groupMembers);
  if (
    selected.length > groupMembers.length ||
    selected.length < groupMembers.length
  ) {
    return true;
  }

  const a: string[] = [...selected].sort();
  const b: string[] = [...groupMembers].sort();

  for (let i = 0; i < selected.length; i++) {
    if (a[i] != b[i]) {
      console.log(`returned true `);
      return true;
    }
  }
  console.log(`returned FALSE`);
  return false;
};

export default function EditGroup() {
  const {
    openEditGroupModel,
    creatingGroupEditLoadingState,
    allContacts,
    groupMembers,
    defaultValuesForSelect,
  } = useSelectorHook("GROUP");
  const { ActiveChatId } = useSelectorHook("ACTIVECHAT");
  const dispatch = useDispatchHook();

  const [GN, setGN] = useState<string>("");
  const refGN = useRef<string>("");
  const [file, setFILE] = useState<File | string>("");
  const reffile = useRef<string>("");
  const [renderFriends, setRF] = useState<{ value: string; label: string }[]>(
    []
  );
  const [canSubmit, setCanSubmit] = useState<boolean>(false);
  const [selected, setSelected] = useState<string[]>([]);

  //   will update ~ GN , refGN , file , reffile
  useEffect(() => {
    if (ActiveChatId.includes("GROUP")) {
      setGN(store.getState().ACTIVECHAT.activeChatName);
      refGN.current = store.getState().ACTIVECHAT.activeChatName;
      setFILE(store.getState().ACTIVECHAT.activeChatProfileURL);
      reffile.current = store.getState().ACTIVECHAT.activeChatProfileURL;
    }
  }, [ActiveChatId]);

  //   will update ~ selected , renderFriends
  useEffect(() => {
    if (allContacts.length > 0 && groupMembers.length > 0) {
      const ans = allContacts.map((ele) => ({
        value: ele._id,
        label: ele.name,
      }));
      setRF(ans);
      //   console.log(`82 ,`, ans);
      //   console.log(`defaultValuesForSelect`, defaultValuesForSelect);
    }

    if (groupMembers.length > 0) {
      setSelected(groupMembers);
    }
  }, [allContacts, groupMembers]);

  //   to check if it ready to update
  useEffect(() => {
    if (
      GN != refGN.current ||
      checkIfSame(selected, groupMembers) ||
      typeof file == "object"
    ) {
      console.log(`GN != refGN.current `, GN != refGN.current);
      console.log(
        `checkIfSame(selected, groupMembers) `,
        checkIfSame(selected, groupMembers)
      );
      //   console.log(` typeof file == "string"`, typeof file == "string");
      if (selected.length > 0) {
        setCanSubmit(true);
      } else {
        setCanSubmit(false);
      }
    } else {
      //   console.log(`line 107`);
      if (canSubmit == true) {
        setCanSubmit(false);
      }
    }
  }, [GN, canSubmit, file, groupMembers, selected]);

  const onSubmitHandler = (e: HTMLFormElement) => {
    e.preventDefault();
    const FD = new FormData();

    FD.append("image", typeof file == "string" ? new Blob() : file);
    FD.append("updateImage", typeof file == "string" ? "" : "true");
    FD.append("participants", JSON.stringify(renderFriends));
    FD.append("groupName", GN);
    FD.append("chatId", store.getState().ACTIVECHAT.ActiveChatId);
    FD.append("roomId", store.getState().ACTIVECHAT.ActiveChatRoom);
    console.log(`submit clicked`);
    dispatch(updateGroup(FD));
  };

  return (
    <>
      <Dialog open={openEditGroupModel}>
        <DialogHeader>Create a Group</DialogHeader>
        <DialogBody>
          <form onSubmit={onSubmitHandler} className="flex flex-col gap-2">
            <Input
              label="Group Name"
              required
              value={GN}
              onChange={(e) => setGN(e.target.value)}
            />
            <input
              type="file"
              onChange={(e) => {
                // console.log(renderFriends);
                const file = e.target.files ? e.target.files[0] : "";
                if (
                  file &&
                  file.type.split("/")[0] == "image" &&
                  file.size < 4.2 * 1024 * 1024
                ) {
                  setFILE(file);
                }
              }}
            />
            <Typography>
              Image Name : {typeof file != "string" ? file?.name : ""}
            </Typography>
            <Button
              size="small"
              disabled={typeof file != "object"}
              onClick={() => setFILE("")}
            >
              Remove Image
            </Button>

            {defaultValuesForSelect.length > 0 && (
              <Select
                required
                isMulti
                name="colors"
                defaultValue={defaultValuesForSelect}
                options={renderFriends}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={(e) => {
                  //   console.log(e);
                  const participants = e.map((ele) => ele.value);
                  setSelected(participants);
                }}
              />
            )}
            <Button
              type="submit"
              fullWidth
              color={canSubmit ? "green" : "red"}
              disabled={!canSubmit}
              loading={creatingGroupEditLoadingState}
            >
              UPDATE GROUP
            </Button>
          </form>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => {
              dispatch(updateOpenGroupEditState(false));
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
