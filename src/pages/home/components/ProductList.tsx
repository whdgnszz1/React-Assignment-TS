import { Button } from '@/components/ui/button';
import { FirebaseIndexErrorModal } from '@/pages/error/components/FirebaseIndexErrorModal';
import { ChevronDown, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/store/auth/useAuthStore';
import { useCartStore } from '@/store/cart/useCartStore';
import { useFilterStore } from '@/store/filter/useFilterStore';
import { useProductStore } from '@/store/product/useProductStore';

import { Product } from '@/api/dtos/productDTO';
import { pageRoutes } from '@/apiRoutes';
import { PRODUCT_PAGE_SIZE } from '@/constants';
import { extractIndexLink, isFirebaseIndexError } from '@/helpers/error';
import { useModal } from '@/hooks/useModal';
import { CartItem } from '@/types/cartType';
import { ProductCardSkeleton } from '../skeletons/ProductCardSkeleton';
import { EmptyProduct } from './EmptyProduct';
import { ProductCard } from './ProductCard';
import { ProductRegistrationModal } from './ProductRegistrationModal';

interface ProductListProps {
  pageSize?: number;
}

export const ProductList: React.FC<ProductListProps> = ({
  pageSize = PRODUCT_PAGE_SIZE,
}) => {
  const navigate = useNavigate();
  const { isOpen, openModal, closeModal } = useModal();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isIndexErrorModalOpen, setIsIndexErrorModalOpen] =
    useState<boolean>(false);
  const [indexLink, setIndexLink] = useState<string | null>(null);

  const { minPrice, maxPrice, title, categoryId } = useFilterStore();
  const { isLogin, user } = useAuthStore();

  const products = useProductStore((state) => state.items);
  const hasNextPage = useProductStore((state) => state.hasNextPage);
  const isLoading = useProductStore((state) => state.isLoading);
  const totalCount = useProductStore((state) => state.totalCount);
  const error = useProductStore((state) => state.error);
  const loadProducts = useProductStore((state) => state.loadProducts);

  const addCartItem = useCartStore((state) => state.addCartItem);

  const loadProductsData = async (isInitial = false): Promise<void> => {
    try {
      const page = isInitial ? 1 : currentPage + 1;
      await loadProducts({
        filter: { minPrice, maxPrice, title, categoryId },
        pageSize,
        page,
        isInitial,
      });
      if (!isInitial) {
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    loadProductsData(true);
  }, [minPrice, maxPrice, title, categoryId]);

  useEffect(() => {
    if (error && isFirebaseIndexError(error)) {
      const link = extractIndexLink(error);
      setIndexLink(link);
      setIsIndexErrorModalOpen(true);
    }
  }, [error]);

  const handleCartAction = (product: Product): void => {
    if (isLogin && user) {
      const cartItem: CartItem = { ...product, count: 1 };
      addCartItem(cartItem, user.uid, 1);
      console.log(`${product.title} 상품이 장바구니에 담겼습니다.`);
    } else {
      navigate(pageRoutes.login);
    }
  };

  const handlePurchaseAction = (product: Product): void => {
    if (isLogin && user) {
      const cartItem: CartItem = { ...product, count: 1 };
      addCartItem(cartItem, user.uid, 1);
      navigate(pageRoutes.cart);
    } else {
      navigate(pageRoutes.login);
    }
  };

  const handleProductAdded = (): void => {
    setCurrentPage(1);
    loadProductsData(true);
  };

  const firstProductImage = products[0]?.image;

  useEffect(() => {
    if (firstProductImage) {
      const img = new Image();
      img.src = firstProductImage;
    }
  }, [firstProductImage]);

  const renderContent = (): JSX.Element => {
    if (isLoading && products.length === 0) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: pageSize }, (_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      );
    }

    if (products.length === 0) {
      return <EmptyProduct onAddProduct={openModal} />;
    }

    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product, index) => (
            <ProductCard
              key={`${product.id}_${index}`}
              product={product}
              onClickAddCartButton={(ev: React.MouseEvent) => {
                ev.stopPropagation();
                handleCartAction(product);
              }}
              onClickPurchaseButton={(ev: React.MouseEvent) => {
                ev.stopPropagation();
                handlePurchaseAction(product);
              }}
            />
          ))}
        </div>
        {hasNextPage && currentPage * pageSize < totalCount && (
          <div className="flex justify-center mt-4">
            <Button onClick={() => loadProductsData()} disabled={isLoading}>
              {isLoading ? '로딩 중...' : '더 보기'}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-end mt-4">
          <Button onClick={openModal}>
            <Plus className="mr-2 h-4 w-4" /> 상품 등록
          </Button>
        </div>
        {renderContent()}
        {isOpen && (
          <ProductRegistrationModal
            isOpen={isOpen}
            onClose={closeModal}
            onProductAdded={handleProductAdded}
          />
        )}
        <FirebaseIndexErrorModal
          isOpen={isIndexErrorModalOpen}
          onClose={() => setIsIndexErrorModalOpen(false)}
          indexLink={indexLink}
        />
      </div>
    </>
  );
};
