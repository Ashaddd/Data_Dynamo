import type { Event } from '@/lib/types';

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Annual Alumni Homecoming Gala',
    date: new Date(new Date().getFullYear(), 9, 15, 18, 0).toISOString(), // October 15th
    description: 'Join us for an evening of celebration, networking, and reminiscing. Keynote speech by a distinguished alumnus.',
    category: 'Alumni Meetup',
    location: 'Grand Ballroom, University Campus',
    imageUrl: 'https://picsum.photos/seed/gala/400/250',
    registrationLink: '#',
  },
  {
    id: '2',
    title: 'Tech Innovators Summit 2024',
    date: new Date(new Date().getFullYear(), 10, 5, 9, 0).toISOString(), // November 5th
    description: 'A full-day summit featuring talks and workshops by alumni leaders in the tech industry. Explore the latest trends and network with peers.',
    category: 'College Event',
    location: 'Science & Engineering Hall Auditorium',
    imageUrl: 'https://picsum.photos/seed/techsummit/400/250',
    registrationLink: '#',
  },
  {
    id: '3',
    title: 'Webinar: Career Pivoting Strategies',
    date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 10, 14, 0).toISOString(), // 10th of next month
    description: 'Learn effective strategies for navigating career changes from alumni who have successfully pivoted their careers.',
    category: 'Webinar',
    location: 'Online',
    imageUrl: 'https://picsum.photos/seed/webinar/400/250',
    registrationLink: '#',
  },
  {
    id: '4',
    title: 'Entrepreneurship Workshop: Idea to Launch',
    date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 22, 10, 0).toISOString(), // 22nd of next month
    description: 'A hands-on workshop for aspiring entrepreneurs, led by successful alumni founders. Covers business planning, funding, and more.',
    category: 'Workshop',
    location: 'Innovation Hub, Room 201',
    imageUrl: 'https://picsum.photos/seed/workshop/400/250',
  },
  {
    id: '5',
    title: 'Alumni Career Fair',
    date: new Date(new Date().getFullYear() + 1, 2, 1, 13, 0).toISOString(), // March 1st of next year
    description: 'Connect with companies founded or led by alumni. Explore job opportunities and internships.',
    category: 'Career Fair',
    location: 'University Gymnasium',
    imageUrl: 'https://picsum.photos/seed/careerfair/400/250',
    registrationLink: '#',
  },
];
