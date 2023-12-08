import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import customerService from "../../services/customer/customer.service";
import { CustomerState } from "../../@types/customer";


export const getCustomer = createAsyncThunk(
    "get/getCustomer",
    async (params: any) => {
      const { data } = await customerService.get(params);
      return data;
    }
  );
  
  const initialState: CustomerState = {
    customerList: [],
    customerDetail:{
      id: 0,
      fullName: "",
    },
    customerCount:0
  };
  const slice = createSlice({
    name: "Customer",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(getCustomer.fulfilled, (state, action) => {
          state.customerList = action.payload.result.items;
        });
     
    },
  });
  export default slice.reducer;
  