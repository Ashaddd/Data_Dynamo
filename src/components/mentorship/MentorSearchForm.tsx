"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { INDUSTRIES, SKILLS_INTERESTS } from '@/lib/constants';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { MentorSearchFilters } from '@/lib/types';

interface MentorSearchFormProps {
  onSearch: (filters: MentorSearchFilters) => void;
  initialFilters?: Partial<MentorSearchFilters>;
}

export default function MentorSearchForm({ onSearch, initialFilters = {} }: MentorSearchFormProps) {
  const [query, setQuery] = useState(initialFilters.query || '');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(initialFilters.industry || []);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(initialFilters.skills || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ query, industry: selectedIndustries, skills: selectedSkills });
  };

  const handleIndustryToggle = (industry: string) => {
    setSelectedIndustries(prev => 
      prev.includes(industry) ? prev.filter(i => i !== industry) : [...prev, industry]
    );
  };

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };
  
  const handleApplyFilters = () => {
     onSearch({ query, industry: selectedIndustries, skills: selectedSkills });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-0 md:flex md:gap-4 items-center p-4 border rounded-lg shadow bg-card">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by name, industry, skills, interests..."
          className="w-full pl-10"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      
      <div className="flex gap-2 flex-wrap md:flex-nowrap">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto">
              <Filter size={16} className="mr-2" /> Industries ({selectedIndustries.length})
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 max-h-80 overflow-y-auto">
            <DropdownMenuLabel>Filter by Industry</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {INDUSTRIES.map((industry) => (
              <DropdownMenuCheckboxItem
                key={industry.value}
                checked={selectedIndustries.includes(industry.value)}
                onCheckedChange={() => handleIndustryToggle(industry.value)}
              >
                {industry.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto">
              <Filter size={16} className="mr-2" /> Skills/Interests ({selectedSkills.length})
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 max-h-80 overflow-y-auto">
            <DropdownMenuLabel>Filter by Skill/Interest</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {SKILLS_INTERESTS.map((skill) => (
              <DropdownMenuCheckboxItem
                key={skill.value}
                checked={selectedSkills.includes(skill.value)}
                onCheckedChange={() => handleSkillToggle(skill.value)}
              >
                {skill.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
         <Button type="button" onClick={handleApplyFilters} className="w-full md:w-auto">
            Apply Filters
        </Button>
      </div>
    </form>
  );
}
