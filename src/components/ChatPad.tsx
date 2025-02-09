import InfiniteScroll from "react-infinite-scroll-component";
import useSelectorHook from "../customHooks/useSelectorHook";
import useDispatchHook from "../customHooks/useDispatchHook";
import { fetchChatHistory } from "../Features/ACTIVECHATslice";
import store from "../APP/store";
import TextCOMP from "./TextCOMP";
import AudioCOMP from "./AudioCOMP";
import ImageCOMP from "./ImageCOMP";
import VideoCOM from "./VideoCOM";
import PdfCOMP from "./PdfCOMP";
import { useEffect, useRef } from "react";

function ChatPad() {
  const { ActiveChatMessages } = useSelectorHook("ACTIVECHAT");
  const dispatch = useDispatchHook();
  const scrollHeight = useRef(0);
  const scrollTop = useRef(0);
  const DivHeight = useRef(0);
  const div = useRef<HTMLDivElement | null>(null);

  const fetchFn = () => {
    dispatch(
      fetchChatHistory({
        chatId: store.getState().ACTIVECHAT.ActiveChatId,
        messagesRecieved: store.getState().ACTIVECHAT.messagesRecieved,
        messagesDeleted: store.getState().ACTIVECHAT.messagesDeleted,
        PageNumber: store.getState().ACTIVECHAT.nextPage,
      })
    );
  };

  useEffect(() => {
    const handler = (e: Event) => {
      console.log("fewfew");

      const target = e.srcElement as HTMLElement;

      DivHeight.current = target.offsetHeight;
      scrollHeight.current = target.scrollHeight;
      scrollTop.current = Math.abs(target.scrollTop);

      const dif =
        scrollHeight.current - (DivHeight.current + scrollTop.current);

      if (dif < 250 && store.getState().ACTIVECHAT.hasMore) {
        fetchFn();
      }
    };
    if (div.current) div.current.addEventListener("scroll", handler);

    return () => {
      if (div.current) div.current.addEventListener("scroll", handler);
    };
  }, []);

  return (
    <div
      ref={div}
      className="bg-white"
      style={{
        height: "80vh",
        overflow: "auto",
        display: "flex",
        flexDirection: "column-reverse",
      }}
    >
      <InfiniteScroll
        dataLength={ActiveChatMessages.length}
        next={fetchFn}
        style={{
          display: "flex",
          flexDirection: "column-reverse",
          gap: "15px",
        }}
        inverse={true}
        hasMore={store.getState().ACTIVECHAT.hasMore}
        loader={<h4>Loading...</h4>}
        scrollableTarget="scrollableDiv"
        refreshFunction={fetchFn}
        pullDownToRefresh
        pullDownToRefreshThreshold={50}
        pullDownToRefreshContent={
          <h3 style={{ textAlign: "center" }}>&#8595;</h3>
        }
        releaseToRefreshContent={
          <h3 style={{ textAlign: "center" }}>&#8593;</h3>
        }
      >
        {ActiveChatMessages.map((ele) => {
          switch (ele.type) {
            case "text":
              return <TextCOMP ele={ele} key={ele.mssgId} />;
            case "image":
              return <ImageCOMP ele={ele} key={ele.mssgId} />;
            case "audio":
              return <AudioCOMP ele={ele} key={ele.mssgId} />;
            case "video":
              return <VideoCOM ele={ele} key={ele.mssgId} />;
            case "pdf":
              return <PdfCOMP ele={ele} key={ele.mssgId} />;
            default:
              console.log(`no such comp exists for message`);
          }
        })}
      </InfiniteScroll>
    </div>
  );
}

export default ChatPad;
