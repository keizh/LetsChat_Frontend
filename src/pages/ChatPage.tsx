import useSelectorHook from "../customHooks/useSelectorHook";
import {
  Avatar,
  Typography,
  Button,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Outlet, useNavigate } from "react-router-dom";

export default function ChatPage() {
  // console.log(`${Date.now()} re-renderd`);
  const { userName, userEmail, userProfileURL } = useSelectorHook(`USER`);
  const { ActiveChat } = useSelectorHook(`ACTIVECHAT`);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen flex p-2 gap-2">
      <aside className="w-[100%] md:w-[35%] bg-red-100 rounded-md flex flex-col">
        {/* TOP Section */}
        <div className="p-4 flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-4">
            <Avatar
              src="https://res.cloudinary.com/dddkhewor/image/upload/v1737289388/i0cjrrpehlznmvhhhx8o.png"
              alt="avatar"
              variant="rounded"
            />
            <div>
              <Typography variant="h6">{userName}</Typography>
              <Typography variant="small" color="gray" className="font-normal">
                {userEmail}
              </Typography>
            </div>
          </div>
          <div className="mt-2 flex gap-4 p-2 bg-black rounded-md">
            <Button color="amber">EDIT Profile</Button>
            <Button color="green">Create Group</Button>
            <Button color="red">Log-Out</Button>
          </div>
        </div>
        {/* Bottom Section */}
        <div className="p-4 flex flex-col gap-4 justify-between flex-grow bg-black rounded-md overflow-x-hidden overflow-y-auto">
          <ul className="w-[100%] bg-white rounded-xl flex justify-center gap-[25%] px-3 py-2">
            <li
              className="relative flex justify-center items-center z-[0]"
              onClick={() => {
                setActiveIndex(0);
                navigate(`/user/auth/chat`);
              }}
            >
              <span className=" relative text-3xl z-[10]">Home</span>
              {activeIndex == 0 && (
                <motion.div
                  className="z-[5] absolute inset-0 bg-red-100 bg-[#cfd8dc] rounded "
                  layoutId="active-indicator"
                />
              )}
            </li>
            <li
              className="relative flex justify-center items-center"
              onClick={() => {
                setActiveIndex(1);
                navigate(`/user/auth/chat/contacts`);
              }}
            >
              <span className="relative text-3xl z-[10]">About</span>
              {activeIndex == 1 && (
                <motion.div
                  className=" absolute inset-0 bg-red-100 bg-[#cfd8dc] rounded"
                  layoutId="active-indicator"
                />
              )}
            </li>
          </ul>
          <Outlet />
        </div>
      </aside>
      <section
        className={`${
          ActiveChat ? `block fixed inset-0 m-2  z-40` : `hidden`
        }   md:w-[65%] md:block md:m-0 absolute md:relative bg-red-200 rounded-md`}
      >
        fewggergre
      </section>
    </div>
  );
}
