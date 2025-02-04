import { useState, useEffect } from "react";
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
import useWindow from "../customHooks/useWindow";
function ChatBox() {
  const [text, setText] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const dimention = useWindow();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  const storeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles([]);
    if (e.target.files) {
      const files: File[] = Array.from(e.target.files);
      files.forEach((file: File) => {
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
          setFiles((files) => [...files, file]);
        }
      });
    }
  };
  return (
    <div className="h-[100%] w-[100%]  bg-[#f1f8e9] z-[100]">
      {/* TOP section */}
      <div className=" h-[8%] flex justify-between items-center px-3 ">
        <div className="flex items-center gap-4">
          {dimention.x < 600 ? (
            <Avatar
              src="https://docs.material-tailwind.com/img/face-2.jpg"
              alt="avatar"
              variant="rounded"
              size="sm"
            />
          ) : (
            <Avatar
              src="https://docs.material-tailwind.com/img/face-2.jpg"
              alt="avatar"
              variant="rounded"
              size="md"
            />
          )}

          <div>
            <Typography variant="h6">Tania Andrew</Typography>
            <Typography variant="small" color="gray" className="font-normal">
              Web Developer
            </Typography>
          </div>
        </div>
        <div className="flex gap-4">
          <Button size="sm" color="blue">
            EDIT{" "}
          </Button>
          <Button size="sm" color="red">
            EXIT CHAT
          </Button>
        </div>
      </div>

      {/* MIddle Section */}
      <div className="h-[78%] sm:h-[84%] p-2">
        <div className="bg-white h-full rounded"></div>
      </div>

      {/* Bottom Section */}
      <div className="h-[14%] bg-white sm:h-[8%] flex flex-col justify-center sm:flex-row items-center gap-1 px-2">
        <div className="w-[100%] sm:w-fit sm:flex-grow">
          <Input onChange={(e) => storeFile(e)} label="text" className="" />
        </div>
        <div className=" w-[100%] space-between sm:w-fit flex gap-2 ">
          <Button fullWidth>SEND</Button>
          <Button
            onClick={handleOpen}
            fullWidth
            variant="gradient"
            color="blue"
            className="flex items-center gap-2 px-4 py-2 normal-case"
          >
            <input id="file" type="file" className="hidden" />
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
        </div>
      </div>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>SEND</DialogHeader>
        <DialogBody>
          <Typography>
            AUDIO , VIDEO , PDF , IMAGES <br /> (AT MAX 10 files : 4MB EACH)
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
          <Button variant="gradient" color="green" onClick={handleOpen}>
            <span>SEND</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default ChatBox;
