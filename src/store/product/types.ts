import { Product } from '@/lib/product';

export interface ProductStore {
  items: Product[];
  hasNextPage: boolean;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
}

export interface ProductSliceState {
  items: Product[];
  hasNextPage: boolean;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
}

export interface ProductFilter {
  categoryId: string;
  title?: string;
  minPrice?: number;
  maxPrice?: number;
}
