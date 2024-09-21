import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ProductInfoTableRow } from '@/pages/cart/components/ProductInfoTableRow';
import { selectUser } from '@/store/auth/authSelectors';
import { selectCart } from '@/store/cart/cartSelectors';
import { changeCartItemCount, removeCartItem } from '@/store/cart/cartSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import React from 'react';

export const ProductInfoTable = () => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector(selectCart);
  const user = useAppSelector(selectUser);

  const handleRemoveCartItem = (itemId) => {
    dispatch(removeCartItem({ itemId, userId: user.id }));
  };

  const handleChangeCartItemCount = (itemId, count) => {
    dispatch(changeCartItemCount({ itemId, count, userId: user.id }));
  };

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
        {cart.map((item) => (
          <ProductInfoTableRow
            key={item.id}
            item={item}
            user={user}
            removeCartItem={handleRemoveCartItem}
            changeCartItemCount={handleChangeCartItemCount}
          />
        ))}
      </TableBody>
    </Table>
  );
};
