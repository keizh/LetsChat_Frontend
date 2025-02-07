import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { useState } from "react";
import store from "../APP/store";
import useDispatchHook from "../customHooks/useDispatchHook";
import {
  setToggleUserProfileButton,
  updateProfileURL,
} from "../Features/USERslice";

function ProfileImageUpdate() {
  const editUserProfileButton = store.getState().USER.editUserProfileButton;
  const [pic, setPIC] = useState<File | null>(null);
  const handler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file: File | null =
      e && e.target && e.target.files ? e.target.files[0] : null;
    const imageType = file ? file.type.split("/")[1] : "";
    if (
      file &&
      (imageType == "png" || imageType == "jpg" || imageType == "jpeg")
    ) {
      setPIC(file);
    }
  };

  const updateHandler = () => {
    const FD = new FormData();
    FD.append("profileImage", pic);
    for (const pair of FD.entries()) {
      console.log(pair);
    }
    dispatch(updateProfileURL({ FORMDATA: FD }));
    dispatch(setToggleUserProfileButton());
  };

  const dispatch = useDispatchHook();
  return (
    <div>
      <Dialog open={editUserProfileButton}>
        <DialogHeader>
          Update Profile Image ( Image Type : png , jpg , jpeg)
        </DialogHeader>
        <DialogBody>
          <input type="file" onChange={handler} />
        </DialogBody>
        <DialogFooter>
          <Button
            onClick={() => dispatch(setToggleUserProfileButton())}
            variant="text"
            color="red"
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button
            disabled={pic == null ? true : false}
            onClick={updateHandler}
            variant="gradient"
            color="green"
          >
            <span>UPDATE</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default ProfileImageUpdate;
