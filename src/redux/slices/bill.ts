import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import billService from "../../services/bill/bill.service";
import { BillState } from "../../@types/bill";


  export const createBill = createAsyncThunk(
    "create/createReceipt",
    async (BillData: any) => {
      const { data } = await billService.post(BillData);
      return data;
    }
  );
  export const createBillVNpay = createAsyncThunk(
    "create/createReceiptVNpay",
    async (BillVNpayData: any) => {
      const { data } = await billService.postVNpay(BillVNpayData);
      return data;
    }
  );
  
  export const getPayment = createAsyncThunk(
    "get/getReview",
    async (params: any) => {
      const { data } = await billService.getPayment(params);
      return data;
    }
  );
 
  const initialState: BillState = {
    billList: [],
    billDetail: {  // Đảm bảo receiptDetail không phải là null
      id: 0,
      totalPrice: 0,
      deliverAddress: "",
      voucherId:0,
      orderStatus: "",
      note: "",
      details: [],
    },
    billCount: 0,
  };
  const slice = createSlice({
    name: "Receipt",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(createBill.fulfilled, (state, action) => {
          state.billList.push(action.payload);
        }); 
        builder.addCase(getPayment.fulfilled, (state, action) => {
          state.billList = action.payload;
        });
    },
  });
  export default slice.reducer;
  