'use server';

import { supabase } from '../lib/initSupabase';
import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

export async function fetchMyRooms(userId: string) {
  const { data: createdRooms, error } = await supabase
    .from('Rooms')
    .select()
    .eq('userId', userId);

  if (error) {
    console.error('Error fetching created rooms:', error);
    return [];
  }

  return createdRooms || [];
}

export async function fetchAccessedRooms(userId: string, userEmail: string) {
  const { data: memberRooms, error } = await supabase
    .from('Rooms')
    .select()
    .neq('userId', userId)
    .or(`Members.cs.{${userEmail}},Admins.cs.{${userEmail}}`);

  if (error) {
    console.error('Error fetching member rooms:', error);
    return [];
  }

  return memberRooms || [];
}

// Server action for creating new rooms
export async function createNewRoom(
  roomName: string,
  roomDescription: string,
  memberEmails: string[],
  userId: string,
  userEmail: string
) {
  try {
    console.log('Server: Creating room with data:', {
      roomName,
      roomDescription,
      memberEmails,
      userId,
      userEmail: userEmail.substring(0, 3) + '...' // Log partial email for privacy
    });

    // Create admin client only when this function runs on the server
    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
      process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Validate member emails (basic validation)
    const validMembers = memberEmails.filter(email => 
      email.includes('@') && email.includes('.')
    );

    if (memberEmails.length > 0 && validMembers.length !== memberEmails.length) {
      console.warn('Some member emails were invalid and removed:', 
        memberEmails.filter(email => !validMembers.includes(email)));
    }

    const { data, error } = await adminSupabase
      .from('Rooms')
      .insert({
        Name: roomName,
        Description: roomDescription,
        Admins: [userEmail],
        Members: validMembers,
        userId: userId,
      })
      .select();

    if (error) {
      console.error('Error creating room:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw new Error(`Failed to create room: ${error.message}`);
    }

    console.log('Room created successfully:', data?.[0]?.id);
    revalidatePath('/rooms');
    return data?.[0] || null;
  } catch (error) {
    console.error('Exception while creating room:', error);
    if (error instanceof Error) {
      throw error; // Re-throw the error to be caught by the client
    }
    throw new Error('Unknown error occurred while creating room');
  }
}

export async function renameRoom(roomId: string, newName: string) {
  try {
    // Create admin client
    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
      process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
    
    const { error } = await adminSupabase
      .from('Rooms')
      .update({ Name: newName })
      .eq('id', roomId);

    if (error) {
      console.error('Error renaming room:', error);
      throw error;
    }
    
    revalidatePath('/rooms');
    return true;
  } catch (error) {
    console.error('Exception while renaming room:', error);
    throw error;
  }
}
