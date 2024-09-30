import {
  NewProductDTO,
  PaginatedProductsDTO,
  Product,
} from '@/api/dtos/productDTO';
import { addProductAPI, fetchProducts } from '@/api/product';
import { create } from 'zustand';
import { ProductStore } from './types';

export const useProductStore = create<ProductStore>((set, get) => ({
  items: [],
  hasNextPage: true,
  isLoading: false,
  error: null,
  totalCount: 0,

  loadProducts: async ({ filter, pageSize, page, isInitial }) => {
    set({ isLoading: true, error: null });

    try {
      const result: PaginatedProductsDTO = await fetchProducts(
        filter,
        pageSize,
        page
      );
      const { products, hasNextPage, totalCount } = result;

      set((state) => ({
        items: isInitial ? products : [...state.items, ...products],
        hasNextPage,
        totalCount,
        isLoading: false,
        error: null,
      }));
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to load products',
      });
    }
  },

  addProduct: async (productData: NewProductDTO) => {
    set({ isLoading: true, error: null });

    try {
      const newProduct: Product = await addProductAPI(productData);

      set((state) => ({
        items: [newProduct, ...state.items],
        totalCount: state.totalCount + 1,
        isLoading: false,
        error: null,
      }));
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || '상품 등록에 실패하였습니다.',
      });
    }
  },
}));
