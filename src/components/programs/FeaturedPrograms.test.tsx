import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { FeaturedPrograms } from './FeaturedPrograms';
import { Program } from '../../lib/api/types';

const mockPrograms: Program[] = [
  {
    id: '1',
    name: 'Software Engineering',
    description: 'Learn modern software development',
    capacity: 100,
    status: 'active',
    metadata: {
      thumbnail: 'https://example.com/thumbnail1.jpg',
      duration: '12 weeks',
      level: 'intermediate',
      courseCount: 8
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Data Science',
    description: 'Master data analysis and ML',
    capacity: 80,
    status: 'active',
    metadata: {
      thumbnail: 'https://example.com/thumbnail2.jpg',
      duration: '16 weeks',
      level: 'advanced',
      courseCount: 10
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const renderWithRouter = (ui: React.ReactElement) => {
  return render(ui, { wrapper: BrowserRouter });
};

describe('FeaturedPrograms', () => {
  it('renders loading spinner when loading', () => {
    renderWithRouter(<FeaturedPrograms isLoading={true} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders all programs when no filters are applied', () => {
    renderWithRouter(<FeaturedPrograms programs={mockPrograms} />);
    expect(screen.getByText('Software Engineering')).toBeInTheDocument();
    expect(screen.getByText('Data Science')).toBeInTheDocument();
  });

  it('filters programs by search query', () => {
    renderWithRouter(<FeaturedPrograms programs={mockPrograms} />);
    
    const searchInput = screen.getByPlaceholderText(/search programs/i);
    fireEvent.change(searchInput, { target: { value: 'software' } });
    
    expect(screen.getByText('Software Engineering')).toBeInTheDocument();
    expect(screen.queryByText('Data Science')).not.toBeInTheDocument();
  });

  it('filters programs by level', () => {
    renderWithRouter(<FeaturedPrograms programs={mockPrograms} />);
    
    const levelSelect = screen.getByRole('combobox');
    fireEvent.change(levelSelect, { target: { value: 'advanced' } });
    
    expect(screen.queryByText('Software Engineering')).not.toBeInTheDocument();
    expect(screen.getByText('Data Science')).toBeInTheDocument();
  });

  it('shows empty state when no programs match filters', () => {
    renderWithRouter(<FeaturedPrograms programs={mockPrograms} />);
    
    const searchInput = screen.getByPlaceholderText(/search programs/i);
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    
    expect(screen.getByText(/no programs match/i)).toBeInTheDocument();
  });

  it('navigates to program detail when clicking view program', () => {
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate
    }));

    renderWithRouter(<FeaturedPrograms programs={mockPrograms} />);
    
    const viewButtons = screen.getAllByText('View Program');
    fireEvent.click(viewButtons[0]);
    
    expect(mockNavigate).toHaveBeenCalledWith('/programs/1');
  });
});