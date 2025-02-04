/* eslint-disable no-constant-binary-expression */
/* eslint-disable no-constant-condition */
import useSelectorHook from "../customHooks/useSelectorHook";
import { Avatar, Typography, Button } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import ChatBox from "../components/ChatBox";

export default function ChatPage() {
  // console.log(`${Date.now()} re-renderd`);
  const location = useLocation();
  // console.log(`PathNamr`, location.pathname);

  const { userName, userEmail, userProfileURL } = useSelectorHook(`USER`);
  const { ActiveChat } = useSelectorHook(`ACTIVECHAT`);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname == "/user/auth/chat/contacts") {
      setActiveIndex(1);
    }
  }, []);

  return (
    <div className="h-screen w-screen flex p-2 gap-2">
      <aside className="w-[100%] md:w-[35%]     bg-[#f0f4c3] rounded-md flex flex-col">
        {/* TOP Section */}
        <div className="p-4 flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-4">
            <Avatar src={userProfileURL} alt="avatar" variant="rounded" />
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
        <div className="p-4 flex flex-col gap-4 justify-between flex-grow bg-[#f0f4c3] rounded-md overflow-x-hidden overflow-y-auto">
          <ul className="w-[100%] bg-white rounded-xl flex justify-center gap-[25%] px-3 py-2">
            <li
              className="relative flex justify-center items-center z-[0]"
              onClick={() => {
                setActiveIndex(0);
                navigate(`/user/auth/chat`);
              }}
            >
              <span className=" relative text-3xl z-[10]">Chats</span>
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
              <span className="relative text-3xl z-[10]">Contacts</span>
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
      {/*
      className={`${
true ? `block fixed inset-0 m-2  z-40` : `hidden`
}   md:w-[65%] md:block md:m-0 absolute md:relative bg-[#eceff1] rounded-md  relative border border-black overflow-hidden`} */}
      <section
        className={`${
          true ? `fixed inset-0 m-2  z-40` : `hidden`
        }   md:w-[65%]  md:m-0 absolute md:relative bg-[#eceff1] rounded-md  border border-black overflow-hidden`}
      >
        {/* BACKGROUND SVG */}
        {!true && (
          <div className="absolute z-[10] top-[50%] left-[50%] flex flex-col items-center gap-2 -translate-y-1/2 -translate-x-1/2">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="green"
                className="size-28"
              >
                <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 0 0-1.032-.211 50.89 50.89 0 0 0-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 0 0 2.433 3.984L7.28 21.53A.75.75 0 0 1 6 21v-4.03a48.527 48.527 0 0 1-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979Z" />
                <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 0 0 1.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0 0 15.75 7.5Z" />
              </svg>
            </div>
            <h4>Continue Your Chat</h4>
            <h4>Start Chatting with new Friends</h4>
          </div>
        )}
        {/* CHAT ACTIVE */}
        {true && <ChatBox />}
      </section>
    </div>
  );
}
