"use client";

import type { Event } from '@/lib/types';
import EventCard from './EventCard';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search } from 'lucide-react';

interface EventListProps {
  events: Event[];
}

const EVENT_CATEGORIES: Event['category'][] = ['College Event', 'Alumni Meetup', 'Webinar', 'Workshop', 'Career Fair'];

export default function EventList({ events }: EventListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const upcomingEvents = events
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const pastEvents = events
    .filter(event => new Date(event.date) < new Date())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());


  const filterEvents = (eventList: Event[]) => {
    return eventList.filter(
      (event) =>
        (event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedCategory === 'all' || event.category === selectedCategory)
    );
  };
  
  const filteredUpcomingEvents = filterEvents(upcomingEvents);
  const filteredPastEvents = filterEvents(pastEvents);


  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search events by title or keyword..."
            className="w-full pl-10 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-[200px] shadow-sm">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {EVENT_CATEGORIES.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {filteredUpcomingEvents.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUpcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}

      {filteredPastEvents.length > 0 && searchTerm === '' && selectedCategory === 'all' && ( // Show past events only if no filters applied
         <div>
          <h2 className="text-2xl font-semibold mb-4 text-foreground mt-12">Past Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75">
            {filteredPastEvents.slice(0,3).map((event) => ( // Show limited past events
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}

      {filteredUpcomingEvents.length === 0 && filteredPastEvents.length === 0 && (
         <p className="text-center text-muted-foreground py-8">
          No events found matching your criteria.
        </p>
      )}
       {filteredUpcomingEvents.length === 0 && searchTerm !== '' && (
         <p className="text-center text-muted-foreground py-8">
          No upcoming events found matching your criteria.
        </p>
      )}
    </div>
  );
}
