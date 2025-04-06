'use client';
import { Menu, Search, Sun, Moon } from 'lucide-react';
import React, { useEffect, useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { SignedIn, UserButton, useUser } from '@clerk/nextjs';
import { useThemeAndSidebar } from '../context/ThemeContext';
import { Switch } from '@/components/ui/switch';
import { supabase } from '../lib/initSupabase';
import debounce from 'lodash/debounce';
import { useRouter } from 'next/navigation';

type Props = {};

type Room = {
  id: string;
  Name: string | null;
  Description: string | null;
  userId: string;
};

const Header = ({}: Props) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Room[]>([]);
  const { theme, toggleTheme, isCollapsed } = useThemeAndSidebar();
  const { user } = useUser();
  const router = useRouter();

  const debouncedSearch = useCallback(
    debounce(async (term: string) => {
      if (!term.trim() || !user) return;

      const userEmail = user.primaryEmailAddress?.emailAddress;

      const { data, error } = await supabase
        .from('Rooms')
        .select('id, Name, Description, userId')
        .or(`Name.ilike.%${term}%,Description.ilike.%${term}%`)
        .or(
          `userId.eq.${user.id},Members.cs.{${userEmail}},Admins.cs.{${userEmail}}`
        )
        .order('Name');

      if (error) {
        console.error('Error searching rooms:', error);
      } else {
        setSearchResults(data || []);
      }
    }, 300),
    [user]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const highlightMatch = (text: string, term: string) => {
    if (!term.trim()) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    return text.split(regex).map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-700">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <header
      className={`shadow-sm py-4 px-6 transition-all duration-300 ease-in-out overflow-x-hidden
        ${theme === 'light' ? 'bg-white text-gray-700' : 'bg-gray-800 text-gray-200'}`}
      style={{
        width: `calc(100vw - ${isCollapsed ? '96.5px' : '273px'})`,
        marginLeft: `${isCollapsed ? '80px' : '256px'}`,
      }}
    >
      <div className="flex justify-between items-center">
        <div />
        <div className="flex items-center space-x-4 justify-end w-full">
          <SignedIn>
            <UserButton />
          </SignedIn>
          <button
            onClick={() => setSearchOpen(true)}
            className={`flex items-center px-3 py-2 rounded-md 
              ${theme === 'light' ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
          >
            <Search className="w-4 h-4 mr-2" />
            <span>Search</span>
            <kbd
              className={`ml-2 px-1.5 py-0.5 text-xs rounded 
              ${theme === 'light' ? 'bg-gray-300' : 'bg-gray-600'}`}
            >
              ⌘K
            </kbd>
          </button>
          <div className="flex items-center">
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
              className="ml-2"
            />
            {theme === 'light' ? (
              <Sun className="ml-2 w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="ml-2 w-5 h-5 text-blue-300" />
            )}
          </div>
        </div>
      </div>

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent
          className={`sm:max-w-[600px] w-full ${theme === 'light' ? 'bg-white' : 'bg-gray-800'} p-4`}
        >
          <DialogHeader>
            <DialogTitle>Search Rooms</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Type room name..."
              className={`col-span-3 w-full ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700 text-white'}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div
              className={`max-h-60 overflow-y-auto w-full ${theme === 'light' ? 'bg-white' : 'bg-gray-700'} rounded-md`}
            >
              {searchResults.map((room) => (
                <div
                  key={room.id}
                  className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer w-full ${
                    theme === 'light'
                      ? 'border-b border-gray-200'
                      : 'border-b border-gray-600'
                  }`}
                  onClick={() => {
                    router.push(`/rooms/${room.id}`);
                    setSearchOpen(false);
                  }}
                >
                  <h3 className="font-semibold">
                    {highlightMatch(room.Name ?? '', searchTerm)}
                  </h3>
                  {room.Description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {highlightMatch(room.Description, searchTerm)}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {room.userId === user?.id ? 'Owner' : 'Member'}
                  </p>
                </div>
              ))}
              {searchResults.length === 0 && searchTerm.trim() !== '' && (
                <p className="p-2 text-gray-500 dark:text-gray-400">
                  No results found
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
