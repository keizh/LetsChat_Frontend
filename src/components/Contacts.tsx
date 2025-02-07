import { useLoaderData } from "react-router-dom";
import useSelectorHook from "../customHooks/useSelectorHook";
import useDispatchHook from "../customHooks/useDispatchHook";
import Friends from "./Friends";
import { friendsInterface } from "../types";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  fetchFriendsSearch,
  setSearchSYNC,
} from "../Features/ChatsANDContactslice";
import { Input } from "@material-tailwind/react";
import { fetchFriends } from "../Features/ChatsANDContactslice";
import { useState, useEffect } from "react";
import useDebounce from "../customHooks/useDebounce";

function Contacts() {
  const dispatch = useDispatchHook();
  useLoaderData();
  const { ListOfFriends, hasMore, nextPage, search, ListOfSearchedFriends } =
    useSelectorHook(`CHATSANDCONTACT`);
  const [inputTXT, setTXT] = useState<string>("");
  // ⚠️ will dispatch search friends after debounce
  const dispatchSearchFriends = (val: string) => {
    dispatch(fetchFriendsSearch({ search: val }));
    dispatch(setSearchSYNC(val));
  };
  // ⚠️ will debounce search result
  useDebounce(inputTXT, dispatchSearchFriends, 500);
  useEffect(() => {
    console.log(`list of contacts mounted`);
    return () => {
      console.log(`list of contacts unmounted`);
    };
  }, []);
  return (
    <>
      <div className="bg-white">
        <Input
          label="Search Contact"
          onChange={(e) => setTXT(e.target.value)}
        />
      </div>
      {search == "" && (
        <div
          id="scrollableDiv"
          className="scrollbar rounded-md bg-white flex-grow overflow-auto   p-[10px]"
        >
          <InfiniteScroll
            dataLength={ListOfFriends.length}
            next={() => dispatch(fetchFriends(nextPage))}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            endMessage={
              <p style={{ textAlign: "center" }}>
                <b>Yay! You have seen it all</b>
              </p>
            }
            scrollableTarget="scrollableDiv"
          >
            {ListOfFriends.map((ele: friendsInterface) => (
              <Friends key={ele?._id} ele={ele} />
            ))}
          </InfiniteScroll>
        </div>
      )}
      {search != "" && ListOfSearchedFriends.length > 0 && (
        <div
          id="scrollableDiv"
          className="scrollbar rounded-md bg-white flex-grow overflow-auto  flex flex-col   p-[10px]"
        >
          {ListOfSearchedFriends.map((ele: friendsInterface) => (
            <Friends key={ele?._id} ele={ele} />
          ))}
        </div>
      )}
      {search != "" && ListOfSearchedFriends.length == 0 && (
        <div
          id="scrollableDiv"
          className="scrollbar rounded-md bg-white flex-grow overflow-auto flex justify-center items-center  p-[10px]"
        >
          <p>"{search}" NO Result</p>
        </div>
      )}
    </>
  );
}

export default Contacts;
