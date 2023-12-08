import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import brandService from "../../services/brand/brand.service";
import { BrandState } from "../../@types/brand";

export const getBrand = createAsyncThunk(
    "get/getBrand",
    async (params: any) => {
      const { data } = await brandService.get(params);
      return data;
    }
  );
  export const updateBrand = createAsyncThunk(
    "update/updateBrand",
    async (data: any) => {
      // Assuming you have a service function for updating a brand
      const { data: updatedBrand } = await brandService.put(data.id, data);
      return updatedBrand;
    }
  );
  export const deleteBrand = createAsyncThunk(
    "delete/deleteBrand",
    async (id: number) => {

      await brandService.delete(id);
      return id; 
    }
  );
  export const createBrand = createAsyncThunk(
    "create/createBrand",
    async (brandData: any) => {
      const { data } = await brandService.post(brandData);
      return data;
    }
  );
  
  export const getByIdBrand = createAsyncThunk(
    "get/getByIDBrand",
    async (id: any) => {
      const { data } = await brandService.getById(id);
      return data;
    }
  );
  const initialState: BrandState = {
    brandList: [],
    brandDetail:{
      idBrand: 0,
      name: "",
      createdDT:""
    },
    brandCount:0
  };
  const slice = createSlice({
    name: "Brand",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(getBrand.fulfilled, (state, action) => {
          state.brandList = action.payload.result;
        });
      builder.addCase(deleteBrand.fulfilled, (state, action) => {
          state.brandList = state.brandList.filter((brand) => brand.idBrand !== action.payload);
        });  
        builder.addCase(createBrand.fulfilled, (state, action) => {
          state.brandList.push(action.payload);
        }); 
        builder.addCase(getByIdBrand.fulfilled, (state, action) => {
          state.brandDetail = action.payload.result.items;
        });
        builder.addCase(updateBrand.fulfilled, (state, action) => {
          state.brandList = state.brandList.map((brand) =>
            brand.idBrand === action.payload.id ? action.payload : brand
          );
        });
    },
  });
  export default slice.reducer;
  