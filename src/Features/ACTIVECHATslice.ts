import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ONE2ONEResponseInterface, mssgInt } from "../types";

const initialState: {
  ListOfChats: [];
  ActiveChat: boolean;
  ActiveChatId: string;
  ActiveChatRoom: string;
  ActiveChatMessages: mssgInt[];
  status: string;
  error: null | string;
  activeChatloading: boolean;
  activeChatEmail: string;
  activeChatName: string;
  activeChatProfileURL: string;
} = {
  ListOfChats: [],
  ActiveChatId: "",
  ActiveChat: false,
  ActiveChatRoom: "",
  ActiveChatMessages: [],
  status: "idle", // "loading" , "successful" , "error" , "idle"
  error: null,
  activeChatloading: false,
  activeChatEmail: "",
  activeChatName: "",
  activeChatProfileURL: "",
};

export const fetchChatHistory = createAsyncThunk<
  { data: ONE2ONEResponseInterface },
  {
    participants: string[];
    userIdOfClient: string;
    userIdOfOppositeUser: string;
  },
  {
    rejectValue: string;
  }
>("fetch/Chat", async (data, { _, rejectWithValue }) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/chat/ONE2ONE`,
      {
        method: "POST",
        headers: {
          Authorization: `${localStorage.getItem("LetsChat")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const resData = await res.json();
    if (!res.ok) {
      throw new Error(`Failed to fetch User chat`);
    }
    return resData;
  } catch (err: unknown) {
    const mssg: string = err instanceof Error ? err.message : "";
    console.error(mssg);
    rejectWithValue(mssg);
  }
});

const ACTIVECHATslice = createSlice({
  name: "ACTIVECHATslice",
  initialState,
  reducers: {
    setActiveChatBox: (state, action) => {
      state.ActiveChat = true;
      state.activeChatEmail = action.payload.email;
      state.activeChatName = action.payload.name;
      state.activeChatProfileURL = action.payload.prof;
    },
    setInActiveChatBox: (state) => {
      state.ActiveChat = false;
      state.ActiveChatRoom = "";
      state.ActiveChatId = "";
      state.ActiveChatMessages = [];
      state.activeChatEmail = "";
      state.activeChatName = "";
      state.activeChatProfileURL = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatHistory.pending, (state) => {
        state.status = "loading";
        state.activeChatloading = true;
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        console.log(action.payload);
        state.status = "successful";
        state.ActiveChatMessages = action.payload.data.messages;
        state.ActiveChatRoom = action.payload.data.roomId;
        state.ActiveChatId = action.payload.data._id;
        state.activeChatloading = false;
      })
      .addCase(
        fetchChatHistory.rejected,
        (
          state,
          action: ReturnType<typeof fetchChatHistory.rejected> & {
            payload: string;
          }
        ) => {
          state.status = "error";
          state.error = action.payload;
          state.activeChatloading = false;
        }
      );
  },
});

export default ACTIVECHATslice.reducer;
export const { setActiveChatBox, setInActiveChatBox } = ACTIVECHATslice.actions;
