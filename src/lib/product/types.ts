export interface Product {
  id: string;
  title: string;
  price: number;
  description?: string;
  category: { id: string; name: string };
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedProductsDTO {
  products: Product[];
  hasNextPage: boolean;
  totalCount: number;
  nextPage?: number;
}

export interface NewProductDTO {
  title: string;
  price: number;
  description?: string;
  category: { id: string; name: string };
  image: File | string | null;
}
