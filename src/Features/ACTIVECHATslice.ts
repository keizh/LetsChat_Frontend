import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ActiveChat: false,
};

const ACTIVECHATslice = createSlice({
  name: "ACTIVECHATslice",
  initialState,
  reducers: {},
  extraReducers: () => {},
});

export default ACTIVECHATslice.reducer;
export const {} = ACTIVECHATslice.actions;
