// src/components/alumni/AlumniDetailModal.tsx
"use client";

import type { Alumni } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  // DialogDescription, // No longer using DialogDescription directly for the problematic content
  DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, GraduationCap, Linkedin, Mail, Building, Star, CalendarDays, BookOpen, Award as AwardIcon, Sparkles, User, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AlumniDetailModalProps {
  alumni: Alumni;
  isOpen: boolean;
  onClose: () => void;
}

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

const getMajorLabel = (majorValue?: string) => {
    // In a real app, you might fetch MAJORS_DEPARTMENTS or have it available
    // For now, simple transformation
    if (!majorValue) return 'N/A';
    return majorValue.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export default function AlumniDetailModal({ alumni, isOpen, onClose }: AlumniDetailModalProps) {
  if (!alumni) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-start gap-4">
            <Avatar className="h-24 w-24 border-2 border-primary shadow-md">
              <AvatarImage src={alumni.profilePictureUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${alumni.name}`} alt={alumni.name} data-ai-hint="professional portrait" />
              <AvatarFallback>{getInitials(alumni.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <DialogTitle className="text-3xl font-bold mb-1">{alumni.name}</DialogTitle>
              {alumni.isNotable && (
                <Badge variant="default" className="mb-2 bg-yellow-500 hover:bg-yellow-600">
                  <Star size={14} className="mr-1" /> Notable Alumnus/Alumna
                </Badge>
              )}
              {/* Container for descriptive elements, styled to mimic DialogDescription */}
              <div className="text-base text-muted-foreground">
                <div className="flex items-center gap-2 mb-1">
                  <Briefcase size={16} className="text-primary" /> 
                  <span>{alumni.currentRole || 'Role not specified'} at {alumni.company || 'Company not specified'}</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <GraduationCap size={16} className="text-primary" /> 
                  <span>Class of {alumni.graduationYear} - {getMajorLabel(alumni.major)}</span>
                </div>
                {alumni.industry && (
                    <div className="flex items-center gap-2">
                        <Building size={16} className="text-primary" />
                        <span>Industry: {alumni.industry}</span>
                    </div>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-grow overflow-y-auto px-6 py-4">
          <div className="space-y-6">
            {alumni.bio && (
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><User size={20} className="text-primary"/> About Me</h3>
                <p className="text-sm text-foreground whitespace-pre-wrap">{alumni.bio}</p>
              </div>
            )}

            {alumni.achievements && (
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><AwardIcon size={20} className="text-primary"/> Notable Achievements</h3>
                <p className="text-sm text-foreground whitespace-pre-wrap">{alumni.achievements}</p>
              </div>
            )}

            {(alumni.skills && alumni.skills.length > 0) && (
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><Sparkles size={20} className="text-primary"/> Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {alumni.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-sm">{skill}</Badge>
                  ))}
                </div>
              </div>
            )}

            {(alumni.interests && alumni.interests.length > 0) && (
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><BookOpen size={20} className="text-primary"/> Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {alumni.interests.map((interest) => (
                    <Badge key={interest} variant="outline" className="text-sm">{interest}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {alumni.willingToMentor && (
                <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-white text-sm p-2">
                    <GraduationCap size={16} className="mr-2" /> Willing to Mentor
                </Badge>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 border-t bg-muted/50 flex flex-row justify-between items-center">
          <div className="flex gap-2">
            {alumni.linkedinProfile && (
              <Button variant="outline" size="sm" asChild>
                <Link href={alumni.linkedinProfile} target="_blank" rel="noopener noreferrer">
                  <Linkedin size={16} className="mr-1" /> LinkedIn
                </Link>
              </Button>
            )}
            {alumni.contactInfo && (
              <Button variant="outline" size="sm" asChild>
                <a href={`mailto:${alumni.contactInfo}`}>
                  <Mail size={16} className="mr-1" /> Contact
                </a>
              </Button>
            )}
          </div>
          <Button variant="default" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
