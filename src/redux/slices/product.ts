import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ProductState } from '../../@types/product';
import productService from '../../services/product/product.service';

// ----------------------------------------------------------------------
export const getProduct = createAsyncThunk(
  "get/getProduct",
  async (params: any) => {
    const { data } = await productService.get(params);
    return data;
  }
);

export const getProductPage = createAsyncThunk(
  "get/getProductPage",
  async (params: any) => {
    const { data } = await productService.get(params);
    return data;
  }
);

export const deleteProduct = createAsyncThunk(
  "delete/deleteProduct",
  async (id: number) => {
    await productService.delete(id);
    return id;
  }
);
export const createProduct = createAsyncThunk(
  "create/createProduct",
  async (productData: any) => {
    const { data } = await productService.post(productData);
    return data;
  }
);

export const getOneProduct = createAsyncThunk(
  "get/getOneEvent",
  async (id: any) => {
    const { data } = await productService.getOne(id);
    return data;
  }
);
const initialState: ProductState = {
  productCount: 0,
  productList: [],
  productDetail: {
    productId: 0,
    productName: '',
    price: 0,
    quantity: 0,
    brandId: 0,
    accessoryId: 0,
    categoryId: 0,
    img: '',
    thumnail:'',
    size:'',
    color:'',
    description:'',
    gender:'',
    code:'',
    status:'',
    createdDT:''
  },

}
const slice = createSlice({
  name: 'Product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProduct.fulfilled, (state, action) => {
      state.productList = action.payload.result;
      state.productCount = action.payload.total;
    });
    builder.addCase(getOneProduct.fulfilled, (state, action) => {
      state.productDetail = action.payload.result;
    });
    builder.addCase(createProduct.fulfilled, (state, action) => {
      state.productList.push(action.payload);
    }); 
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.productList = state.productList.filter((product) => product.productId !== action.payload);
    }); 

  },
});
export default slice.reducer;
