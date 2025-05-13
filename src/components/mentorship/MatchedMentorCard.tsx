import type { MatchedMentor } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Mail, Percent, MessageSquare } from 'lucide-react';

interface MatchedMentorCardProps {
  mentor: MatchedMentor;
}

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

export default function MatchedMentorCard({ mentor }: MatchedMentorCardProps) {
  const matchScorePercentage = Math.round(mentor.matchScore * 100);

  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-4 bg-muted/30">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary">
            {/* Using DiceBear for consistent placeholder avatars based on name */}
            <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${mentor.name}`} alt={mentor.name} data-ai-hint="professional portrait" />
            <AvatarFallback>{getInitials(mentor.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-lg">{mentor.name}</CardTitle>
            <div className="flex items-center text-sm font-semibold mt-1">
              <Badge variant={matchScorePercentage > 70 ? "default" : "secondary"} className={
                matchScorePercentage > 85 ? "bg-green-600 hover:bg-green-700 text-white" : 
                matchScorePercentage > 60 ? "bg-yellow-500 hover:bg-yellow-600 text-black" : 
                "bg-slate-500 hover:bg-slate-600 text-white"
              }>
                <Percent size={14} className="mr-1" /> {matchScorePercentage}% Match
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div>
          <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-1">Background</h4>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-4">{mentor.background}</p>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-1">Reason for Match</h4>
          <p className="text-sm text-muted-foreground line-clamp-3">{mentor.reason}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t bg-muted/30">
        <Button asChild className="w-full" variant="outline">
          <a href={`mailto:${mentor.contactInfo}`}>
            <Mail size={16} className="mr-2" /> Contact {mentor.name.split(' ')[0]}
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
