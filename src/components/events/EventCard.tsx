import type { Event } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, MapPin, ExternalLink, Ticket } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const formattedDate = format(new Date(event.date), "MMMM d, yyyy 'at' h:mm a");

  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      {event.imageUrl && (
        <div className="relative h-48 w-full">
          <Image
            src={event.imageUrl}
            alt={event.title}
            layout="fill"
            objectFit="cover"
            data-ai-hint="event banner"
          />
        </div>
      )}
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl mb-1">{event.title}</CardTitle>
          <Badge variant="outline" className="text-xs whitespace-nowrap">{event.category}</Badge>
        </div>
        <div className="flex items-center text-sm text-muted-foreground gap-2">
          <CalendarDays size={16} />
          <span>{formattedDate}</span>
        </div>
        {event.location && (
          <div className="flex items-center text-sm text-muted-foreground gap-2">
            <MapPin size={16} />
            <span>{event.location}</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardDescription className="line-clamp-3">{event.description}</CardDescription>
      </CardContent>
      <CardFooter className="p-4 border-t bg-muted/30">
        {event.registrationLink ? (
          <Button asChild className="w-full">
            <Link href={event.registrationLink} target="_blank" rel="noopener noreferrer">
              <Ticket size={16} className="mr-2" /> Register / Details
            </Link>
          </Button>
        ) : (
           <Button variant="outline" disabled className="w-full">
             Details Forthcoming
           </Button>
        )}
      </CardFooter>
    </Card>
  );
}
