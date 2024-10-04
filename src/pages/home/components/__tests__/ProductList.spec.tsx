import { PRODUCT_PAGE_SIZE } from '@/constants';
import { IProduct, useFetchProducts } from '@/lib/product';
import { formatPrice } from '@/utils/formatter';
import {
  mockUseAuthStore,
  mockUseCartStore,
  mockUseToastStore,
} from '@/utils/test/mockZustandStore';
import render from '@/utils/test/render';
import { navigateFn } from '@/utils/test/setupTests';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Mock, vi } from 'vitest';
import { ProductList } from '../ProductList';

interface CreateMockDataParams {
  products?: IProduct[];
  hasNextPage?: boolean;
  totalCount?: number;
  nextPage?: number | undefined;
  fetchNextPageFn?: Mock<any>;
}

const createMockData = ({
  products = [],
  hasNextPage = false,
  totalCount = products.length,
  nextPage = undefined,
  fetchNextPageFn = vi.fn(),
}: CreateMockDataParams = {}) => ({
  pages: [
    {
      products,
      hasNextPage,
      totalCount,
      nextPage,
    },
  ],
  pageParams: [undefined],
});

const mockProducts: IProduct[] = [
  {
    id: '1',
    title: 'Product 1',
    price: 1000,
    category: { id: '1', name: 'category1' },
    image: 'image_url_1',
  },
  {
    id: '2',
    title: 'Product 2',
    price: 2000,
    category: { id: '2', name: 'category2' },
    image: 'image_url_2',
  },
];

