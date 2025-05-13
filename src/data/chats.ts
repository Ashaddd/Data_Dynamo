
import type { ChatConversation } from '@/lib/types';

export const mockChatConversations: ChatConversation[] = [
  {
    id: 'chat1',
    participant: {
      id: 'student101',
      name: 'Alice Wonderland',
      avatarUrl: 'https://picsum.photos/seed/alicechat/40/40',
      type: 'student',
    },
    lastMessage: {
      text: "That sounds great! I'll prepare my questions.",
      timestamp: new Date(new Date().setHours(new Date().getHours() - 1)).toISOString(), // 1 hour ago
      isReadByCurrentUser: false,
    },
    unreadCount: 2,
  },
  {
    id: 'chat2',
    participant: {
      id: 'alumni007',
      name: 'Bob The Builder',
      avatarUrl: 'https://picsum.photos/seed/bobchat/40/40',
      type: 'alumni',
    },
    lastMessage: {
      text: 'Yes, I can definitely help with that. Let me send you some resources.',
      timestamp: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), // 1 day ago
      isReadByCurrentUser: true,
    },
    unreadCount: 0,
  },
  {
    id: 'chat3',
    participant: {
      id: 'student202',
      name: 'Charlie Brown',
      avatarUrl: 'https://picsum.photos/seed/charliechat/40/40',
      type: 'student',
    },
    lastMessage: {
      text: 'Thanks for the advice, it was really helpful!',
      timestamp: new Date(new Date().setMinutes(new Date().getMinutes() - 15)).toISOString(), // 15 minutes ago
      isReadByCurrentUser: false,
    },
    unreadCount: 1,
  },
  {
    id: 'chat4',
    participant: {
      id: 'alumni002',
      name: 'Diana Prince',
      avatarUrl: 'https://picsum.photos/seed/dianachat/40/40',
      type: 'alumni',
    },
    lastMessage: {
      text: 'Are you available for a quick call tomorrow?',
      timestamp: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), // 2 days ago
      isReadByCurrentUser: true,
    },
    unreadCount: 0,
  },
  {
    id: 'chat5',
    participant: {
      id: 'student303',
      name: 'Edward Scissorhands',
      avatarUrl: 'https://picsum.photos/seed/edwardchat/40/40',
      type: 'student',
    },
    lastMessage: {
      text: 'Okay, looking forward to our meeting.',
      timestamp: new Date(new Date().setHours(new Date().getHours() - 5)).toISOString(), // 5 hours ago
      isReadByCurrentUser: true,
    },
    unreadCount: 0,
  },
  {
    id: 'chat6',
    participant: {
      id: 'alumni010',
      name: 'Fiona Apple',
      avatarUrl: 'https://picsum.photos/seed/fionachat/40/40',
      type: 'alumni',
    },
    lastMessage: {
      text: "I've attached the document you requested.",
      timestamp: new Date(new Date().setMinutes(new Date().getMinutes() - 5)).toISOString(), // 5 mins ago
      isReadByCurrentUser: false,
    },
    unreadCount: 3,
  },
];
