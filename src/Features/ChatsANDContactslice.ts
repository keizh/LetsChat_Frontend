import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  contactsAPIOutputInterface,
  friendsInterface,
  ActiveChatInterface,
} from "../types";
import store from "../APP/store";

interface initialStateInterface {
  ListOfFriends: friendsInterface[] | [];
  ListOfSearchedFriends: friendsInterface[] | [];
  curPage: number;
  nextPage: number;
  hasMore: boolean;
  totalPages: number;
  totalDocuments: number;
  status: string; // loading , successfull , error
  error: string;
  whichTask: string;
  search: string;
  ListOfActiveChats: ActiveChatInterface[] | [];
  fetchActiveChatsRetry: number;
}

const initialState: initialStateInterface = {
  status: "idle", // loading , successfull , error
  error: "",
  whichTask: "",
  search: "",
  fetchActiveChatsRetry: 0,

  // Contact related stuff
  ListOfFriends: [],
  ListOfSearchedFriends: [],
  curPage: 1,
  nextPage: 1,
  hasMore: true,
  totalPages: 1,
  totalDocuments: 1,

  // Active Chat relates stuff
  ListOfActiveChats: [],
};

export const fetchFriends = createAsyncThunk<
  contactsAPIOutputInterface,
  number,
  {
    rejectValue: string;
  }
>("FETCH/friends", async (page, { rejectWithValue }) => {
  // console.log(`line 20`);
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/chat/contacts?page=${page}`,
      {
        method: "GET",
        headers: {
          Authorization: `${localStorage.getItem(`LetsChat`)}`,
        },
      }
    );
    // console.log(`line 31`);
    const resData = await res.json();
    if (!res.ok) {
      // console.log(`line 34`);
      throw new Error(`Failed to Fetch Contacts`);
    }
    return resData;
  } catch (err) {
    // console.log(`line 39`);
    return rejectWithValue(err instanceof Error ? err.message : "");
  }
});

export const fetchFriendsSearch = createAsyncThunk<
  contactsAPIOutputInterface,
  { search: string },
  {
    rejectValue: string;
  }
>(
  "FETCH/seachedfriends",
  async (data: { search: string }, { rejectWithValue }) => {
    const search: string = data?.search ?? "";
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/chat/contacts/search?search=${search}`,
        {
          method: "GET",
          headers: {
            Authorization: `${localStorage.getItem(`LetsChat`)}`,
          },
        }
      );
      const resData = await res.json();
      if (!res.ok) {
        throw new Error(`Failed to Fetch Search Contacts`);
      }
      return resData;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : "");
    }
  }
);

export const fetchActiveChats = createAsyncThunk<
  ActiveChatInterface[],
  {},
  {
    rejectValue: string;
  }
>("FETCH/ActiveChats", async (_, { rejectWithValue }) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/chat/activeChats`,
      {
        method: "GET",
        headers: {
          Authorization: `${localStorage.getItem(`LetsChat`)}`,
        },
      }
    );
    const resData = await res.json();
    if (!res.ok) {
      throw new Error(resData.message);
    }
    return resData.data;
  } catch (err) {
    const mssg =
      err instanceof Error ? err.message : "Failed To fetch Active Chats";
    return rejectWithValue(mssg);
  }
});

const ChatsANDContactslice = createSlice({
  name: "ChatsANDContactslice",
  initialState,
  reducers: {
    setSearchSYNC: (state, action) => {
      state.search = action.payload;
    },
    addNewActiveChat: (state, action) => {
      state.ListOfActiveChats = [action.payload, ...state.ListOfActiveChats];
    },
    updateActiveChatsArraay: (state, action) => {
      const { roomId, lastUpdated, lastMessageSender, lastMessageTime } =
        action.payload;

      state.ListOfActiveChats = state.ListOfActiveChats.map((ele) =>
        ele.roomId === roomId
          ? {
              ...ele,
              lastUpdated,
              lastMessageSender,
              lastMessageTime,
            }
          : ele
      );
      state.ListOfActiveChats.sort(
        (a, b) => b.lastMessageTime - a.lastMessageTime
      );
    },
    // whenever you exit a chat update
    // whenever you enter a chat
    update_USER_LAST_ACCESS_TIME_ListOfFriends: (state, action) => {
      const { roomId, USER_LAST_ACCESS_TIME } = action.payload;
      state.ListOfActiveChats = state.ListOfActiveChats.map((ele) => {
        if (ele.roomId == roomId) {
          return {
            ...ele,
            USER_LAST_ACCESS_TIME,
          };
        }

        return ele;
      });
      // console.log(
      //   `AFTER update_USER_LAST_ACCESS_TIME_ListOfFriends ==>`,
      //   state.ListOfActiveChats
      // );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFriends.pending, (state) => {
        state.status = "loading";
        state.whichTask = "fetchFriends";
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.status = "successfull";
        state.curPage = action.payload.curPage;
        state.nextPage = action.payload.nextPage;
        state.hasMore = action.payload.hasMore;
        state.totalPages = action.payload.totalPages;
        state.totalDocuments = action.payload.totalDocuments;
        if (state.curPage == 1) {
          state.ListOfFriends = [...action.payload.data];
        } else {
          state.ListOfFriends = [
            ...state.ListOfFriends,
            ...action.payload.data,
          ].slice(0, state.totalDocuments);
        }
      })
      .addCase(
        fetchFriends.rejected,
        (
          state,
          action: ReturnType<typeof fetchFriends.rejected> & { payload: string }
        ) => {
          state.status = "rejected";
          state.error = action?.payload || "";
        }
      );

    builder
      .addCase(fetchFriendsSearch.pending, (state) => {
        state.status = "loading";
        state.whichTask = "fetchFriendsSearch";
      })
      .addCase(fetchFriendsSearch.fulfilled, (state, action) => {
        state.status = "successfull";
        state.ListOfSearchedFriends = action.payload.data;
      })
      .addCase(
        fetchFriendsSearch.rejected,
        (
          state,
          action: ReturnType<typeof fetchFriendsSearch.rejected> & {
            payload: string;
          }
        ) => {
          state.status = "rejected";
          state.error = action?.payload || "";
        }
      );

    builder
      .addCase(fetchActiveChats.pending, (state) => {
        state.status = "loading";
        state.whichTask = "fetchActiveChats";
      })
      .addCase(fetchActiveChats.fulfilled, (state, action) => {
        state.status = "successfull";
        state.ListOfActiveChats = action.payload;
      })
      .addCase(
        fetchActiveChats.rejected,
        (
          state,
          action: ReturnType<typeof fetchActiveChats.rejected> & {
            payload: string;
          }
        ) => {
          state.status = "rejected";
          state.error = action?.payload || "";
          if (state.fetchActiveChatsRetry < 3) {
            store.dispatch(fetchActiveChats({}));
          }
        }
      );
  },
});

export default ChatsANDContactslice.reducer;
export const {
  setSearchSYNC,
  addNewActiveChat,
  updateActiveChatsArraay,
  update_USER_LAST_ACCESS_TIME_ListOfFriends,
} = ChatsANDContactslice.actions;
