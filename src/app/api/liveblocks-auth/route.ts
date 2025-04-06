import { Liveblocks } from '@liveblocks/node';
import { NextRequest, NextResponse } from 'next/server';
import { currentUser, auth } from '@clerk/nextjs/server';
import { supabase } from '@/app/lib/initSupabase';

const liveblocks = new Liveblocks({
  secret:
    'sk_dev_7VKcAuTKk5CAdfI-kXTfzsSsU0xba60sNY0Y51qhEX9_ywGqDENdPxSzK0SbRMJf',
});

export async function POST(request: NextRequest) {
  auth().protect();
  const user = await currentUser();

  try {
    const { room } = await request.json();
    console.log(room, 'room');

    if (!user || !user.emailAddresses[0].emailAddress) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const userEmail = user.emailAddresses[0].emailAddress;

    const { data: roomData, error } = await supabase
      .from('Rooms')
      .select('Admins, Members')
      .eq('id', room)
      .single();

    if (error) {
      console.error('Error fetching room data:', error);
      return NextResponse.json(
        { error: 'Error fetching room data' },
        { status: 500 }
      );
    }

    if (!roomData) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    const isAuthorized =
      roomData.Admins.includes(userEmail) ||
      roomData.Members.includes(userEmail);

    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'User not authorized for this room' },
        { status: 403 }
      );
    }

    const session = liveblocks.prepareSession(userEmail, {
      userInfo: {
        name: user.firstName!,
        email: userEmail,
        avatar: user.imageUrl!,
      },
    });

    session.allow(room, session.FULL_ACCESS);
    const { body, status } = await session.authorize();
    console.log('You are authorized');

    return new Response(body, { status });
  } catch (e) {
    console.error('Error in Liveblocks authentication:', e);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
