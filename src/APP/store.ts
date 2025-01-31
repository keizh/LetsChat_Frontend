import { configureStore } from "@reduxjs/toolkit";
import USERslice from "../Features/USERslice";
import ACTIVECHATslice from "../Features/ACTIVECHATslice";

const store = configureStore({
  reducer: {
    USER: USERslice,
    ACTIVECHAT: ACTIVECHATslice,
  },
});

export default store;
