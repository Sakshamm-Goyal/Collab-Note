import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type AIAssistantModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AIAssistantModal = ({ isOpen, onClose }: AIAssistantModalProps) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Processing prompt:', prompt);
    setPrompt('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>AI Assistant</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask the AI assistant..."
          />
          <Button type="submit">Send</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AIAssistantModal;
