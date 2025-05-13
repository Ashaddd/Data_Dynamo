"use client";

import { useState, useCallback } from 'react';
import MentorSearchForm from '@/components/mentorship/MentorSearchForm';
import MentorList from '@/components/mentorship/MentorList';
import { mockAlumni } from '@/data/alumni'; // Using mock data
import type { Alumni, MentorSearchFilters } from '@/lib/types';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// In a real app, metadata would be static or fetched server-side.
// export const metadata: Metadata = {
//   title: 'Find a Mentor',
//   description: 'Search for alumni mentors based on industry, skills, or interests.',
// };

export default function MentorSearchPage() {
  const [filteredMentors, setFilteredMentors] = useState<Alumni[]>(mockAlumni.filter(a => a.willingToMentor));
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback((filters: MentorSearchFilters) => {
    setIsLoading(true);
    setHasSearched(true);
    // Simulate API call or filtering logic
    setTimeout(() => {
      let results = mockAlumni.filter(alumni => alumni.willingToMentor);

      if (filters.query) {
        const queryLower = filters.query.toLowerCase();
        results = results.filter(
          (alumni) =>
            alumni.name.toLowerCase().includes(queryLower) ||
            (alumni.major && alumni.major.toLowerCase().includes(queryLower)) ||
            (alumni.industry && alumni.industry.toLowerCase().includes(queryLower)) ||
            (alumni.company && alumni.company.toLowerCase().includes(queryLower)) ||
            (alumni.skills && alumni.skills.some(skill => skill.toLowerCase().includes(queryLower))) ||
            (alumni.interests && alumni.interests.some(interest => interest.toLowerCase().includes(queryLower)))
        );
      }

      if (filters.industry && filters.industry.length > 0) {
        results = results.filter(alumni => 
          alumni.industry && filters.industry!.includes(alumni.industry.toLowerCase().replace(/\s+/g, '_'))
        );
      }

      if (filters.skills && filters.skills.length > 0) {
         results = results.filter(alumni =>
          alumni.skills?.some(skill => filters.skills!.includes(skill.toLowerCase().replace(/\s+/g, '_'))) ||
          alumni.interests?.some(interest => filters.skills!.includes(interest.toLowerCase().replace(/\s+/g, '_')))
        );
      }
      
      setFilteredMentors(results);
      setIsLoading(false);
    }, 500); // Simulate delay
  }, []);

  return (
    <div className="space-y-8">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-3xl">Find a Mentor</CardTitle>
          <CardDescription>
            Connect with experienced alumni who are willing to share their knowledge and guide you.
            Use the filters below to find mentors matching your interests.
          </CardDescription>
        </CardHeader>
      </Card>
      
      <MentorSearchForm onSearch={handleSearch} />
      <Separator />

      {isLoading ? (
        <div className="text-center py-10">
          <p className="text-lg text-muted-foreground">Searching for mentors...</p>
          {/* Could add a spinner here */}
        </div>
      ) : (hasSearched || filteredMentors.length > 0) ? (
        <MentorList mentors={filteredMentors} />
      ) : (
         <div className="text-center py-10">
            <p className="text-lg text-muted-foreground">Use the search and filters above to find mentors.</p>
         </div>
      )}
    </div>
  );
}
