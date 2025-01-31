import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: "",
  userName: "",
  userEmail: "",
  userProfileURL: "",
  lastOnline: 0,
};

const USERslice = createSlice({
  name: "USERslice",
  initialState,
  reducers: {
    setUserDetailSYNC: (state, action) => {
      state.userId = action.payload.id;
      state.userName = action.payload.name;
      state.userEmail = action.payload.email;
      state.userProfileURL = action.payload.profileURL;
      state.lastOnline = action.payload.lastOnline;
    },
  },
  extraReducers: () => {},
});

export default USERslice.reducer;
export const { setUserDetailSYNC } = USERslice.actions;
