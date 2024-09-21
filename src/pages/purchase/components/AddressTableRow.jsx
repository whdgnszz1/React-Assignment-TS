import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';

export const AddressTableRow = ({ value, onChange, error }) => {
  return (
    <TableRow>
      <TableCell className="font-bold">
        <Label htmlFor="address" className="flex items-center">
          <MapPin className="mr-2 h-4 w-4" />
          주소
        </Label>
      </TableCell>
      <TableCell>
        <Input
          id="address"
          name="address"
          value={value}
          onChange={onChange}
          placeholder="주소를 입력하세요"
          className={error ? 'border-red-500' : ''}
        />
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </TableCell>
    </TableRow>
  );
};
