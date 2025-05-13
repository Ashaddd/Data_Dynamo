
export interface Alumni {
  id: string; // Corresponds to Firebase Auth UID in a real app
  uid?: string; // Can be same as id, or specific Firebase UID field
  name: string;
  email: string;
  userType: 'alumni'; 
  graduationYear: number;
  major: string;
  currentRole?: string;
  company?: string;
  industry?: string;
  skills?: string[];
  interests?: string[];
  linkedinProfile?: string;
  bio?: string;
  achievements?: string; 
  profilePictureUrl?: string;
  isNotable?: boolean;
  willingToMentor: boolean; 
  contactInfo?: string; 
  createdAt?: any; // Firestore Timestamp
  updatedAt?: any; // Firestore Timestamp
}

export interface Event {
  id: string;
  title: string;
  date: string; 
  description: string;
  category: 'College Event' | 'Alumni Meetup' | 'Webinar' | 'Workshop' | 'Career Fair';
  location?: string; 
  imageUrl?: string;
  registrationLink?: string;
}

export interface MatchedMentor {
  name: string;
  background: string;
  contactInfo: string;
  matchScore: number;
  reason: string;
}

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
  // Optional fields that might be part of the Firestore document but not strictly BaseProfile
  profilePictureUrl?: string;
  isNotable?: boolean;
  contactInfo?: string;
  createdAt?: any; 
  updatedAt?: any; 
}

export type ProfileFormData = BaseProfileData & (
  | { userType: 'student'; expectedGraduationYear: string; graduationYear?: never; uid?: string; id?: string; }
  | { userType: 'alumni'; graduationYear: string; expectedGraduationYear?: never; uid?: string; id?: string; }
);


export type RegistrationFormData = ProfileFormData & {
  password?: string; 
  confirmPassword?: string;
  userId?: string; // For passing client-generated ID to server action if needed for mock
};


export interface MentorSearchFilters {
  query: string; 
  industry?: string[];
  skills?: string[];
}
