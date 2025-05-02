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

    // Fetch recent logs to analyze consumption patterns
    const { data: logs, error: logsError } = await supabase
      .from('caffeine_logs')
      .select('coffee_type, caffeine_amount, timestamp')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(10);

    if (logsError) {
      return NextResponse.json({ error: logsError.message }, { status: 400 });
    }

    // Simple recommendation logic (can be enhanced later)
    const totalRecent = logs.reduce((sum, log) => sum + (log.caffeine_amount || 0), 0);
    const avgRecent = totalRecent / logs.length || 0;
    
    let recommendation = '';
    if (avgRecent > 300) {
      recommendation = 'Consider reducing your caffeine intake. Try switching to decaf or herbal tea.';
    } else if (avgRecent < 100) {
      recommendation = 'You might enjoy a stronger brew today. Try a medium or dark roast.';
    } else {
      recommendation = 'Your consumption is balanced. A light roast would be perfect right now.';
    }

    return NextResponse.json({
      recommendation,
      stats: {
        average: avgRecent,
        totalRecent
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}
