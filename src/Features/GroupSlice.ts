import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { friendsInterface } from "../types";
import store from "../APP/store";
import { setGroupName } from "../Features/ACTIVECHATslice";
import { updateGroupName } from "../Features/ChatsANDContactslice";

const initialState: {
  openCreateModel: boolean;
  openEditGroupModel: boolean;
  creatingGroupEditLoadingState: boolean;
  creatingGroupLoadingState: boolean;
  allContacts: friendsInterface[];
  error: null | string;
  groupMembers: string[];
  defaultValuesForSelect: { value: string; label: string }[];
  deleteState: boolean;
} = {
  openCreateModel: false,
  creatingGroupLoadingState: false,
  openEditGroupModel: false,
  creatingGroupEditLoadingState: false,
  allContacts: [],
  error: null,
  groupMembers: [],
  defaultValuesForSelect: [],
  deleteState: false,
};

export const deleteGroup = createAsyncThunk(
  "DELETE/group",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/chat/deleteGroup?chatId=${
          store.getState().ACTIVECHAT.ActiveChatId
        }&roomId=${store.getState().ACTIVECHAT.ActiveChatRoom}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `${localStorage.getItem("LetsChat")}`,
          },
        }
      );
      const resData = await res.json();

      if (!res.ok) {
        throw new Error(`Failed to DELETE GROUP`);
      }
      return resData;
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to DELETE Group"
      );
    }
  }
);

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

export const fetchGroupMembers = createAsyncThunk(
  "fetch/groupMembers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/chat/fetchGroupMembers?chatId=${
          store.getState().ACTIVECHAT.ActiveChatId
        }`,
        {
          method: "GET",
          headers: {
            Authorization: `${localStorage.getItem("LetsChat")}`,
          },
        }
      );
      const resData = await res.json();

      if (!res.ok) {
        throw new Error(`Failed to fetch group members`);
      }
      return resData;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : "");
    }
  }
);

export const updateGroup = createAsyncThunk<
  {
    message: string;
    participants: string[];
  },
  FormData,
  { rejectValue: string }
>("POST/updateGroup", async (data, { dispatch, rejectWithValue }) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/chat/updateGroup`,
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
      throw new Error(`Failed to update group`);
    }
    dispatch(setGroupName(resData.groupName));
    dispatch(updateGroupName(resData));
    return resData;
  } catch (err) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Failed to update"
    );
  }
});

export const GroupSlice = createSlice({
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
    updateCreatingGroupEditLoadingState: (state, action) => {
      state.creatingGroupEditLoadingState = action.payload;
    },
    updateOpenGroupEditState: (state, action) => {
      console.log(action.payload);
      state.openEditGroupModel = action.payload;
    },
    emptydefaultValuesForSelect: (state) => {
      state.defaultValuesForSelect = [];
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

    builder
      .addCase(fetchGroupMembers.pending, () => {})
      .addCase(fetchGroupMembers.fulfilled, (state, action) => {
        state.defaultValuesForSelect = action.payload.defaultValuesForSelect;
        state.groupMembers = action.payload.data;
      })
      .addCase(
        fetchGroupMembers.rejected,
        (
          state,
          action: ReturnType<typeof fetchGroupMembers.rejected> & {
            payload: string;
          }
        ) => {
          state.error = action.payload;
        }
      );

    builder
      .addCase(updateGroup.pending, (state) => {
        state.creatingGroupEditLoadingState = true;
      })
      .addCase(updateGroup.fulfilled, (state) => {
        state.creatingGroupEditLoadingState = false;
        state.openEditGroupModel = false;
      })
      .addCase(
        updateGroup.rejected,
        (
          state,
          action: ReturnType<typeof updateGroup.rejected> & {
            payload: string;
          }
        ) => {
          state.creatingGroupEditLoadingState = false;
          state.error = action.payload;
        }
      );

    builder
      .addCase(deleteGroup.pending, (state) => {
        state.deleteState = true;
      })
      .addCase(deleteGroup.fulfilled, (state) => {
        state.deleteState = false;
        state.openEditGroupModel = false;
      })
      .addCase(
        deleteGroup.rejected,
        (
          state,
          action: ReturnType<typeof deleteGroup.rejected> & {
            payload: string;
          }
        ) => {
          state.deleteState = false;
          state.openEditGroupModel = false;
          state.error = action.payload;
        }
      );
  },
});

export default GroupSlice.reducer;
export const {
  updateOpenCreateModel,
  updateCreatingGroupLoadingState,
  updateCreatingGroupEditLoadingState,
  updateOpenGroupEditState,
  emptydefaultValuesForSelect,
} = GroupSlice.actions;
