import { createSlice } from '@reduxjs/toolkit';
import { loadProducts, addProduct } from './productsActions';

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    hasNextPage: true,
    isLoading: false,
    error: null,
    totalCount: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        const { products, hasNextPage, totalCount, isInitial } = action.payload;
        state.items = isInitial ? products : [...state.items, ...products];
        state.hasNextPage = hasNextPage;
        state.totalCount = totalCount;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.totalCount += 1;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default productsSlice.reducer;
