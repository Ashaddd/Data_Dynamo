import EventList from '@/components/events/EventList';
import { mockEvents } from '@/data/events';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Events & News',
  description: 'Stay updated with the latest college events, alumni meetups, and news from Nexus Alumni.',
};

export default function EventsPage() {
  // In a real app, this data would be fetched from an API
  const events = mockEvents;

  return (
    <div className="space-y-8">
       <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-3xl">Events & News</CardTitle>
          <CardDescription>
            Stay informed about upcoming college events, alumni gatherings, workshops, and important announcements.
          </CardDescription>
        </CardHeader>
      </Card>
      <EventList events={events} />
    </div>
  );
}
