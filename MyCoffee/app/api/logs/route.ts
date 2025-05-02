import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { headers } from 'next/headers';
import { verifyToken } from '@clerk/nextjs/server';
import { GET } from './GET';

export { GET };
export async function POST(request: Request) {
  const headersList = headers();
  const { amount, type, notes } = await request.json();
  
  // Get user ID from Clerk
  const authHeader = headersList.get('Authorization');
  if (!authHeader) {
    return NextResponse.json(
      { error: 'Authorization header missing' },
      { status: 401 }
    );
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return NextResponse.json(
      { error: 'Token missing' },
      { status: 401 }
    );
  }

  let userId;
  try {
    if (!process.env.CLERK_SECRET_KEY) {
      throw new Error('CLERK_SECRET_KEY is not set');
    }
    if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
      throw new Error('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set');
    }

    // Clean the full key first
    const cleanPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.replace(/\$+$/, '');
    console.log('Cleaned publishable key:', cleanPublishableKey);
    
    const publishableKeyParts = cleanPublishableKey.split('_');
    console.log('Key parts:', publishableKeyParts);
    
    if (publishableKeyParts.length < 3) {
      throw new Error(`Invalid NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY format. Expected at least 3 parts, got ${publishableKeyParts.length} after splitting: ${publishableKeyParts.join(', ')}`);
    }
    const encodedDomain = (publishableKeyParts.length >= 4 ? publishableKeyParts[3] : publishableKeyParts[2]).replace(/\$+$/, '');
    console.log('Extracted and cleaned encoded domain:', encodedDomain);
    
    // Decode base64 domain if it appears to be encoded
    const domain = encodedDomain.includes('.') ? encodedDomain : 
      Buffer.from(encodedDomain, 'base64').toString('utf8').replace(/\$+$/, '');
    console.log('Decoded domain:', domain);
    
    if (!domain || domain === 'undefined') {
      throw new Error('Could not extract domain from publishable key');
    }
    
    // Decode token to get issuer
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    console.log('Token payload:', payload);
    
    console.log('Verifying token with:', {
      secretKey: !!process.env.CLERK_SECRET_KEY,
      issuer: payload.iss,
      token: token.substring(0, 10) + '...'
    });

    const result = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY as string,
      issuer: payload.iss,
      authorizedParties: [
        'http://localhost:3000',
        'localhost:3000',
        'http://localhost',
        'localhost'
      ]
    });
    
    console.log('Token verification result:', result);
    // Handle both possible response structures from verifyToken
    userId = result.sub || (result.payload as { sub: string })?.sub;
    if (!userId) {
      throw new Error('Could not extract user ID from token verification result');
    }
  } catch (err) {
    console.error('Token verification failed:', err);
    return NextResponse.json(
      { 
        error: 'Invalid or expired token',
        details: err instanceof Error ? err.message : String(err),
        debug: {
          secretKey: !!process.env.CLERK_SECRET_KEY,
          issuer: `https://${process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.split('_')[3]}.clerk.accounts.dev`,
          tokenHeader: token.substring(0, 50) + '...'
        }
      },
      { status: 401 }
    );
  }

  if (!userId) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }

  // Validate input
  if (!amount || !type) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  // Insert log into Supabase
  const { data, error } = await supabase
    .from('caffeine_logs')
    .insert([
      { 
        user_id: userId,
        coffee_type: type,
        serving_size: amount,
        serving_unit: 'ml',
        notes,
        caffeine_amount: Math.round(amount * 0.1) // Approximate caffeine content (10mg per ml)
      }
    ])
    .select();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json(data[0]);
}
