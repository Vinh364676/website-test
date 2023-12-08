import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userService from "../../services/user/user.service";
import { UserState } from "../../@types/user";


export const getUser = createAsyncThunk(
    "get/getUser",
    async (params: any) => {
      const { data } = await userService.get(params);
      return data;
    }
  );
  
  const initialState: UserState = {
    userList: [],
  };
  const slice = createSlice({
    name: "User",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(getUser.fulfilled, (state, action) => {
          state.userList = action.payload.result;
        });
     
    },
  });
  export default slice.reducer;
  