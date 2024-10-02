import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/store/auth/useAuthStore';
import { calculateTotal } from '@/store/cart/cartUtils';
import { useCartStore } from '@/store/cart/useCartStore';

import { useMakePurchase } from '@/lib/purchase/hooks/useMakePurchase';

import { pageRoutes } from '@/apiRoutes';
import { PHONE_PATTERN } from '@/constants';
import { Layout, authStatusType } from '@/pages/common/components/Layout';
import { ItemList } from '@/pages/purchase/components/ItemList';
import { Payment } from '@/pages/purchase/components/Payment';
import { ShippingInformationForm } from '@/pages/purchase/components/ShippingInformationForm';

export interface FormData {
  name: string;
  address: string;
  phone: string;
  requests: string;
  payment: string;
}

export interface FormErrors {
  phone: string;
}

export const Purchase: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const cart = useCartStore((state) => state.cart);
  const resetCart = useCartStore((state) => state.resetCart);
  const initCart = useCartStore((state) => state.initCart);

  const [formData, setFormData] = useState<FormData>({
    name: user?.displayName ?? '',
    address: '',
    phone: '',
    requests: '',
    payment: 'accountTransfer',
  });

  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  useEffect(() => {
    if (user?.uid) {
      initCart(user.uid);
    }
  }, [user, initCart]);

  useEffect(() => {
    const { address, phone } = formData;
    const isPhoneValid = PHONE_PATTERN.test(phone);
    setIsFormValid(address.trim() !== '' && isPhoneValid);
  }, [formData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const { mutate: makePurchaseMutation, isPending: isLoading } =
    useMakePurchase();

  const handleClickPurchase = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid || !user) return;

    const cartItems = Object.values(cart);

    const total = calculateTotal(cart);
    const totalAmount = total.totalPrice;

    const purchaseData = {
      ...formData,
      totalAmount,
      paymentMethod: formData.payment,
      shippingAddress: formData.address,
      items: cartItems,
    };

    makePurchaseMutation(
      {
        purchaseData,
        userId: user.uid,
        cartData: cartItems,
      },
      {
        onSuccess: () => {
          resetCart(user.uid);
          console.log('구매 성공!');
          navigate(pageRoutes.main);
        },
        onError: (error: Error) => {
          console.error(
            '잠시 문제가 발생했습니다! 다시 시도해 주세요.',
            error.message
          );
        },
      }
    );
  };

  return (
    <Layout
      containerClassName="pt-[30px]"
      authStatus={authStatusType.NEED_LOGIN}
    >
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <form onSubmit={handleClickPurchase}>
            <ShippingInformationForm
              formData={formData}
              onChange={handleInputChange}
            />
            <ItemList />
            <Payment
              paymentMethod={formData.payment}
              onPaymentMethodChange={handleInputChange}
            />
            <div className="flex justify-end mt-6">
              <Button
                type="submit"
                size="lg"
                disabled={isLoading || !isFormValid}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    처리 중...
                  </>
                ) : (
                  '구매하기'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Layout>
  );
};
