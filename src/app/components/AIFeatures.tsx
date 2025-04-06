import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Wand2, FileText, Globe, ChevronDown } from 'lucide-react';

const AIFeatures = ({ onOpen }: { onOpen: () => void }) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline">
        AI Features <ChevronDown className="ml-2 h-4 w-4" />
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-56">
      <div className="flex flex-col space-y-1">
        <Button variant="ghost" onClick={onOpen}>
          <Wand2 className="mr-2 h-4 w-4" />
          Create with AI
        </Button>
        <Button variant="ghost" onClick={onOpen}>
          <FileText className="mr-2 h-4 w-4" />
          Summarize
        </Button>
        <Button variant="ghost" onClick={onOpen}>
          <Globe className="mr-2 h-4 w-4" />
          Translate
        </Button>
      </div>
    </PopoverContent>
  </Popover>
);

export default AIFeatures;
