import { NewProductDTO, Product } from '@/api/dtos/productDTO';
import { ProductFilter } from '@/types/productType';

export interface ProductStore {
  items: Product[];
  hasNextPage: boolean;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  loadProducts: (params: {
    filter: ProductFilter;
    pageSize: number;
    page: number;
    isInitial: boolean;
  }) => Promise<void>;
  addProduct: (productData: NewProductDTO) => Promise<void>;
}
