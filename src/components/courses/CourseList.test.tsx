import { render, screen, fireEvent } from '@testing-library/react';
import { CourseList } from './CourseList';
import { Course } from '../../lib/api/types';

const mockCourses: Course[] = [
  {
    id: '1',
    program_id: 'prog1',
    name: 'Introduction to Programming',
    description: 'Learn programming fundamentals',
    credits: 3,
    duration: '12 weeks',
    prerequisites: [],
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    program_id: 'prog1',
    name: 'Web Development',
    description: 'Master web technologies',
    credits: 4,
    duration: '16 weeks',
    prerequisites: ['1'],
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

describe('CourseList', () => {
  it('renders loading spinner when loading', () => {
    render(<CourseList isLoading={true} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders empty state when no courses are available', () => {
    render(<CourseList courses={[]} />);
    expect(screen.getByText(/no courses available/i)).toBeInTheDocument();
  });

  it('renders all courses', () => {
    render(<CourseList courses={mockCourses} />);
    
    mockCourses.forEach(course => {
      expect(screen.getByText(course.name)).toBeInTheDocument();
      expect(screen.getByText(course.description)).toBeInTheDocument();
      expect(screen.getByText(course.duration)).toBeInTheDocument();
      expect(screen.getByText(`${course.credits} credits`)).toBeInTheDocument();
    });
  });

  it('calls onCourseClick with course id when clicking view button', () => {
    const handleClick = jest.fn();
    render(<CourseList courses={mockCourses} onCourseClick={handleClick} />);
    
    const viewButtons = screen.getAllByText('View Course');
    fireEvent.click(viewButtons[0]);
    
    expect(handleClick).toHaveBeenCalledWith(mockCourses[0].id);
  });

  it('does not render view buttons when onCourseClick is not provided', () => {
    render(<CourseList courses={mockCourses} />);
    expect(screen.queryByText('View Course')).not.toBeInTheDocument();
  });
});