import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import NewLogPage from '@/app/(app)/logs/new/page';

jest.mock('@/components/logging/quick-log-form', () => ({
  QuickLogForm: () => <div data-testid="quick-log-form" />
}));

describe('NewLogPage', () => {
  it('renders the page title and form', () => {
    render(<NewLogPage />);
    
    expect(screen.getByText('New Coffee Log')).toBeInTheDocument();
    expect(screen.getByTestId('quick-log-form')).toBeInTheDocument();
  });
});
