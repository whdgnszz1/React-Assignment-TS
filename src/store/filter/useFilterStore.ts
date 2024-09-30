import { ALL_CATEGORY_ID } from '@/constants';
import { create } from 'zustand';

interface FilterState {
  minPrice: number;
  maxPrice: number;
  title: string;
  categoryId: string;
  setMinPrice: (price: number) => void;
  setMaxPrice: (price: number) => void;
  setTitle: (title: string) => void;
  setCategoryId: (categoryId: string) => void;
  resetFilter: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  minPrice: 0,
  maxPrice: 0,
  title: '',
  categoryId: ALL_CATEGORY_ID,

  setMinPrice: (price: number) =>
    set((state) => ({ ...state, minPrice: price })),
  setMaxPrice: (price: number) =>
    set((state) => ({ ...state, maxPrice: price })),
  setTitle: (title: string) => set((state) => ({ ...state, title })),
  setCategoryId: (categoryId: string) =>
    set((state) => ({ ...state, categoryId })),

  resetFilter: () =>
    set(() => ({
      minPrice: 0,
      maxPrice: 0,
      title: '',
      categoryId: ALL_CATEGORY_ID,
    })),
}));
