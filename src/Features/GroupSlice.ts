import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { friendsInterface } from "../types";

const initialState: {
  openCreateModel: boolean;
  creatingGroupLoadingState: boolean;
  allContacts: friendsInterface[];
  error: null | string;
} = {
  openCreateModel: false,
  creatingGroupLoadingState: false,
  allContacts: [],
  error: null,
};

export const fetchedFriendsToMakeGroup = createAsyncThunk(
  "fetch/contacts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/chat/friends`,
        {
          method: "GET",
          headers: {
            Authorization: `${localStorage.getItem("LetsChat")}`,
          },
        }
      );
      const resData = await res.json();

      if (!res.ok) {
        throw new Error(
          `Failed to fetch friends to make group or update group`
        );
      }
      return resData.data;
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to fetch friends"
      );
    }
  }
);

export const createGROUPchat = createAsyncThunk<
  string,
  FormData,
  { rejectValue: string }
>("POST/createGROUPchat", async (data, { rejectWithValue }) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/chat/createGroup`,
      {
        method: "POST",
        headers: {
          Authorization: `${localStorage.getItem("LetsChat")}`,
        },
        body: data,
      }
    );
    const resData = await res.json();

    if (!res.ok) {
      throw new Error(`Failed to fetch friends to make group or update group`);
    }
    return resData.message;
  } catch (err) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Failed to create group"
    );
  }
});

const GroupSlice = createSlice({
  name: "GroupSlice",
  initialState,
  reducers: {
    updateOpenCreateModel: (state, action) => {
      console.log(`clicked`);
      state.openCreateModel = action.payload;
      console.log(`state.openCreateModel `, state.openCreateModel);
    },
    updateCreatingGroupLoadingState: (state, action) => {
      state.creatingGroupLoadingState = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchedFriendsToMakeGroup.pending, () => {})
      .addCase(fetchedFriendsToMakeGroup.fulfilled, (state, action) => {
        state.allContacts = action.payload;
      })
      .addCase(
        fetchedFriendsToMakeGroup.rejected,
        (
          state,
          action: ReturnType<typeof fetchedFriendsToMakeGroup.rejected> & {
            payload: string;
          }
        ) => {
          state.error = action.payload;
        }
      );

    builder
      .addCase(createGROUPchat.pending, (state) => {
        state.creatingGroupLoadingState = true;
      })
      .addCase(createGROUPchat.fulfilled, (state) => {
        state.creatingGroupLoadingState = false;
      })
      .addCase(
        createGROUPchat.rejected,
        (
          state,
          action: ReturnType<typeof createGROUPchat.rejected> & {
            payload: string;
          }
        ) => {
          state.creatingGroupLoadingState = false;
          state.error = action.payload;
        }
      );
  },
});

export default GroupSlice.reducer;
export const { updateOpenCreateModel, updateCreatingGroupLoadingState } =
  GroupSlice.actions;
