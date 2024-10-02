import { CartItem } from '@/store/cart/types';
import { useMutation } from '@tanstack/react-query';
import { PurchaseDTO, makePurchaseAPI } from '..';

interface MakePurchaseVariables {
  purchaseData: PurchaseDTO;
  userId: string;
  cartData: CartItem[];
}

export const useMakePurchase = () => {
  return useMutation<void, Error, MakePurchaseVariables>({
    mutationFn: ({ purchaseData, userId, cartData }) =>
      makePurchaseAPI(purchaseData, userId, cartData),
  });
};
