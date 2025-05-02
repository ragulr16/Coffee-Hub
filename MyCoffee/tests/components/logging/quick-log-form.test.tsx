import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useAuth } from '@clerk/nextjs';
import { QuickLogForm } from '@/components/logging/quick-log-form';
import '@testing-library/jest-dom';
import { useToast } from '@/hooks/use-toast';

// Mock dependencies
jest.mock('@clerk/nextjs', () => ({
  useAuth: jest.fn(() => ({
    getToken: jest.fn().mockResolvedValue('mock_token')
  }))
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(() => ({
    toast: jest.fn()
  }))
}));

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
) as jest.Mock;

describe('QuickLogForm', () => {
  const mockToast = jest.fn();

  beforeEach(() => {
    (useToast as jest.Mock).mockImplementation(() => ({ toast: mockToast }));
    (fetch as jest.Mock).mockClear();
    mockToast.mockClear();
  });

  it('renders all form fields', () => {
    render(<QuickLogForm />);
    
    expect(screen.getByLabelText('Coffee Type')).toBeInTheDocument();
    expect(screen.getByLabelText('Brew Method')).toBeInTheDocument();
    expect(screen.getByLabelText('Serving Size')).toBeInTheDocument();
    expect(screen.getByLabelText('Unit')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log coffee/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<QuickLogForm />);
    
    fireEvent.click(screen.getByRole('button', { name: /log coffee/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Coffee type is required')).toBeInTheDocument();
      expect(screen.getByText('Brew method is required')).toBeInTheDocument();
    });
  });

  it('submits the form successfully', async () => {
    render(<QuickLogForm />);
    
    // Fill out form
    fireEvent.change(screen.getByLabelText('Serving Size'), { target: { value: '12' } });
    
    // Mock select interactions
    const selectTriggers = screen.getAllByRole('combobox');
    fireEvent.mouseDown(selectTriggers[0]); // Coffee Type
    fireEvent.click(screen.getByText('Arabica'));
    fireEvent.mouseDown(selectTriggers[1]); // Brew Method
    fireEvent.click(screen.getByText('Pour Over'));
    fireEvent.mouseDown(selectTriggers[3]); // Unit
    fireEvent.click(screen.getByText('ml'));

    fireEvent.click(screen.getByRole('button', { name: /log coffee/i }));
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock_token',
        },
        body: JSON.stringify({
          amount: 12,
          type: 'Arabica (Pour Over)',
          notes: ''
        }),
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: "Coffee logged successfully!",
        description: "Logged 12 ml of Arabica (Pour Over)"
      });
    });
  });

  it('shows loading state during submission', async () => {
    render(<QuickLogForm />);
    
    // Fill out minimal form
    fireEvent.change(screen.getByLabelText('Serving Size'), { target: { value: '8' } });
    const selectTriggers = screen.getAllByRole('combobox');
    fireEvent.mouseDown(selectTriggers[0]);
    fireEvent.click(screen.getByText('Espresso'));
    fireEvent.mouseDown(selectTriggers[1]);
    fireEvent.click(screen.getByText('Aeropress'));

    fireEvent.click(screen.getByRole('button', { name: /log coffee/i }));
    
    expect(screen.getByText('Logging...')).toBeInTheDocument();
  });

  it('handles API errors', async () => {
    (fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error('API error'))
    );

    render(<QuickLogForm />);
    
    // Fill out minimal form
    fireEvent.change(screen.getByLabelText('Serving Size'), { target: { value: '8' } });
    const selectTriggers = screen.getAllByRole('combobox');
    fireEvent.mouseDown(selectTriggers[0]);
    fireEvent.click(screen.getByText('Arabica'));
    fireEvent.mouseDown(selectTriggers[1]);
    fireEvent.click(screen.getByText('Espresso'));

    fireEvent.click(screen.getByRole('button', { name: /log coffee/i }));
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Error logging coffee",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    });
  });
});
