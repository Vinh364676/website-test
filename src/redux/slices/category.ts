import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import categoryService from "../../services/category/category.service";
import { CategoryState } from "../../@types/category";

export const getCategory = createAsyncThunk(
    "get/getCategory",
    async (params: any) => {
      const { data } = await categoryService.get(params);
      return data;
    }
  );
  
  export const deleteCategory = createAsyncThunk(
    "delete/deleteCategory",
    async (id: number) => {

      await categoryService.delete(id);
      return id; 
    }
  );
  export const createCategory = createAsyncThunk(
    "create/createCategory",
    async (categoryDate: any) => {
      const { data } = await categoryService.post(categoryDate);
      return data;
    }
  );
  export const updateCategory = createAsyncThunk(
    "update/upateCategory",
    async (data: any) => {
      // Assuming you have a service function for updating a brand
      const { data: updatedBrand } = await categoryService.put(data.id, data);
      return updatedBrand;
    }
  );
  export const getByIdCategory = createAsyncThunk(
    "get/getByIDCategory",
    async (id: any) => {
      const { data } = await categoryService.getById(id);
      return data;
    }
  );
  const initialState: CategoryState = {
    categoryList: [],
    categoryDetail:{
      id: 0,
      name: "",
      createdDT:""
    },
    categoryCount:0
  };
  const slice = createSlice({
    name: "Category",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(getCategory.fulfilled, (state, action) => {
          state.categoryList = action.payload.result;
        });
      builder.addCase(deleteCategory.fulfilled, (state, action) => {
          state.categoryList = state.categoryList.filter((category) => category.id !== action.payload);
        });  
        builder.addCase(createCategory.fulfilled, (state, action) => {
          state.categoryList.push(action.payload);
        }); 
        builder.addCase(getByIdCategory.fulfilled, (state, action) => {
          state.categoryDetail = action.payload.result.items;
        });
        builder.addCase(updateCategory.fulfilled, (state, action) => {
          state.categoryList = state.categoryList.map((category) =>
          category.id === action.payload.id ? action.payload : category
          );
        });
    },
  });
  export default slice.reducer;
  