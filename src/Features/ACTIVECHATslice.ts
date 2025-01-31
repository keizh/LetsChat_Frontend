import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ListOfChats: [],
  ActiveChat: false,
  ActiveChatRoom: "",
  ActiveChatMessages: [],
};

const ACTIVECHATslice = createSlice({
  name: "ACTIVECHATslice",
  initialState,
  reducers: {},
  extraReducers: () => {},
});

export default ACTIVECHATslice.reducer;
export const {} = ACTIVECHATslice.actions;
