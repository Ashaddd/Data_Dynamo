// src/components/alumni/NotableAlumniList.tsx
"use client";

import type { Alumni } from '@/lib/types';
import AlumniCard from './AlumniCard';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Search } from 'lucide-react';
import AlumniDetailModal from './AlumniDetailModal'; // Import the new modal component

interface NotableAlumniListProps {
  alumni: Alumni[];
}

export default function NotableAlumniList({ alumni }: NotableAlumniListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlumni, setSelectedAlumni] = useState<Alumni | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredAlumni = alumni.filter(
    (alum) =>
      alum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (alum.industry && alum.industry.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (alum.company && alum.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (alum.currentRole && alum.currentRole.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (alum.skills && alum.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const handleAlumniCardClick = (alum: Alumni) => {
    setSelectedAlumni(alum);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAlumni(null);
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by name, role, company, industry, skills..."
          className="w-full pl-10 shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {filteredAlumni.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlumni.map((alum) => (
            <AlumniCard key={alum.id} alumni={alum} onClick={() => handleAlumniCardClick(alum)} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-8">
          No notable alumni found matching your search criteria in this section.
        </p>
      )}

      {selectedAlumni && (
        <AlumniDetailModal
          alumni={selectedAlumni}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
