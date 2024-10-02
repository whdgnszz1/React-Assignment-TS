import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ChangeEvent, useState } from 'react';

import { useAddProduct } from '@/lib/product/hooks/useAddProduct';

import { ALL_CATEGORY_ID, categories } from '@/constants';
import { createNewProduct, initialProductState } from '@/helpers/product';
import { NewProductDTO } from '@/lib/product';
import { uploadImage } from '@/utils/imageUpload';

interface ProductRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProductRegistrationModal: React.FC<
  ProductRegistrationModalProps
> = ({ isOpen, onClose }) => {
  const { mutateAsync, isPending: isLoading } = useAddProduct();

  const [product, setProduct] = useState<NewProductDTO>(initialProductState);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setProduct((prev) => ({ ...prev, image: file }));
    }
  };

  const handleCategoryChange = (value: string): void => {
    setProduct((prev) => ({
      ...prev,
      category: { ...prev.category, id: value },
    }));
  };

  const handleSubmit = async (): Promise<void> => {
    setError(null);
    try {
      if (!product.image) {
        throw new Error('이미지를 선택해야 합니다.');
      }

      const imageUrl = await uploadImage(product.image as File);
      if (!imageUrl) {
        throw new Error('이미지 업로드에 실패했습니다.');
      }

      const newProduct = createNewProduct(product, imageUrl);

      await mutateAsync(newProduct);

      onClose();
    } catch (error: any) {
      console.error('물품 등록에 실패했습니다.', error);
      setError(error.message || '물품 등록에 실패했습니다.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>상품 등록</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            name="title"
            placeholder="상품명"
            onChange={handleChange}
            value={product.title || ''}
          />
          <Input
            name="price"
            type="number"
            placeholder="가격"
            onChange={handleChange}
            value={product.price || ''}
          />
          <Textarea
            name="description"
            placeholder="상품 설명"
            onChange={handleChange}
            value={product.description || ''}
          />
          <Select
            name="categoryId"
            onValueChange={handleCategoryChange}
            value={product.category.id || ''}
          >
            <SelectTrigger>
              <SelectValue placeholder="카테고리 선택" />
            </SelectTrigger>
            <SelectContent>
              {categories
                .filter((category) => category.id !== ALL_CATEGORY_ID)
                .map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Input
            className="cursor-pointer"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? '등록 중...' : '등록'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
