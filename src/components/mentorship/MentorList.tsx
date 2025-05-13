import type { Alumni } from '@/lib/types';
import AlumniCard from '../alumni/AlumniCard';

interface MentorListProps {
  mentors: Alumni[];
}

export default function MentorList({ mentors }: MentorListProps) {
  if (mentors.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-muted-foreground">No mentors found matching your criteria.</p>
        <p className="text-sm text-muted-foreground">Try broadening your search or checking back later.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mentors.map((mentor) => (
        <AlumniCard key={mentor.id} alumni={mentor} />
      ))}
    </div>
  );
}
