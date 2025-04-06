import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useThemeAndSidebar } from '../context/ThemeContext';

type ShareModalProps = {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
};

const ShareModal = ({ isOpen, onClose, roomId }: ShareModalProps) => {
  const shareLink = `${process.env.NEXT_PUBLIC_FRONTEND_APP_URL}/rooms/${roomId}`;
  const { theme } = useThemeAndSidebar();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={theme === 'dark' ? 'bg-gray-800 text-gray-100' : ''}
      >
        <DialogHeader>
          <DialogTitle>Share this document</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <Input
            value={shareLink}
            readOnly
            className={theme === 'dark' ? 'bg-gray-700 text-gray-100' : ''}
          />
          <Button
            onClick={() => navigator.clipboard.writeText(shareLink)}
            className={theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : ''}
          >
            Copy
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
