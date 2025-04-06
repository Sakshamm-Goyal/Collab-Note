import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import * as Y from 'yjs';
import { Button } from '@/components/ui/button';
import { Wand2, MessageSquare, FileText, Globe } from 'lucide-react';
import AIChat from './AIChat';
import AIGenerate from './AIGenerate';
import AISummarize from './AISummarize';
import AITranslate from './AITranslate';
import { useThemeAndSidebar } from '../context/ThemeContext';

const AIFeaturesDropdown = ({ doc }: { doc: Y.Doc }) => {
  const [openFeature, setOpenFeature] = useState<string | null>(null);
  const { theme } = useThemeAndSidebar();

  const handleAIAction = (action: string) => {
    setOpenFeature(action);
  };

  const handleClose = () => {
    setOpenFeature(null);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={theme === 'dark' ? 'bg-gray-700 text-gray-100' : ''}
          >
            <Wand2 className="w-4 h-4 mr-2" />
            AI Features
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={theme === 'dark' ? 'bg-gray-800 text-gray-100' : ''}
        >
          <DropdownMenuItem
            onClick={() => handleAIAction('ask')}
            className={theme === 'dark' ? 'hover:bg-gray-700' : ''}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>Ask AI</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleAIAction('generate')}
            className={theme === 'dark' ? 'hover:bg-gray-700' : ''}
          >
            <Wand2 className="mr-2 h-4 w-4" />
            <span>Generate Content</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleAIAction('summarize')}
            className={theme === 'dark' ? 'hover:bg-gray-700' : ''}
          >
            <FileText className="mr-2 h-4 w-4" />
            <span>Summarize Document</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleAIAction('translate')}
            className={theme === 'dark' ? 'hover:bg-gray-700' : ''}
          >
            <Globe className="mr-2 h-4 w-4" />
            <span>Translate Document</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AIChat doc={doc} isOpen={openFeature === 'ask'} onClose={handleClose} />
      <AIGenerate
        doc={doc}
        isOpen={openFeature === 'generate'}
        onClose={handleClose}
      />
      <AISummarize
        doc={doc}
        isOpen={openFeature === 'summarize'}
        onClose={handleClose}
      />
      <AITranslate
        isOpen={openFeature === 'translate'}
        onClose={handleClose}
        doc={doc}
      />
    </>
  );
};

export default AIFeaturesDropdown;
