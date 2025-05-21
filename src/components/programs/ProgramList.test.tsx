import { render, screen, fireEvent } from '@testing-library/react';
import { ProgramList } from './ProgramList';
import { Program } from '../../lib/api/types';

const mockPrograms: Program[] = [
  {
    id: '1',
    name: 'Program 1',
    description: 'Description 1',
    capacity: 100,
    status: 'active',
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Add more mock programs...
];

describe('ProgramList', () => {
  it('renders loading state correctly', () => {
    render(<ProgramList programs={[]} isLoading={true} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders programs correctly', () => {
    render(<ProgramList programs={mockPrograms} isLoading={false} />);
    
    mockPrograms.forEach(program => {
      expect(screen.getByText(program.name)).toBeInTheDocument();
      expect(screen.getByText(program.description)).toBeInTheDocument();
    });
  });

  it('handles empty state correctly', () => {
    render(<ProgramList programs={[]} isLoading={false} />);
    expect(screen.getByText(/No programs available/i)).toBeInTheDocument();
  });

  it('filters programs correctly', () => {
    render(<ProgramList programs={mockPrograms} isLoading={false} />);
    
    const searchInput = screen.getByPlaceholderText(/Search programs/i);
    fireEvent.change(searchInput, { target: { value: 'Program 1' } });
    
    expect(screen.getByText('Program 1')).toBeInTheDocument();
    expect(screen.queryByText('Program 2')).not.toBeInTheDocument();
  });
});