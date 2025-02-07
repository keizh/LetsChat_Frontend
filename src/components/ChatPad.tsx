import InfiniteScroll from "react-infinite-scroll-component";

function ChatPad() {
  return (
    <div
      id="scrollableDiv"
      className="bg-white h-full rounded flex flex-col-reverse "
    >
      <InfiniteScroll
        dataLength={this.state.items.length}
        next={this.fetchMoreData}
        style={{ display: "flex", flexDirection: "column-reverse" }} //To put endMessage and loader to the top.
        inverse={true} //
        hasMore={true}
        loader={<h4>Loading...</h4>}
        scrollableTarget="scrollableDiv"
      >
        {this.state.items.map((_, index) => (
          <div style={style} key={index}>
            div - #{index}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
}

export default ChatPad;
