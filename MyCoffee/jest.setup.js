// Setup Jest DOM matchers
import '@testing-library/jest-dom';

// Mock Next.js headers()
jest.mock('next/headers', () => {
  return {
    headers: jest.fn().mockReturnValue(new Headers({
      'Authorization': 'Bearer mock_token'
    }))
  };
});

// Mock Clerk authentication
jest.mock('@clerk/nextjs', () => {
  return {
    clerkClient: {
      users: {
        getUser: jest.fn().mockImplementation(() => Promise.resolve({ id: 'user_123' }))
      }
    }
  };
});

// Mock Supabase client with proper typing
jest.mock('@/lib/supabase', () => {
  const mockSupabase = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    mockResolvedValue: jest.fn()
  };
  
  // Properly chain the methods
  mockSupabase.from.mockImplementation(() => mockSupabase);
  mockSupabase.select.mockImplementation(() => mockSupabase);
  mockSupabase.insert.mockImplementation(() => mockSupabase);
  mockSupabase.eq.mockImplementation(() => mockSupabase);
  mockSupabase.order.mockImplementation(() => mockSupabase);
  mockSupabase.limit.mockImplementation(() => mockSupabase);

  return {
    supabase: mockSupabase
  };
});
