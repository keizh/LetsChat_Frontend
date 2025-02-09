import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ONE2ONEResponseInterface, mssgInt } from "../types";
import store from "../APP/store";

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
  // pagination parameter;
  nextPage: number;
  currPage: number;
  hasMore: boolean;
  messagesRecieved: number;
  messagesDeleted: number;
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
  nextPage: 1,
  currPage: 1,
  hasMore: false,
  messagesRecieved: 0,
  messagesDeleted: 0,
};

export const fetchChatHistory = createAsyncThunk<
  {
    data: ONE2ONEResponseInterface;
    messages: mssgInt[];
    hasMore: boolean;
    nextPage: number;
  },
  {
    // for fetching messages for the first time ( below first 4 needed )
    participants?: string[];
    userIdOfClient?: string;
    userIdOfOppositeUser?: string;
    lastAccessMoment?: number;
    // for fetching future messages
    chatId?: string;
    messagesRecieved: number;
    messagesDeleted: number;
    PageNumber: number;
  },
  {
    rejectValue: string;
  }
>("fetch/Chat", async (data, { rejectWithValue }) => {
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

export const deleteMessageASYNC = createAsyncThunk<
  string,
  {
    mssgId: string;
    chatId: string;
  },
  { rejectValue: string }
>("DELETE/file", async (data, { rejectWithValue }) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/chat/DeleteMessage?mssgId=${
        data.mssgId
      }&chatId=${data.chatId}&roomId=${
        store.getState().ACTIVECHAT.ActiveChatRoom
      }`,
      {
        method: "DELETE",
        headers: {
          Authorization: `${localStorage.getItem("LetsChat")}`,
        },
      }
    );
    const resData = await res.json();
    if (!res.ok) {
      throw new Error(`Failed to DELETE files`);
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
        nextPage: 1,
        currPage: 1,
        hasMore: false,
        messagesRecieved: 0,
        messagesDeleted: 0,
      };
    },
    addMessageRecieved: (state, action) => {
      // active.payload is a array of messages
      // in case of normal recieve message it will only have one element~arr[0]
      // console.log(`$$$$$->message added`);
      state.messagesRecieved = state.messagesRecieved + 1;
      state.ActiveChatMessages = [
        ...action.payload.map((ele: mssgInt) => {
          ele.deleteState = true;
          return ele;
        }),
        ...state.ActiveChatMessages,
      ];
      console.log(`message has been added`, state.ActiveChatMessages);
    },
    deleteMessageSYNC: (state, action) => {
      console.log(1);
      state.messagesDeleted = state.messagesDeleted + 1;
      if (state.ActiveChatId == action.payload.chatId) {
        console.log(2);
        state.ActiveChatMessages = state.ActiveChatMessages.filter(
          (ele) => ele.mssgId != action.payload.mssgId
        );
      }
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
        console.log(`line messages fetched`, action.payload);
        state.status = "successful";
        state.ActiveChatMessages = [
          ...state.ActiveChatMessages,
          ...action.payload.messages.map((ele) => {
            ele.deleteState = false;
            return ele;
          }),
        ];
        state.ActiveChatRoom = action.payload.data.roomId;
        state.ActiveChatId = action.payload.data._id;
        state.activeChatloading = false;
        state.hasMore = action.payload.hasMore;
        state.nextPage = action.payload.nextPage;
        state.currPage = action.payload.nextPage - 1;
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

    builder
      .addCase(deleteMessageASYNC.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteMessageASYNC.fulfilled, (state) => {
        state.status = "successful";
      })
      .addCase(
        deleteMessageASYNC.rejected,
        (
          state,
          action: ReturnType<typeof deleteMessageASYNC.rejected> & {
            payload: string;
          }
        ) => {
          state.status = "error";
          state.error = action.payload;
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
  deleteMessageSYNC,
} = ACTIVECHATslice.actions;
