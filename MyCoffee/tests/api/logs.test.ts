import { NextRequest } from 'next/server';
import { POST } from '@/app/api/logs/route';
import { supabase } from '@/lib/supabase';

// Mock the supabase client methods
const mockInsert = jest.fn().mockReturnThis();
const mockSelect = jest.fn().mockResolvedValue({ data: [], error: null });

(supabase.from as jest.Mock).mockImplementation(() => ({
  insert: mockInsert.mockImplementation(() => ({
    select: mockSelect
  }))
}));

describe('POST /api/logs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSelect.mockResolvedValue({ data: [], error: null });
  });

  it('should create a new log entry', async () => {
    mockSelect.mockResolvedValueOnce({
      data: [{ id: 'log_123' }],
      error: null
    });

    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        amount: 250,
        type: 'espresso',
        notes: 'Double shot'
      }),
      headers: new Headers({
        'Authorization': 'Bearer mock_token'
      })
    } as unknown as NextRequest;

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.id).toBe('log_123');
    expect(supabase.from).toHaveBeenCalledWith('caffeine_logs');
    expect(mockInsert).toHaveBeenCalledWith([{
      user_id: 'user_123',
      coffee_type: 'espresso',
      serving_size: 250,
      serving_unit: 'ml',
      notes: 'Double shot',
      caffeine_amount: 25
    }]);
  });

  it('should handle errors', async () => {
    mockSelect.mockResolvedValueOnce({
      data: null,
      error: { message: 'Database error' }
    });

    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        amount: 250,
        type: 'espresso'
      }),
      headers: new Headers({
        'Authorization': 'Bearer mock_token'
      })
    } as unknown as NextRequest;

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Database error');
  });
});
