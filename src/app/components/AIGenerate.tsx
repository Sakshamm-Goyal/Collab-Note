import React, { useState, useRef, useEffect, useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Send, Bot, User, Copy, CheckCircle } from 'lucide-react';
import * as Y from 'yjs';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';
import { useThemeAndSidebar } from '../context/ThemeContext';
import { generateContentWithLiveblocks } from '../actions/liveblocks-action';
import { useEventListener, useRoom } from '@liveblocks/react';

type Message = {
  id: number;
  content: string;
  sender: 'user' | 'ai';
};

const AIGenerate: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  doc: Y.Doc;
}> = ({ isOpen, onClose, doc }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, startTransition] = useTransition();
  const { theme } = useThemeAndSidebar();
  const room = useRoom();
  
  // Listen for AI request completion events
  useEventListener(({ event }) => {
    console.log("Received event:", event.type);
    
    if (event.type === 'AI_GENERATE_COMPLETED') {
      console.log("AI generate event data:", event.data);
      const data = event.data;
      
      if (data && data.result) {
        setMessages((prev) => {
          // Only add the message if it's not already there (avoid duplicates)
          const lastMessage = prev[prev.length - 1];
          if (lastMessage?.sender === 'ai' && lastMessage?.content === data.result) {
            return prev;
          }
          
          return [
            ...prev,
            { 
              id: Date.now(), 
              content: data.result, 
              sender: 'ai' as const 
            },
          ];
        });
        
        // End loading state
        startTransition(() => {});
      }
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      content: input,
      sender: 'user' as const,
    };
    setMessages([userMessage]);
    setInput('');
    const documentData = doc.getXmlFragment('document-store').toJSON();

    startTransition(async () => {
      try {
        // Use Liveblocks for content generation
        const aiResponse = await generateContentWithLiveblocks(
          input, 
          documentData,
          room.id
        );

        // Add AI response to messages (this will be added by the event listener too,
        // but we add it here in case the event doesn't fire for some reason)
        setMessages((prev) => [
          ...prev,
          { id: Date.now(), content: aiResponse, sender: 'ai' as const },
        ]);
      } catch (error) {
        console.error('Error generating content:', error);
        setMessages((prev) => [
          ...prev,
          { 
            id: Date.now(), 
            content: "Sorry, I couldn't generate content. Please try again.", 
            sender: 'ai' as const 
          },
        ]);
      }
    });
  };

  const handleCopy = () => {
    const aiMessage = messages.find((m) => m.sender === 'ai');
    if (aiMessage) {
      navigator.clipboard.writeText(aiMessage.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`sm:max-w-[700px] h-[80vh] flex flex-col ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white'}`}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Generate Content with AI via Liveblocks
          </DialogTitle>
        </DialogHeader>
        <div
          className={`flex-1 overflow-y-auto mb-4 space-y-4 p-4 rounded-md ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}
        >
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex items-start space-x-2 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`p-3 rounded-lg shadow-md ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : theme === 'dark'
                        ? 'bg-gray-600 text-gray-100'
                        : 'bg-white'
                  }`}
                >
                  {message.sender === 'user' ? (
                    <p>{message.content}</p>
                  ) : (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      className={`prose prose-sm max-w-none ${theme === 'dark' ? 'dark:prose-invert' : ''}`}
                    >
                      {message.content}
                    </ReactMarkdown>
                  )}
                </div>
                <div
                  className={`flex-shrink-0 ${message.sender === 'user' ? 'bg-blue-500' : theme === 'dark' ? 'bg-gray-500' : 'bg-gray-200'} p-2 rounded-full`}
                >
                  {message.sender === 'user' ? (
                    <User size={16} color="white" />
                  ) : (
                    <Bot
                      size={16}
                      color={theme === 'dark' ? 'white' : 'black'}
                    />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex items-center space-x-2 text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>AI is generating with Liveblocks...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleGenerate} className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your content prompt here..."
            className={`flex-1 ${theme === 'dark' ? 'bg-gray-700 text-gray-100 border-gray-600' : ''}`}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
        {messages.some((m) => m.sender === 'ai') && (
          <Button
            onClick={handleCopy}
            className={`mt-2 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : ''}`}
            variant="outline"
          >
            {isCopied ? (
              <CheckCircle className="h-4 w-4 mr-2" />
            ) : (
              <Copy className="h-4 w-4 mr-2" />
            )}
            {isCopied ? 'Copied!' : 'Copy Response'}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AIGenerate;
