import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { headers } from 'next/headers';
import { clerkClient } from '@clerk/nextjs';

export async function GET(request: Request) {
  const headersList = headers();
  
  try {
    // Get user ID from Clerk
    const authHeader = headersList.get('Authorization');
    const userId = await clerkClient.users.getUser(authHeader?.split(' ')[1] || '').then(user => user.id);

    // Fetch logs from Supabase
    const { data, error } = await supabase
      .from('caffeine_logs')
      .select('id, coffee_type, serving_size, serving_unit, notes, timestamp')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const response = NextResponse.json(data);
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    response.headers.set('Vary', 'Authorization');
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch logs' },
      { status: 500 }
    );
  }
}
