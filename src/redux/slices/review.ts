import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import reviewService from "../../services/review/review.service";
import { ReviewState } from "../../@types/review";

export const getReview = createAsyncThunk(
    "get/getReview",
    async (params: any) => {
      const { data } = await reviewService.get(params);
      return data;
    }
  );
 
  export const createReview = createAsyncThunk(
    "create/createReview",
    async (ReviewData: any) => {
      const { data } = await reviewService.post(ReviewData);
      return data;
    }
  );
  
  
  const initialState: ReviewState = {
    reviewList: [],
    reviewDetail:{
        id: 0,
        productId: 0,
        rating:"",
        comment:"",
        createdDt:"",
        userId:0
    },
    reviewCount:0
  };
  const slice = createSlice({
    name: "Review",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(getReview.fulfilled, (state, action) => {
          state.reviewList = action.payload.result;
        });
     
        builder.addCase(createReview.fulfilled, (state, action) => {
          state.reviewList.push(action.payload);
        }); 
      
    },
  });
  export default slice.reducer;
  