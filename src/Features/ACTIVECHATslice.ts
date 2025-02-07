import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ONE2ONEResponseInterface, mssgInt } from "../types";

const initialState: {
  // ListOfChats: [];
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
  fileUploadLoadState: boolean;
  dontJumpToNextChatWithoutLeaveingCurrentChat: boolean;
} = {
  // ListOfChats: [],
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
  fileUploadLoadState: false,
  dontJumpToNextChatWithoutLeaveingCurrentChat: false,
};

export const fetchChatHistory = createAsyncThunk<
  { data: ONE2ONEResponseInterface },
  {
    participants: string[];
    userIdOfClient: string;
    userIdOfOppositeUser: string;
    lastAccessMoment: number;
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
    // console.error(mssg);
    rejectWithValue(mssg);
  }
});

export const postFiles = createAsyncThunk<
  string,
  {
    FILES_FORMDATA: FormData;
  },
  { rejectValue: string }
>("Post/files", async (data, { rejectWithValue }) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/file`, {
      method: "POST",
      headers: {
        Authorization: `${localStorage.getItem("LetsChat")}`,
      },
      body: data.FILES_FORMDATA,
    });
    const resData = await res.json();
    if (!res.ok) {
      throw new Error(`Failed to post files`);
    }
    return resData.message;
  } catch (err: unknown) {
    const mssg: string = err instanceof Error ? err.message : "";
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
      return {
        ...state,
        ActiveChat: false,
        ActiveChatRoom: "",
        ActiveChatId: "",
        ActiveChatMessages: [],
        activeChatEmail: "",
        activeChatName: "",
        activeChatProfileURL: "",
      };
    },
    addMessageRecieved: (state, action) => {
      // active.payload is a array of messages
      // in case of normal recieve message it will only have one element~arr[0]
      // console.log(`$$$$$->message added`);
      state.ActiveChatMessages = [
        ...action.payload,
        ...state.ActiveChatMessages,
      ];
      console.log(`message has been added`, state.ActiveChatMessages);
    },
    setdontJumpToNextChatWithoutLeaveingCurrentChatTRUE: (state) => {
      state.dontJumpToNextChatWithoutLeaveingCurrentChat = true;
    },
    setdontJumpToNextChatWithoutLeaveingCurrentChatFALSE: (state) => {
      state.dontJumpToNextChatWithoutLeaveingCurrentChat = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatHistory.pending, (state) => {
        state.status = "loading";
        state.activeChatloading = true;
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        // console.log(`line 92`, action.payload);
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

    builder
      .addCase(postFiles.pending, (state) => {
        state.status = "loading";
        state.fileUploadLoadState = true;
      })
      .addCase(postFiles.fulfilled, (state) => {
        state.status = "successful";
        state.fileUploadLoadState = false;
      })
      .addCase(
        postFiles.rejected,
        (
          state,
          action: ReturnType<typeof postFiles.rejected> & {
            payload: string;
          }
        ) => {
          state.status = "error";
          state.error = action.payload;
          state.fileUploadLoadState = false;
        }
      );
  },
});

export default ACTIVECHATslice.reducer;
export const {
  setActiveChatBox,
  setInActiveChatBox,
  addMessageRecieved,
  setdontJumpToNextChatWithoutLeaveingCurrentChatTRUE,
  setdontJumpToNextChatWithoutLeaveingCurrentChatFALSE,
} = ACTIVECHATslice.actions;
