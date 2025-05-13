export interface Alumni {
  id: string;
  name: string;
  email: string;
  graduationYear: number;
  major: string;
  currentRole?: string;
  company?: string;
  industry?: string;
  skills?: string[];
  interests?: string[];
  linkedinProfile?: string;
  bio?: string;
  achievements?: string; // Changed to single string for simplicity
  profilePictureUrl?: string;
  isNotable?: boolean;
  willingToMentor: boolean; // Made non-optional
  contactInfo?: string; // For mentor matching
}

export interface Event {
  id: string;
  title: string;
  date: string; // ISO string or formatted date
  description: string;
  category: 'College Event' | 'Alumni Meetup' | 'Webinar' | 'Workshop' | 'Career Fair';
  location?: string; // "Online" for virtual events
  imageUrl?: string;
  registrationLink?: string;
}

// This type should align with MentorMatchOutput from src/ai/flows/mentor-matcher.ts
export interface MatchedMentor {
  name: string;
  background: string;
  contactInfo: string;
  matchScore: number;
  reason: string;
}

// For forms
export interface ProfileFormData {
  name: string;
  email: string;
  graduationYear: string;
  major: string;
  currentRole?: string;
  company?: string;
  industry?: string;
  skills?: string[];
  interests?: string[];
  linkedinProfile?: string;
  bio?: string;
  achievements?: string;
  willingToMentor: boolean;
}

export interface RegistrationFormData extends ProfileFormData {
  password?: string; // Optional for profile update
  confirmPassword?: string;
}

export interface MentorSearchFilters {
  query: string; // Combined search for industry, skills, interests
  industry?: string[];
  skills?: string[];
}
