import {
  NewProductDTO,
  PaginatedProductsDTO,
  Product,
} from '@/api/dtos/productDTO';
import { addProductAPI, fetchProducts } from '@/api/product';
import { ProductFilter } from '@/types/productType';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const loadProducts = createAsyncThunk<
  {
    products: Product[];
    hasNextPage: boolean;
    totalCount: number;
    isInitial: boolean;
  },
  { filter: ProductFilter; pageSize: number; page: number; isInitial: boolean },
  { rejectValue: string }
>(
  'products/loadProducts',
  async ({ filter, pageSize, page, isInitial }, { rejectWithValue }) => {
    try {
      const result: PaginatedProductsDTO = await fetchProducts(
        filter,
        pageSize,
        page
      );
      return { ...result, isInitial };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addProduct = createAsyncThunk<
  Product,
  NewProductDTO,
  { rejectValue: string }
>(
  'products/addProduct',
  async (productData: NewProductDTO, { rejectWithValue }) => {
    try {
      const newProduct: Product = await addProductAPI(productData);
      return newProduct;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
