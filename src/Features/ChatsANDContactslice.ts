import { createSlice, createAsyncThunk, Action } from "@reduxjs/toolkit";
import { act } from "react";

const initialState = {
  ListOfFriends: [],
  ListOfSearchedFriends: [],
  curPage: 1,
  nextPage: 1,
  hasMore: true,
  totalPages: 1,
  totalDocuments: 1,
  status: "idle", // loading , successfull , error
  error: "",
  whichTask: "",
};

export const fetchFriends = createAsyncThunk(
  "FETCH/friends",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/chat/contacts`,
        {
          method: "GET",
          headers: {
            Authorization: `${localStorage.getItem(`LetsChat`)}`,
          },
        }
      );
      const resData = await res.json();
      if (!res.ok) {
        throw new Error(`Failed to Fetch Contacts`);
      }
      return resData;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : "");
    }
  }
);

export const fetchFriendsSearch = createAsyncThunk(
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

const ChatsANDContactslice = createSlice({
  name: "ChatsANDContactslice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFriends.pending, (state) => {
        state.status = "loading";
        state.whichTask = "fetchFriends";
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.status = "successfull";
        state.ListOfFriends = action.payload.data;
        state.curPage = action.payload.curPage;
        state.nextPage = action.payload.nextPage;
        state.hasMore = action.payload.hasMore;
        state.totalPages = action.payload.totalPages;
        state.totalDocuments = action.payload.totalDocuments;
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
        state.ListOfSearchedFriends = action.payload;
      })
      .addCase(
        fetchFriendsSearch.rejected,
        (
          state,
          action: ReturnType<typeof fetchFriends.rejected> & { payload: string }
        ) => {
          state.status = "rejected";
          state.error = action?.payload || "";
        }
      );
  },
});

export default ChatsANDContactslice.reducer;
export const {} = ChatsANDContactslice.actions;
