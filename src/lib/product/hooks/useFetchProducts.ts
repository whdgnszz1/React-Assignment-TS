import { PRODUCT_PAGE_SIZE } from '@/constants';
import {
  fetchProducts,
  PaginatedProductsDTO,
  PRODUCT_KEY,
} from '@/lib/product';
import { useFilterStore } from '@/store/filter/useFilterStore';
import { useInfiniteQuery } from '@tanstack/react-query';

interface UseProductsQueryOptions {
  pageSize?: number;
}

export const useFetchProducts = ({
  pageSize = PRODUCT_PAGE_SIZE,
}: UseProductsQueryOptions) => {
  const { minPrice, maxPrice, title, categoryId } = useFilterStore();
  const filter = { minPrice, maxPrice, title, categoryId };

  const queryKey = [PRODUCT_KEY, filter] as const;

  return useInfiniteQuery<PaginatedProductsDTO, Error>({
    queryKey,
    queryFn: ({ pageParam = 1 }) =>
      fetchProducts(filter, pageSize, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
};