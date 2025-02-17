import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  SerializedError,
} from "@reduxjs/toolkit";

export const fetchUserActiveChatsLastAccessTime = createAsyncThunk<
  UserActiveChatsRoomLastAccessTimeOBJ[],
  unknown,
  { rejectValue: string }
>("FETCH/userdoc", async (_, { rejectWithValue }) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/user/LastActive`,
      {
        method: "GET",
        headers: {
          Authorization: `${localStorage.getItem("LetsChat")}`,
          "Content-Type": "application/json",
        },
      }
    );
    const resData = await res.json();
    if (!res.ok) {
      throw new Error(`Failed to fetch User chat`);
    }
    return resData.data;
  } catch (err: unknown) {
    const mssg: string = err instanceof Error ? err.message : "";
    rejectWithValue(mssg);
  }
});

interface UserActiveChatsRoomLastAccessTimeOBJ {
  roomId: string;
  lastAccessMoment: number;
}

const initialState: {
  status: string;
  userId: string;
  userName: string;
  userEmail: string;
  userProfileURL: string;
  lastOnline: number;
  UserActiveChatsRoomLastAccessTime:
    | UserActiveChatsRoomLastAccessTimeOBJ[]
    | [];
  error: string;
  // the below state will be responsible for opening the dialog box responsible for editting profile image
  editUserProfileButton: boolean;
  // the below state will be responsible for LOADING
  edittingUserProfileURL: boolean;
} = {
  status: "idle",
  userId: "",
  userName: "",
  userEmail: "",
  userProfileURL: "",
  lastOnline: 0,
  UserActiveChatsRoomLastAccessTime: [],
  error: "",
  editUserProfileButton: false,
  edittingUserProfileURL: false,
};

export const updateProfileURL = createAsyncThunk<
  string,
  {
    FORMDATA: FormData;
  },
  {
    rejectValue: string;
  }
>("POST/updateProfileURL", async (data, { rejectWithValue }) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/file/updateProfileURL`,
      {
        method: "POST",
        headers: {
          Authorization: `${localStorage.getItem("LetsChat")}`,
        },
        body: data.FORMDATA,
      }
    );
    const resData = await res.json();
    if (!res.ok) {
      throw new Error(`Failed to Update Profile Image`);
    }
    return resData.data;
  } catch (err) {
    const mssg = err instanceof Error ? err.message : "Failed to Upload images";
    rejectWithValue(mssg);
  }
});

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
    setLastAccessToRoom: (state, action) => {
      const roomId = action.payload;
      state.UserActiveChatsRoomLastAccessTime =
        state.UserActiveChatsRoomLastAccessTime.map((ele) => {
          if (ele.roomId == roomId) {
            ele.lastAccessMoment = Date.now();
          }
          return ele;
        });
    },
    setToggleUserProfileButton: (state) => {
      state.editUserProfileButton = state.editUserProfileButton ? false : true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserActiveChatsLastAccessTime.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchUserActiveChatsLastAccessTime.fulfilled,
        (state, action) => {
          state.status = "successfull";
          state.UserActiveChatsRoomLastAccessTime = action.payload;
        }
      )
      .addCase(
        fetchUserActiveChatsLastAccessTime.rejected,
        (
          state,
          action: PayloadAction<
            string | undefined,
            string,
            unknown,
            SerializedError
          >
        ) => {
          state.status = "error";
          state.error = action.payload
            ? action.payload
            : "Error at fetchUserActiveChatsLastAccessTime";
        }
      );

    builder
      .addCase(updateProfileURL.pending, (state) => {
        state.edittingUserProfileURL = true;
      })
      .addCase(updateProfileURL.fulfilled, (state, action) => {
        state.edittingUserProfileURL = false;
        state.userProfileURL = action.payload;
      })
      .addCase(
        updateProfileURL.rejected,
        (
          state,
          action: PayloadAction<
            string | undefined,
            string,
            unknown,
            SerializedError
          >
        ) => {
          state.status = "error";
          state.error = action.payload
            ? action.payload
            : "Error at updateProfileURL";
        }
      );
  },
});

export default USERslice.reducer;
export const {
  setUserDetailSYNC,
  setLastAccessToRoom,
  setToggleUserProfileButton,
} = USERslice.actions;
