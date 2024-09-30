import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useMemo } from 'react';

import { useAuthStore } from '@/store/auth/useAuthStore';
import { useCartStore } from '@/store/cart/useCartStore';

import { ProductInfoTableRow } from '@/pages/cart/components/ProductInfoTableRow';

export const ProductInfoTable = () => {
  const { user } = useAuthStore();
  const { cart } = useCartStore();
  const cartItems = useMemo(() => Object.values(cart), [cart]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">이미지</TableHead>
          <TableHead>상품명</TableHead>
          <TableHead>갯수</TableHead>
          <TableHead>가격</TableHead>
          <TableHead>삭제하기</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <ProductInfoTableRow key={item.id} item={item} user={user} />
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              장바구니가 비어 있습니다.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
