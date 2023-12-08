import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import addressService from "../../services/address/address.service";
import { AddressState } from "../../@types/address";

export const getAddress = createAsyncThunk(
    "get/getAddress",
    async (params: any) => {
      const { data } = await addressService.get(params);
      return data;
    }
  );
  export const updateAddress = createAsyncThunk(
    "update/updateAddress",
    async (data: any) => {
      // Assuming you have a service function for updating a brand
      const { data: updatedAddress } = await addressService.put(data.id, data);
      return updatedAddress;
    }
  );
  export const deleteAddress = createAsyncThunk(
    "delete/deleteAddress",
    async (id: number) => {

      await addressService.delete(id);
      return id; 
    }
  );
  export const createAddress = createAsyncThunk(
    "create/createAddress",
    async (AddressData: any) => {
      const { data } = await addressService.post(AddressData);
      return data;
    }
  );
  
  export const getByIdAddress = createAsyncThunk(
    "get/getByIDAddress",
    async (id: any) => {
      const { data } = await addressService.getById(id);
      return data;
    }
  );
  const initialState: AddressState = {
    addressList: [],
    addressDetail:{
      id: 0,
      userId:0,
      ward: "",
      district:"",
      houseNumber:"",
      note:"",
      customerId:0,
      phoneNumber:"",
      province:"",
      status:false
    },
    addressCount:0
  };
  const slice = createSlice({
    name: "Address",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(getAddress.fulfilled, (state, action) => {
          state.addressList = action.payload.result;
        });
      builder.addCase(deleteAddress.fulfilled, (state, action) => {
          state.addressList = state.addressList.filter((address) => address.id !== action.payload);
        });  
        builder.addCase(createAddress.fulfilled, (state, action) => {
          state.addressList.push(action.payload);
        }); 
        builder.addCase(getByIdAddress.fulfilled, (state, action) => {
          state.addressDetail = action.payload.result.items;
        });
        builder.addCase(updateAddress.fulfilled, (state, action) => {
          state.addressList = state.addressList.map((address) =>
          address.id === action.payload.id ? action.payload : address
          );
        });
    },
  });
  export default slice.reducer;
  