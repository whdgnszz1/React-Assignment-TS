import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { CreditCard } from 'lucide-react';

import { formatPrice } from '@/utils/formatter';
import { Controller, useFormContext } from 'react-hook-form';

import { useCartStore } from '@/store/cart/useCartStore';

export const Payment: React.FC = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const { totalPrice } = useCartStore();
  const shippingCost = 3000;

  const getTotalPrice = () => {
    return formatPrice(totalPrice + shippingCost);
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="mr-2 h-6 w-6" />
          결제정보
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-bold">총상품가격</TableCell>
              <TableCell>{formatPrice(totalPrice)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-bold">배송비</TableCell>
              <TableCell>{formatPrice(shippingCost)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-bold">총결제금액</TableCell>
              <TableCell>{getTotalPrice()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-bold">결제 방법</TableCell>
              <TableCell>
                <Controller
                  name="payment"
                  control={control}
                  rules={{ required: '결제 방법을 선택하세요' }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="결제 방법을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="accountTransfer">
                          계좌 이체
                        </SelectItem>
                        <SelectItem value="creditCard">신용 카드</SelectItem>
                        <SelectItem value="kakaoPay">카카오페이</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
