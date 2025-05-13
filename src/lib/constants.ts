import type { LucideIcon } from 'lucide-react';
import { Home, Users, CalendarDays, Search, UserPlus, LogIn, Award, UserCog, BrainCircuit, Briefcase, GraduationCap, Building } from 'lucide-react';
import type { Alumni } from './types'; // For MOCK_ALUMNI_PROFILES_FOR_AI type if needed

export const SITE_NAME = "Nexus Alumni";
export const SITE_DESCRIPTION = "Connecting students and alumni, fostering mentorship, and building a stronger community.";

interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
  authRequired?: boolean;
  publicOnly?: boolean; // Only visible when not authenticated
  hideWhenAuth?: boolean; // Hidden when authenticated
}

export const MAIN_NAVIGATION_PUBLIC: NavLink[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/#features', label: 'Features', icon: Briefcase },
  { href: '/#contact', label: 'Contact', icon: Users }
];

export const AUTH_NAVIGATION: NavLink[] = [
  { href: '/login', label: 'Login', icon: LogIn, hideWhenAuth: true },
  { href: '/register', label: 'Register', icon: UserPlus, hideWhenAuth: true },
];

// For user dropdown or authenticated specific nav items in header
export const USER_HEADER_NAVIGATION: NavLink[] = [
   { href: '/dashboard', label: 'Dashboard', icon: Home, authRequired: true },
   { href: '/dashboard/profile', label: 'My Profile', icon: UserCog, authRequired: true },
];


export const DASHBOARD_NAVIGATION: NavLink[] = [
    { href: '/dashboard', label: 'Overview', icon: Home },
    { href: '/dashboard/profile', label: 'My Profile', icon: UserCog },
    { href: '/dashboard/notable-alumni', label: 'Notable Alumni', icon: Award },
    { href: '/dashboard/events', label: 'Events & News', icon: CalendarDays },
    { href: '/dashboard/mentorship/search', label: 'Find Mentor', icon: Search },
    { href: '/dashboard/mentorship/match', label: 'AI Mentor Match', icon: BrainCircuit },
];

export const MOCK_ALUMNI_PROFILES_FOR_AI: { name: string; background: string; contactInfo: string }[] = [
  { name: "Dr. Eleanor Vance", background: "Lead AI Ethicist at FutureForward AI, PhD in Philosophy specializing in machine learning ethics. Keynote speaker on responsible AI development.", contactInfo: "eleanor.vance@example.com" },
  { name: "Marcus Chen", background: "Senior Data Scientist at QuantumLeap Analytics, expert in predictive modeling and big data infrastructure (Spark, Hadoop). Passionate about sustainable tech.", contactInfo: "marcus.chen@example.com" },
  { name: "Aisha Khan", background: "Founder & CTO of 'ConnectSphere', a social impact tech startup. Expertise in mobile app development, UI/UX for accessibility, and non-profit tech.", contactInfo: "aisha.khan@example.com" },
  { name: "Dr. Ben Carter", background: "Biotechnology Researcher at GenLife Institute, focused on gene editing technologies (CRISPR). Published in Nature and Science journals.", contactInfo: "ben.carter@example.com" },
  { name: "Sofia Ramirez", background: "Chief Marketing Officer at EcoBrand, a global sustainable goods company. Expertise in digital marketing, brand strategy, and corporate social responsibility.", contactInfo: "sofia.ramirez@example.com" },
  { name: "James Lee", background: "Principal Architect at UrbanScape Designs, specializing in sustainable urban planning and green building technologies. LEED AP certified.", contactInfo: "james.lee@example.com" },
  { name: "Priya Sharma", background: "Cybersecurity Analyst at SecureNet Solutions, expert in threat detection and incident response. Holds CISSP and CISM certifications.", contactInfo: "priya.sharma@example.com" }
];

export const INDUSTRIES = [
  { value: "technology", label: "Technology" },
  { value: "healthcare", label: "Healthcare" },
  { value: "finance", label: "Finance" },
  { value: "education", label: "Education" },
  { value: "engineering", label: "Engineering" },
  { value: "arts_entertainment", label: "Arts & Entertainment" },
  { value: "non_profit", label: "Non-profit / Social Impact" },
  { value: "consulting", label: "Consulting" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "government", label: "Government / Public Sector" },
  { value: "other", label: "Other" },
];

export const SKILLS_INTERESTS = [
  { value: "software_development", label: "Software Development" },
  { value: "data_science", label: "Data Science" },
  { value: "project_management", label: "Project Management" },
  { value: "marketing", label: "Marketing" },
  { value: "ux_ui_design", label: "UX/UI Design" },
  { value: "entrepreneurship", label: "Entrepreneurship" },
  { value: "research", label: "Research" },
  { value: "leadership", label: "Leadership" },
  { value: "public_speaking", label: "Public Speaking" },
  { value: "sustainability", label: "Sustainability" },
  { value: "artificial_intelligence", label: "Artificial Intelligence" },
  { value: "web_development", label: "Web Development" },
  { value: "mobile_development", label: "Mobile Development" },
  { value: "product_management", label: "Product Management" },
  { value: "other", label: "Other" },
];

export const GRADUATION_YEAR_OPTIONS = Array.from({ length: 70 }, (_, i) => { // Increased range
  const year = new Date().getFullYear() - i;
  return { value: year.toString(), label: year.toString() };
});

export const EXPECTED_GRADUATION_YEAR_OPTIONS = Array.from({ length: 10 }, (_, i) => { // For students, current year + next few years
  const year = new Date().getFullYear() + i;
  return { value: year.toString(), label: year.toString() };
});

export const MAJORS_DEPARTMENTS = [
  { value: "computer_science", label: "Computer Science" },
  { value: "business_administration", label: "Business Administration" },
  { value: "electrical_engineering", label: "Electrical Engineering" },
  { value: "mechanical_engineering", label: "Mechanical Engineering" },
  { value: "civil_engineering", label: "Civil Engineering" },
  { value: "biology", label: "Biology" },
  { value: "chemistry", label: "Chemistry" },
  { value: "physics", label: "Physics" },
  { value: "mathematics", label: "Mathematics" },
  { value: "psychology", label: "Psychology" },
  { value: "economics", label: "Economics" },
  { value: "political_science", label: "Political Science" },
  { value: "history", label: "History" },
  { value: "english_literature", label: "English Literature" },
  { value: "fine_arts", label: "Fine Arts" },
  { value: "communications", label: "Communications" },
  { value: "nursing", label: "Nursing" },
  { value: "public_health", label: "Public Health" },
  { value: "environmental_science", label: "Environmental Science" },
  { value: "other", label: "Other" },
];
