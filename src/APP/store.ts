import { configureStore } from "@reduxjs/toolkit";
import USERslice from "../Features/USERslice";
import ACTIVECHATslice from "../Features/ACTIVECHATslice";
import ChatsANDContactslice from "../Features/ChatsANDContactslice";
import GroupSlice from "../Features/GroupSlice";

const store = configureStore({
  reducer: {
    USER: USERslice,
    ACTIVECHAT: ACTIVECHATslice,
    CHATSANDCONTACT: ChatsANDContactslice,
    GROUP: GroupSlice,
  },
});

export type AppDispatch = typeof store.dispatch;

export default store;
