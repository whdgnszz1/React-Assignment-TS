export interface CartItem {
  id: string;
  image: string;
  title: string;
  price: number;
  count: number;
}

export interface Total {
  totalCount: number;
  totalPrice: number;
}
