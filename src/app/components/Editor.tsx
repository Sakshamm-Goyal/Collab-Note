'use client';

import React, { useEffect, useState } from 'react';
import { useOthers, useRoom } from '@liveblocks/react';
import * as Y from 'yjs';
import { LiveblocksYjsProvider } from '@liveblocks/yjs';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/core/style.css';
import '@blocknote/mantine/style.css';
import '../css/editor-custom.css';
import { Button } from '@/components/ui/button';
import { Share2, UserPlus, Sun, Moon } from 'lucide-react';
import AIFeaturesDropdown from './AIFeaturesDropdown';
import ShareModal from './ShareModal';
import AccessControlModal from './AccessControlModal';
import { useThemeAndSidebar } from '../context/ThemeContext';
import { AnimatedTooltip } from './animated-tooltip';
import { useUser } from '@clerk/nextjs';

type EditorProps = {
  roomId: string;
  isOwner: boolean;
};

const Editor = ({ roomId, isOwner }: EditorProps) => {
  const room = useRoom();
  const [doc, setDoc] = useState<Y.Doc | null>(null);
  const [provider, setProvider] = useState<LiveblocksYjsProvider | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAccessControlModalOpen, setIsAccessControlModalOpen] =
    useState(false);
  const { theme, toggleTheme } = useThemeAndSidebar();

  useEffect(() => {
    const yDoc = new Y.Doc();
    const yProvider = new LiveblocksYjsProvider(room, yDoc);
    setDoc(yDoc);
    setProvider(yProvider);

    return () => {
      yProvider.destroy();
      yDoc.destroy();
    };
  }, [room]);

  useEffect(() => {
    const editor = document.querySelector('.ProseMirror');
    if (editor) {
      editor.dispatchEvent(new Event('focus'));
    }
  }, []);

  if (!doc || !provider) return null;

  return (
    <div
      className={`h-full overflow-auto ${theme === 'dark' ? 'bg-dark text-light' : 'bg-white text-dark'}`}
    >
      <div className="mx-auto">
        <EditorToolbar
          doc={doc}
          isOwner={isOwner}
          onShare={() => setIsShareModalOpen(true)}
          onManageAccess={() => setIsAccessControlModalOpen(true)}
          theme={theme}
          toggleTheme={toggleTheme}
        />
        <div
          className={`shadow-lg overflow-hidden mt-2 ${theme === 'dark' ? 'bg-dark border-dark' : 'bg-white border-gray-200'}`}
        >
          <BlockNote doc={doc} provider={provider} theme={theme} />
        </div>
      </div>

      {isOwner && (
        <AccessControlModal
          isOpen={isAccessControlModalOpen}
          onClose={() => setIsAccessControlModalOpen(false)}
          roomId={roomId}
        />
      )}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        roomId={roomId}
      />
    </div>
  );
};

const EditorToolbar = ({
  isOwner,
  onShare,
  onManageAccess,
  theme,
  toggleTheme,
  doc,
}: {
  isOwner: boolean;
  onShare: () => void;
  onManageAccess: () => void;
  theme: string;
  toggleTheme: () => void;
  doc: Y.Doc;
}) => {
  const others = useOthers();

  return (
    <div
      className={`p-4 border-b ${theme === 'dark' ? 'bg-dark border-dark' : 'bg-white border-gray-200'} flex items-center justify-between`}
    >
      <div className="flex gap-4">
        <AIFeaturesDropdown doc={doc} />
        {isOwner && (
          <Button
            variant="outline"
            size="sm"
            className={`button-dark`}
            onClick={onManageAccess}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Manage Access
          </Button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <AnimatedTooltip
          items={others.map((other) => ({
            id: Number(other.connectionId),
            name: other.info.name || 'Anonymous',
            image: other.info.avatar || 'https://via.placeholder.com/150',
          }))}
        />
        <Button
          variant="outline"
          size="sm"
          className={`button-dark`}
          onClick={onShare}
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  );
};

const BlockNote = ({
  doc,
  provider,
  theme,
}: {
  doc: Y.Doc;
  provider: LiveblocksYjsProvider;
  theme: 'light' | 'dark';
}) => {
  const { user } = useUser();

  const editor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: doc.getXmlFragment('document-store'),
      user: {
        name: user?.firstName || user?.fullName || 'Anonymous',
        color: theme === 'dark' ? '#ffffff' : '#000000',
      },
    },
    domAttributes: {
      editor: {
        class: 'outline-none',
      },
    },
  });

  return (
    <BlockNoteView
      editor={editor}
      theme={theme}
      className="min-h-[calc(100vh-5.7rem)] p-6"
    />
  );
};

export default Editor;
