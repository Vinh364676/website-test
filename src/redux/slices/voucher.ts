import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import reviewService from "../../services/review/review.service";
import { ReviewState } from "../../@types/review";
import voucherService from "../../services/voucher/voucher.service";
import { VoucherState } from "../../@types/voucher";

export const getVoucher = createAsyncThunk(
    "get/getVoucher",
    async (params: any) => {
      const { data } = await voucherService.get(params);
      return data;
    }
  );
 
  export const createVoucher = createAsyncThunk(
    "create/createVoucher",
    async (VoucherData: any) => {
      const { data } = await voucherService.post(VoucherData);
      return data;
    }
  );
  
  
  const initialState: VoucherState = {
    voucherList: [],
    
  };
  const slice = createSlice({
    name: "Voucher",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(getVoucher.fulfilled, (state, action) => {
          state.voucherList = action.payload.result;
        });
     
        builder.addCase(createVoucher.fulfilled, (state, action) => {
          state.voucherList.push(action.payload);
        }); 
      
    },
  });
  export default slice.reducer;
  