import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export const FirebaseIndexErrorModal = ({ isOpen, onClose, indexLink }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Firebase 인덱스 생성 필요</DialogTitle>
        </DialogHeader>
        <p>쿼리 실행을 위해 Firebase 인덱스를 생성해야 합니다.</p>
        {indexLink && (
          <DialogFooter>
            <Button asChild>
              <a href={indexLink} target="_blank" rel="noopener noreferrer">
                인덱스 생성하기
              </a>
            </Button>
            <Button variant="outline" onClick={onClose}>
              닫기
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
