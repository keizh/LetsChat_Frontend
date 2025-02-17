import { useState, useRef, useEffect } from "react";
import { Input } from "@material-tailwind/react";
import useSelectorHook from "../customHooks/useSelectorHook";

import { ActiveChatInterface } from "../types";
import ActiveChatRectangleTab from "../components/ActiveChatRectangleTab";

function ListOfChats() {
  const [searchInChats, setSearchInChats] = useState("");
  const resultOfSearch = useRef<ActiveChatInterface[]>([]);
  const { ListOfActiveChats } = useSelectorHook("CHATSANDCONTACT");

  useEffect(() => {
    resultOfSearch.current = ListOfActiveChats.filter((ele) =>
      ele.chatName.toLowerCase().includes(searchInChats.toLowerCase())
    );
  }, [ListOfActiveChats, searchInChats]);

  useEffect(() => {
    console.log(`ListOfChats mounted`);
    return () => {
      console.log(`ListOfChats unmounted`);
    };
  }, []);

  return (
    <>
      <div className="bg-white">
        <Input
          crossOrigin="anonymous"
          label="Search Chat"
          onChange={(e) => setSearchInChats(e.target.value)}
        />
      </div>
      {/* when you are not searching */}
      {searchInChats == "" && (
        <div
          id="scrollableDiv"
          className="scrollbar rounded-md bg-white flex-grow overflow-auto   p-[10px]"
        >
          {ListOfActiveChats.map((ele: ActiveChatInterface) => {
            // console.log(`re-renders ------------->`);
            return <ActiveChatRectangleTab key={ele.roomId} ele={ele} />;
          })}
        </div>
      )}
      {/* when you are searching and ListOfActiveChats is greater than 0 */}
      {searchInChats != "" && ListOfActiveChats.length > 0 && (
        <div className="scrollbar rounded-md bg-white flex-grow overflow-auto  flex flex-col   p-[10px]">
          {resultOfSearch.current.length > 0 ? (
            resultOfSearch.current.map((ele: ActiveChatInterface) => (
              <ActiveChatRectangleTab key={ele.roomId} ele={ele} />
            ))
          ) : (
            <p>No Such Search Result {searchInChats}</p>
          )}
        </div>
      )}
    </>
  );
}

export default ListOfChats;
