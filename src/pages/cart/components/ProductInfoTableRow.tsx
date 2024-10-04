import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TableCell, TableRow } from '@/components/ui/table';
import { Trash2 } from 'lucide-react';

import { useCartStore } from '@/store/cart/useCartStore';

import { MAX_CART_VALUE } from '@/constants';
import { UserDTO } from '@/lib/auth';
import { cartValidationMessages } from '@/messages';
import { CartItem } from '@/store/cart/types';
import { formatPrice } from '@/utils/formatter';

interface ProductInfoTableRowProps {
  item: CartItem;
  user: UserDTO | null;
}

export const ProductInfoTableRow = ({
  item,
  user,
}: ProductInfoTableRowProps) => {
  const { id, title, count, image, price } = item;

  const removeCartItem = useCartStore((state) => state.removeCartItem);
  const changeCartItemCount = useCartStore(
    (state) => state.changeCartItemCount
  );

  const handleClickDeleteItem = () => {
    if (user) {
      removeCartItem(id, user.uid);
    }
  };

  const handleChangeCount = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newCount = Number(e.target.value);

    if (newCount > MAX_CART_VALUE) {
      alert(cartValidationMessages.MAX_INPUT_VALUE);
      return;
    }

    if (user) {
      changeCartItemCount({ itemId: id, count: newCount, userId: user.uid });
    }
  };

  return (
    <TableRow>
      <TableCell className="text-center">
        <img src={image} height="80" alt={title} />
      </TableCell>
      <TableCell>{title}</TableCell>
      <TableCell>
        <Input
          type="number"
          onChange={handleChangeCount}
          value={count}
          className="w-20"
          min={1}
          max={MAX_CART_VALUE}
        />
      </TableCell>
      <TableCell>{formatPrice(price * count)}</TableCell>
      <TableCell>
        <Button variant="ghost" size="icon" onClick={handleClickDeleteItem}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};
