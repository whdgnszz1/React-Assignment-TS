import {
  NewProductDTO,
  PRODUCT_KEY,
  Product,
  addProductAPI,
} from '@/lib/product';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useAddProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<Product, Error, NewProductDTO>({
    mutationFn: addProductAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCT_KEY] });
    },
  });
};