describe('ProductList Component', () => {
  it('로딩이 완료된 경우 상품 리스트가 제대로 모두 노출된다', async () => {
    // Arrange: Mock 데이터 설정 및 useFetchProducts 훅의 반환 값 설정
    const mockData = createMockData({ products: mockProducts });

    (useFetchProducts as jest.Mock).mockReturnValue({
      data: mockData,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      isLoading: false,
      error: null,
    });

    // Act: ProductList 컴포넌트 렌더링
    await render(<ProductList pageSize={PRODUCT_PAGE_SIZE} />);

    // Assert: 모든 상품 카드가 올바르게 렌더링되었는지 확인
    const productCards = await screen.findAllByTestId('product-card');
    expect(productCards).toHaveLength(mockProducts.length);

    productCards.forEach((el, index) => {
      const productCard = within(el);
      const product = mockProducts[index];

      expect(productCard.getByText(product.title)).toBeInTheDocument();
      expect(productCard.getByText(product.category.name)).toBeInTheDocument();
      expect(
        productCard.getByText(formatPrice(product.price))
      ).toBeInTheDocument();
      expect(
        productCard.getByRole('button', { name: '장바구니' })
      ).toBeInTheDocument();
      expect(
        productCard.getByRole('button', { name: '구매하기' })
      ).toBeInTheDocument();
    });
  });

  it('보여줄 상품 리스트가 더 있는 경우 "더 보기" 버튼이 노출되며, 버튼을 누르면 상품 리스트를 더 가져온다.', async () => {
    // Arrange: 추가 페이지가 있는 mock 데이터 및 fetchNextPage 함수 모킹
    const fetchNextPageFn = vi.fn();

    const mockData = createMockData({
      products: mockProducts,
      hasNextPage: true,
      totalCount: 4,
      nextPage: 2,
      fetchNextPageFn,
    });

    (useFetchProducts as jest.Mock).mockReturnValue({
      data: mockData,
      fetchNextPage: fetchNextPageFn,
      hasNextPage: true,
      isFetchingNextPage: false,
      isLoading: false,
      error: null,
    });

    // Act: ProductList 컴포넌트 렌더링
    await render(<ProductList pageSize={PRODUCT_PAGE_SIZE} />);

    // Assert: "더 보기" 버튼이 표시되고 클릭 시 fetchNextPage 함수가 호출되는지 확인
    expect(screen.getByText('더 보기')).toBeInTheDocument();

    await userEvent.click(screen.getByText('더 보기'));
    expect(fetchNextPageFn).toHaveBeenCalled();
  });

  it('보여줄 상품 리스트가 없는 경우 "더 보기" 버튼이 노출되지 않는다.', async () => {
    // Arrange: 상품이 없는 mock 데이터 설정
    const mockData = createMockData({ products: [] });

    (useFetchProducts as jest.Mock).mockReturnValue({
      data: mockData,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      isLoading: false,
      error: null,
    });

    // Act: ProductList 컴포넌트 렌더링
    await render(<ProductList pageSize={PRODUCT_PAGE_SIZE} />);

    // Assert: "더 보기" 버튼이 노출되지 않는지 확인
    expect(screen.queryByText('더 보기')).not.toBeInTheDocument();
  });

  describe('로그인 상태일 경우', () => {
    beforeEach(() => {
      // Arrange: 로그인 상태 모킹
      mockUseAuthStore({
        isLogin: true,
        user: {
          uid: 'mocked-uid',
          email: 'test@example.com',
          displayName: '홍길동',
        },
      });
    });

    const singleProduct: IProduct[] = [
      {
        id: '1',
        title: 'Product 1',
        price: 1000,
        category: { id: '1', name: 'category1' },
        image: '/path/to/image1.jpg',
      },
    ];

    it('구매 버튼 클릭시 addCartItem 메서드가 호출되며, "/cart" 경로로 navigate 함수가 호출된다.', async () => {
      // Arrange: 장바구니에 아이템 추가하는 함수 및 mock 데이터 설정
      const addCartItemFn = vi.fn();
      mockUseCartStore({ addCartItem: addCartItemFn });

      const mockData = createMockData({ products: singleProduct });

      (useFetchProducts as jest.Mock).mockReturnValue({
        data: mockData,
        fetchNextPage: vi.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
        isLoading: false,
        error: null,
      });

      // Act: ProductList 컴포넌트 렌더링 및 구매 버튼 클릭
      await render(<ProductList pageSize={PRODUCT_PAGE_SIZE} />);
      await screen.findAllByTestId('product-card');

      const productIndex = 0;
      await userEvent.click(
        screen.getAllByRole('button', { name: '구매하기' })[productIndex]
      );

      const expectedProduct = {
        ...singleProduct[productIndex],
        count: 1,
      };

      // Assert: addCartItem 호출 및 navigate 함수 호출 확인
      expect(addCartItemFn).toHaveBeenNthCalledWith(
        1,
        expectedProduct,
        'mocked-uid',
        1
      );
      expect(navigateFn).toHaveBeenNthCalledWith(1, '/cart');
    });

    it('장바구니 버튼 클릭시 "장바구니 추가 완료!" toast를 노출하며, addCartItem 메서드가 호출된다.', async () => {
      // Arrange: 장바구니 추가 함수 및 toast 함수 모킹, mock 데이터 설정
      const addCartItemFn = vi.fn();
      const addToastFn = vi.fn();
      mockUseCartStore({ addCartItem: addCartItemFn });
      mockUseToastStore({ addToast: addToastFn });

      const mockData = createMockData({ products: singleProduct });

      (useFetchProducts as jest.Mock).mockReturnValue({
        data: mockData,
        fetchNextPage: vi.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
        isLoading: false,
        error: null,
      });

      // Act: ProductList 컴포넌트 렌더링 및 장바구니 버튼 클릭
      await render(<ProductList pageSize={PRODUCT_PAGE_SIZE} />);
      await screen.findAllByTestId('product-card');

      const productIndex = 0;
      const product = singleProduct[productIndex];
      await userEvent.click(
        screen.getAllByRole('button', { name: '장바구니' })[productIndex]
      );

      const expectedProduct = { ...product, count: 1 };

      // Assert: addCartItem 호출 및 toast 메시지 표시 확인
      expect(addCartItemFn).toHaveBeenNthCalledWith(
        1,
        expectedProduct,
        'mocked-uid',
        1
      );
      expect(addToastFn).toHaveBeenCalledWith(
        `${product.title} 상품이 장바구니에 담겼습니다.`,
        'success'
      );
    });
  });

  describe('로그인이 되어 있지 않은 경우', () => {
    beforeEach(() => {
      // Arrange: 로그아웃 상태 모킹
      mockUseAuthStore({
        isLogin: false,
        user: null,
      });
    });

    it('구매 버튼 클릭시 "/login" 경로로 navigate 함수가 호출된다.', async () => {
      // Act: ProductList 컴포넌트 렌더링 및 구매 버튼 클릭
      await render(<ProductList pageSize={PRODUCT_PAGE_SIZE} />);

      await screen.findAllByTestId('product-card');

      const productIndex = 0;
      await userEvent.click(
        screen.getAllByRole('button', { name: '구매하기' })[productIndex]
      );

      // Assert: navigate 함수가 "/login"으로 호출되었는지 확인
      expect(navigateFn).toHaveBeenNthCalledWith(1, '/login');
    });

    it('장바구니 버튼 클릭시 "/login" 경로로 navigate 함수가 호출된다.', async () => {
      // Act: ProductList 컴포넌트 렌더링 및 장바구니 버튼 클릭
      await render(<ProductList pageSize={PRODUCT_PAGE_SIZE} />);

      await screen.findAllByTestId('product-card');

      const productIndex = 0;
      await userEvent.click(
        screen.getAllByRole('button', { name: '장바구니' })[productIndex]
      );

      // Assert: navigate 함수가 "/login"으로 호출되었는지 확인
      expect(navigateFn).toHaveBeenNthCalledWith(1, '/login');
    });
  });
});
