import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

import { pageRoutes } from '@/apiRoutes';
import { Button } from '@/components/ui/button';

export const CartButton = ({ cart }) => {
  const navigate = useNavigate();
  const cartItemCount = cart.length;

  const handleClickCart = () => {
    navigate(pageRoutes.cart);
  };

  return (
    <Button variant="ghost" onClick={handleClickCart} className="relative">
      <ShoppingCart className="h-5 w-5" />
      {cartItemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {cartItemCount}
        </span>
      )}
    </Button>
  );
};
