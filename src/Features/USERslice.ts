import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchUserActiveChatsLastAccessTime = createAsyncThunk(
  "FETCH/userdoc",
  async (_, { rejectWithValue }) => {
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
  }
);

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
} = {
  status: "idle",
  userId: "",
  userName: "",
  userEmail: "",
  userProfileURL: "",
  lastOnline: 0,
  UserActiveChatsRoomLastAccessTime: [],
  error: "",
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
          action: ReturnType<
            typeof fetchUserActiveChatsLastAccessTime.rejected
          > & {
            payload: string;
          }
        ) => {
          state.status = "error";
          state.error = action.payload;
        }
      );
  },
});

export default USERslice.reducer;
export const { setUserDetailSYNC, setLastAccessToRoom } = USERslice.actions;
