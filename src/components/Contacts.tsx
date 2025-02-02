import { useLoaderData } from "react-router-dom";
import useSelectorHook from "../customHooks/useSelectorHook";
import useDispatchHook from "../customHooks/useDispatchHook";
import Friends from "./Friends";
import { friendsInterface } from "../types";
import InfiniteScroll from "react-infinite-scroll-component";

import { fetchFriends } from "../Features/ChatsANDContactslice";

// function Contacts() {
//   useLoaderData();
//   const { ListOfFriends } = useSelectorHook(`CHATSANDCONTACT`);
//   return (
//     <div className="scrollbar rounded-md bg-white flex-grow overflow-auto flex  flex-col gap-2 p-[10px]">
//       {ListOfFriends.map((ele: friendsInterface) => (
//         <Friends key={ele?._id} ele={ele} />
//       ))}
//     </div>

//   );
// }

function Contacts() {
  const dispatch = useDispatchHook();
  useLoaderData();
  const { ListOfFriends, hasMore, nextPage } =
    useSelectorHook(`CHATSANDCONTACT`);

  return (
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
  );
}

export default Contacts;
