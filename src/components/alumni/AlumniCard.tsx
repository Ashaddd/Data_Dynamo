import type { Alumni } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, GraduationCap, Linkedin, Star, UserCheck, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface AlumniCardProps {
  alumni: Alumni;
}

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

export default function AlumniCard({ alumni }: AlumniCardProps) {
  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <CardHeader className="bg-muted/30 p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-20 w-20 border-2 border-primary">
            <AvatarImage src={alumni.profilePictureUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${alumni.name}`} alt={alumni.name} data-ai-hint="professional portrait" />
            <AvatarFallback>{getInitials(alumni.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-xl mb-1">{alumni.name}</CardTitle>
            <CardDescription className="text-sm text-primary font-medium flex items-center gap-1">
              <Briefcase size={14} /> {alumni.currentRole || 'Role not specified'}
            </CardDescription>
            <CardDescription className="text-xs text-muted-foreground flex items-center gap-1">
              <GraduationCap size={14} /> Class of {alumni.graduationYear} - {alumni.major}
            </CardDescription>
          </div>
          {alumni.isNotable && <Star className="h-5 w-5 text-yellow-500 fill-yellow-400" />}
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        {alumni.bio && <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{alumni.bio}</p>}
        {alumni.achievements && (
            <div className="mb-3">
                <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-1">Key Achievement</h4>
                <p className="text-sm text-muted-foreground line-clamp-2">{alumni.achievements}</p>
            </div>
        )}
        {(alumni.skills && alumni.skills.length > 0) && (
          <div className="mb-2">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-1">Skills</h4>
            <div className="flex flex-wrap gap-1">
              {alumni.skills.slice(0, 3).map((skill) => (
                <Badge key={skill} variant="secondary">{skill}</Badge>
              ))}
              {alumni.skills.length > 3 && <Badge variant="outline">+{alumni.skills.length - 3} more</Badge>}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 border-t bg-muted/30 flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          {alumni.linkedinProfile && (
            <Button variant="outline" size="sm" asChild>
              <Link href={alumni.linkedinProfile} target="_blank" rel="noopener noreferrer">
                <Linkedin size={16} className="mr-1" /> LinkedIn
              </Link>
            </Button>
          )}
           {/* A generic "View Profile" button, could link to a detailed alumni profile page */}
           {/* <Button variant="default" size="sm" asChild>
              <Link href={`/alumni/${alumni.id}`}> 
                <ExternalLink size={16} className="mr-1" /> View Profile
              </Link>
            </Button> */}
        </div>
         {alumni.willingToMentor && (
          <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-white">
            <UserCheck size={14} className="mr-1" /> Willing to Mentor
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
}
