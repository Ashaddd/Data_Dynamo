
import type { AppNotification } from '@/lib/types';

export const mockNotifications: AppNotification[] = [
  {
    id: '1',
    type: 'event',
    title: 'Upcoming: Annual Alumni Gala',
    message: 'Don\'t forget to register for the Annual Alumni Homecoming Gala next week!',
    timestamp: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), // 1 day ago
    read: false,
    link: '/dashboard/events',
  },
  {
    id: '2',
    type: 'message',
    title: 'New Message from John Doe',
    message: 'Hey, I saw your profile and would love to connect regarding mentorship opportunities...',
    timestamp: new Date(new Date().setHours(new Date().getHours() - 2)).toISOString(), // 2 hours ago
    read: false,
    link: '/dashboard/messages', // Placeholder link
    sender: {
      id: 'user123',
      name: 'John Doe',
      avatarUrl: 'https://picsum.photos/seed/johndoe/40/40'
    }
  },
  {
    id: '3',
    type: 'system',
    title: 'Profile Update Reminder',
    message: 'Your profile is 80% complete. Consider adding your latest achievements.',
    timestamp: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(), // 3 days ago
    read: true,
    link: '/dashboard/profile',
  },
  {
    id: '4',
    type: 'event',
    title: 'Workshop Starting Soon: Idea to Launch',
    message: 'The Entrepreneurship Workshop starts in 1 hour. Make sure you have the link.',
    timestamp: new Date(new Date().setMinutes(new Date().getMinutes() - 30)).toISOString(), // 30 minutes ago
    read: false,
    link: '/dashboard/events',
  },
   {
    id: '5',
    type: 'message',
    title: 'Mentorship Request from Jane Smith',
    message: 'Hi, I am a current student and I am interested in your career path. Would you be open to a quick chat?',
    timestamp: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), // 2 days ago
    read: true,
    link: '/dashboard/mentorship/requests', // Placeholder link
    sender: {
      id: 'user456',
      name: 'Jane Smith',
      avatarUrl: 'https://picsum.photos/seed/janesmith/40/40'
    }
  },
];
