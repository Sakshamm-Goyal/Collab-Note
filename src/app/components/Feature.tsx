'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Users, MessageSquare, Globe } from 'lucide-react';
import FollowPointer from './FollowPointer';
import { AnimatedTooltip } from './animated-tooltip';

interface User {
  id: string;
  name: string;
  color: string;
  avatar: string;
}

interface CursorPosition {
  index: number;
  isTyping: boolean;
  x: number;
  y: number;
}

interface EditorState {
  text: string;
  cursorPositions: Record<string, CursorPosition>;
}

const initialParagraph = `Collaborative AI-powered document editing is revolutionizing the way teams work together. With real-time updates, smart suggestions, and instant translations, creating high-quality content has never been easier or more efficient. As we continue to push the boundaries of what's possible, we're excited to see how this technology will shape the future of work and creativity.`;

const useCollaborativeEditing = (initialUsers: User[]) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [editorState, setEditorState] = useState<EditorState>({
    text: initialParagraph,
    cursorPositions: {},
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setEditorState((prevState) => {
        const newState = { ...prevState };
        users.forEach((user) => {
          if (Math.random() > 0.8) {
            const isTyping = Math.random() > 0.5;
            if (isTyping) {
              const position =
                newState.cursorPositions[user.id]?.index ||
                Math.floor(Math.random() * newState.text.length);
              const newChar = ' abcdefghijklmnopqrstuvwxyz'.charAt(
                Math.floor(Math.random() * 27)
              );
              newState.text =
                newState.text.slice(0, position) +
                newChar +
                newState.text.slice(position);
              newState.cursorPositions[user.id] = {
                ...newState.cursorPositions[user.id],
                index: position + 1,
                isTyping: true,
              };
            } else if (newState.cursorPositions[user.id]) {
              newState.cursorPositions[user.id].isTyping = false;
            }
          } else if (Math.random() > 0.95) {
            delete newState.cursorPositions[user.id];
          }
        });
        return newState;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [users]);
  let dummyUserNames = ['Bob', 'Charlie', 'Diana', 'Eva'];
  useEffect(() => {
    const interval = setInterval(() => {
      setUsers((prevUsers) => {
        if (prevUsers.length < 4 && Math.random() > 0.7) {
          const newUser = {
            id: `user-${Date.now()}`,
            name: `${dummyUserNames[Math.floor(Math.random() * 4)]}`,
            color: `hsl(${Math.random() * 360}, 70%, 50%)`,
            avatar: `https://i.pravatar.cc/150?u=user${prevUsers.length + 1}`,
          };
          return [...prevUsers, newUser];
        } else if (prevUsers.length > 1 && Math.random() > 0.9) {
          return prevUsers.slice(0, -1);
        }
        return prevUsers;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return { users, editorState, setEditorState };
};

const Cursor: React.FC<{ color: string; isBlinking: boolean }> = ({
  color,
  isBlinking,
}) => (
  <span
    className={`inline-block w-0.5 h-5 -mb-1 ${isBlinking ? 'animate-blink' : ''}`}
    style={{ backgroundColor: color }}
  />
);

const TypingIndicator: React.FC<{ name: string; color: string }> = ({
  name,
  color,
}) => (
  <div
    className="absolute -top-6 left-0 px-2 py-1 text-xs rounded whitespace-nowrap"
    style={{ backgroundColor: color, color: 'white' }}
  >
    {name}
  </div>
);

const CollaborativeTextEditor: React.FC<{
  users: User[];
  editorState: EditorState;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
}> = ({ users, editorState, setEditorState }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current) {
      const { width, height } = editorRef.current.getBoundingClientRect();
      setEditorState((prevState) => ({
        ...prevState,
        cursorPositions: Object.fromEntries(
          Object.entries(prevState.cursorPositions).map(([userId, pos]) => [
            userId,
            {
              ...pos,
              x: (pos.index / prevState.text.length) * width,
              y: Math.min(Math.random() * height, height - 50),
            },
          ])
        ),
      }));
    }
  }, [editorState.text, setEditorState]);

  return (
    <div
      ref={editorRef}
      className="bg-black text-white p-4 rounded-md min-h-[200px] relative font-sans text-sm leading-6 overflow-hidden"
    >
      {editorState.text.split('').map((char, index) => {
        const userAtPosition = users.find(
          (user) => editorState.cursorPositions[user.id]?.index === index
        );
        return (
          <React.Fragment key={index}>
            {userAtPosition && (
              <span className="relative">
                <Cursor color={userAtPosition.color} isBlinking={true} />
                {editorState.cursorPositions[userAtPosition.id].isTyping && (
                  <TypingIndicator
                    name={userAtPosition.name}
                    color={userAtPosition.color}
                  />
                )}
              </span>
            )}
            {char}
          </React.Fragment>
        );
      })}
      {users.map((user) => {
        if (
          editorState.cursorPositions[user.id]?.index ===
          editorState.text.length
        ) {
          return (
            <span key={user.id} className="relative">
              <Cursor color={user.color} isBlinking={true} />
              {editorState.cursorPositions[user.id].isTyping && (
                <TypingIndicator name={user.name} color={user.color} />
              )}
            </span>
          );
        }
        return null;
      })}
      <AnimatePresence>
        {users.map((user) => {
          const position = editorState.cursorPositions[user.id];
          if (position) {
            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1, x: position.x, y: position.y }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{ position: 'absolute', pointerEvents: 'none' }}
              >
                <FollowPointer
                  x={0}
                  y={0}
                  info={{
                    name: user.name,
                    email: `${user.name.toLowerCase()}@example.com`,
                    avatar: user.avatar,
                  }}
                />
              </motion.div>
            );
          }
          return null;
        })}
      </AnimatePresence>
    </div>
  );
};

const EnhancedFeatureDemo: React.FC = () => {
  const initialUsers: User[] = [
    {
      id: 'user-1',
      name: 'Alice',
      color: 'hsl(0, 70%, 50%)',
      avatar: 'https://i.pravatar.cc/150?u=alice',
    },
  ];
  const { users, editorState, setEditorState } =
    useCollaborativeEditing(initialUsers);

  const tooltipItems = users
    .filter((user) => editorState.cursorPositions[user.id])
    .map((user, index) => ({
      id: index + 1,
      name: user.name,
      image: user.avatar,
    }));

  return (
    <div
      id="feature"
      className="max-w-4xl mx-auto mt-10 bg-gray-900 rounded-lg overflow-hidden shadow-2xl"
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
            AI Features
          </button>
          <button className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors">
            Manage Access
          </button>
        </div>
        <div className="flex space-x-2 items-center">
          <div className="mr-2">
            <AnimatedTooltip items={tooltipItems} />
          </div>
          <button className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors">
            Share
          </button>
        </div>
      </div>
      <div className="relative p-6 bg-gray-800">
        <CollaborativeTextEditor
          users={users}
          editorState={editorState}
          setEditorState={setEditorState}
        />
      </div>
      <div className="p-4 bg-gray-800">
        <h2 className="text-xl font-bold text-white mb-4">Key Features</h2>
        <div className="grid grid-cols-2 gap-4">
          <FeatureCard
            icon={<Users className="h-6 w-6 text-blue-400" />}
            title="Real-Time Collaboration"
            description="Work together seamlessly with live cursors and instant updates."
          />
          <FeatureCard
            icon={<Sparkles className="h-6 w-6 text-green-400" />}
            title="AI-Powered Assistance"
            description="Get intelligent suggestions and autocompletions as you type."
          />
          <FeatureCard
            icon={<MessageSquare className="h-6 w-6 text-yellow-400" />}
            title="Smart Summarization"
            description="Automatically generate concise summaries of your documents."
          />
          <FeatureCard
            icon={<Globe className="h-6 w-6 text-purple-400" />}
            title="Instant Translation"
            description="Translate your content into multiple languages on the fly."
          />
        </div>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="bg-gray-700 rounded-xl p-4 hover:bg-gray-600 transition-colors">
      <div className="flex items-center mb-2">
        {icon}
        <h3 className="text-lg font-semibold text-white ml-2">{title}</h3>
      </div>
      <p className="text-gray-300 text-sm">{description}</p>
    </div>
  );
};

export default EnhancedFeatureDemo;
