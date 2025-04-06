import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserPlus, UserMinus } from 'lucide-react';
import { useThemeAndSidebar } from '../context/ThemeContext';
import { supabase } from '../lib/initSupabase';
import { useUser } from '@clerk/nextjs';

type AccessControlModalProps = {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
};

type User = {
  email: string;
  role: 'admin' | 'member';
};

const AccessControlModal = ({
  isOpen,
  onClose,
  roomId,
}: AccessControlModalProps) => {
  const [email, setEmail] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useThemeAndSidebar();
  const { user: currentUser } = useUser();

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen, roomId]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data: room, error } = await supabase
        .from('Rooms')
        .select('Admins, Members')
        .eq('id', roomId)
        .single();

      if (error) throw error;

      const adminUsers = room.Admins.map((email: string) => ({
        email,
        role: 'admin' as const,
      }));
      const memberUsers = room.Members.map((email: string) => ({
        email,
        role: 'member' as const,
      }));
      setUsers([...adminUsers, ...memberUsers]);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async () => {
    if (!email.trim()) return;
    setIsLoading(true);
    try {
      const { data: room, error } = await supabase
        .from('Rooms')
        .select('Members')
        .eq('id', roomId)
        .single();

      if (error) throw error;

      const updatedMembers = [...room.Members, email];
      const { error: updateError } = await supabase
        .from('Rooms')
        .update({ Members: updatedMembers })
        .eq('id', roomId);

      if (updateError) throw updateError;

      setUsers([...users, { email, role: 'member' }]);
      setEmail('');
    } catch (error) {
      console.error('Error adding user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveUser = async (emailToRemove: string) => {
    setIsLoading(true);
    try {
      const { data: room, error } = await supabase
        .from('Rooms')
        .select('Admins, Members')
        .eq('id', roomId)
        .single();

      if (error) throw error;

      const updatedAdmins = room.Admins.filter(
        (email: string) => email !== emailToRemove
      );
      const updatedMembers = room.Members.filter(
        (email: string) => email !== emailToRemove
      );

      const { error: updateError } = await supabase
        .from('Rooms')
        .update({ Admins: updatedAdmins, Members: updatedMembers })
        .eq('id', roomId);

      if (updateError) throw updateError;

      setUsers(users.filter((user) => user.email !== emailToRemove));
    } catch (error) {
      console.error('Error removing user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`sm:max-w-md ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : ''}`}
      >
        <DialogHeader>
          <DialogTitle>Manage Access</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter user email"
              className={theme === 'dark' ? 'bg-gray-700 text-gray-100' : ''}
            />
            <Button
              onClick={handleAddUser}
              disabled={isLoading}
              className={
                theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : ''
              }
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
          <div className="space-y-2">
            {users.map((user) => (
              <div
                key={user.email}
                className="flex justify-between items-center"
              >
                <span>
                  {user.email} ({user.role})
                </span>
                {user.email !==
                  currentUser?.primaryEmailAddress?.emailAddress && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveUser(user.email)}
                    disabled={isLoading}
                  >
                    <UserMinus className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccessControlModal;
