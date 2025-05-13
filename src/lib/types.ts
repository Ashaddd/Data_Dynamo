export interface Alumni {
  id: string;
  name: string;
  email: string;
  userType: 'alumni'; // Alumni will always be 'alumni'
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

// For forms - base data for both student and alumni
interface BaseProfileData {
  name: string;
  email: string;
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

// Specific fields for student and alumni profiles
export type ProfileFormData = BaseProfileData & (
  | { userType: 'student'; expectedGraduationYear: string; graduationYear?: never }
  | { userType: 'alumni'; graduationYear: string; expectedGraduationYear?: never }
);


export type RegistrationFormData = ProfileFormData & {
  password?: string; 
  confirmPassword?: string;
};


export interface MentorSearchFilters {
  query: string; // Combined search for industry, skills, interests
  industry?: string[];
  skills?: string[];
}
