import { categories } from '@/constants';

export const createNewProduct = (product, imageUrl) => {
  const categoryObj = categories.find((cat) => cat.id === product.categoryId);
  return {
    ...product,
    price: Number(product.price),
    creationAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: categoryObj
      ? { id: categoryObj.id, name: categoryObj.name }
      : { id: 'unknown', name: 'Unknown' },
    image: imageUrl,
  };
};

export const initialProductState = {
  title: '',
  price: '',
  description: '',
  categoryId: '',
  image: null,
};
