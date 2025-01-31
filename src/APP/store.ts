import { configureStore } from "@reduxjs/toolkit";
import USERslice from "../Features/USERslice";
import ACTIVECHATslice from "../Features/ACTIVECHATslice";
import ChatsANDContactslice from "../Features/ChatsANDContactslice";

const store = configureStore({
  reducer: {
    USER: USERslice,
    ACTIVECHAT: ACTIVECHATslice,
    CHATSANDCONTACT: ChatsANDContactslice,
  },
});

export default store;
