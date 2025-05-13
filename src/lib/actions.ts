"use server";

import { z } from "zod";
import { mentorMatch } from "@/ai/flows/mentor-matcher";
import type { MentorMatchInput, MentorMatchOutput } from "@/ai/flows/mentor-matcher";
import { MOCK_ALUMNI_PROFILES_FOR_AI } from "./constants"; // Using mock data for alumni profiles
import type { RegistrationFormData as RegistrationFormDataType, ProfileFormData as ProfileFormDataType } from "./types"; // Renamed to avoid conflict

// Schema for AI Mentor Match form
const AiMentorMatchFormSchema = z.object({
  studentCareerInterests: z.string().min(10, { message: "Please describe your career interests in at least 10 characters." }),
});

export async function handleAiMentorMatch(prevState: any, formData: FormData): Promise<{ message?: string; matches?: MentorMatchOutput; error?: string }> {
  const validatedFields = AiMentorMatchFormSchema.safeParse({
    studentCareerInterests: formData.get('studentCareerInterests'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.studentCareerInterests?.join(", ") || "Invalid input."
    };
  }

  const input: MentorMatchInput = {
    studentCareerInterests: validatedFields.data.studentCareerInterests,
    alumniProfiles: MOCK_ALUMNI_PROFILES_FOR_AI, // In a real app, fetch this from DB based on opt-in
  };

  try {
    const matches = await mentorMatch(input);
    if (matches && matches.length > 0) {
      return { message: "Successfully found potential mentors!", matches };
    } else {
      return { message: "No suitable mentors found based on your interests. Try refining your search." };
    }
  } catch (error) {
    console.error("AI Mentor Match Error:", error);
    return { error: "An error occurred while matching mentors. Please try again later." };
  }
}


// Schema for Registration Form
const RegistrationFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  confirmPassword: z.string(),
  userType: z.enum(["student", "alumni"], { required_error: "Please select if you are a student or an alumnus."}),
  graduationYear: z.string().optional(), // Year as string from select
  expectedGraduationYear: z.string().optional(), // Year as string from select
  major: z.string().min(2, "Major is required."),
  currentRole: z.string().optional(),
  company: z.string().optional(),
  linkedinProfile: z.string().url("Invalid LinkedIn URL.").optional().or(z.literal('')),
  willingToMentor: z.boolean().default(false),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
}).refine(data => {
    if (data.userType === 'alumni') return !!data.graduationYear;
    return true;
  }, {
    message: "Graduation year is required for alumni.",
    path: ["graduationYear"],
  }).refine(data => {
    if (data.userType === 'student') return !!data.expectedGraduationYear;
    return true;
  }, {
    message: "Expected graduation year is required for students.",
    path: ["expectedGraduationYear"],
  });

export async function handleRegistration(prevState: any, formData: RegistrationFormDataType): Promise<{ message?: string; error?: string; errors?: z.ZodIssue[] }> {
  const validatedFields = RegistrationFormSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      error: "Invalid form data. Please check the fields.",
      errors: validatedFields.error.errors,
    };
  }
  // In a real app, you would save this to a database and handle authentication.
  // For this mock, we'll just log it.
  console.log("Registration Data:", validatedFields.data);
  
  // Simulate success
  return { message: `Successfully registered ${validatedFields.data.name}! You can now log in.` };
}

// Schema for Login Form
const LoginFormSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(1, "Password is required."),
});

export async function handleLogin(prevState: any, formData: FormData): Promise<{ message?: string; error?: string; user?: { email: string, name: string, userType: 'student' | 'alumni', year: string, major?: string} }> {
  // This is a simplified mock login. In a real app, you'd fetch the full user profile.
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const validatedFields = LoginFormSchema.safeParse({ email, password });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.email?.[0] || validatedFields.error.flatten().fieldErrors.password?.[0] || "Invalid input."
    };
  }
  
  console.log("Login Attempt:", validatedFields.data);

  // Simulate fetching user data - replace with actual DB lookup
  // For mock purposes, we'll just assume a user type and year if login is successful
  // This part would need to fetch the actual user data from your storage/DB
  const mockUser = {
    email: validatedFields.data.email,
    name: "Mock User", // Fetched from DB
    userType: (Math.random() > 0.5 ? 'alumni' : 'student') as 'student' | 'alumni', // Fetched from DB
    year: "2022", // Fetched graduationYear or expectedGraduationYear from DB
    major: "Computer Science" // Fetched from DB
  };

  return { message: "Login successful!", user: mockUser };
}


// Schema for Profile Update Form
const ProfileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  userType: z.enum(["student", "alumni"]), // Usually read-only after registration
  graduationYear: z.string().optional(),
  expectedGraduationYear: z.string().optional(),
  major: z.string().min(2, "Major is required."),
  currentRole: z.string().optional(),
  company: z.string().optional(),
  industry: z.string().optional(),
  skills: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  linkedinProfile: z.string().url("Invalid LinkedIn URL.").optional().or(z.literal('')),
  bio: z.string().max(500, "Bio cannot exceed 500 characters.").optional(),
  achievements: z.string().max(500, "Achievements cannot exceed 500 characters.").optional(),
  willingToMentor: z.boolean().default(false),
}).refine(data => {
  if (data.userType === 'alumni') return !!data.graduationYear;
  return true;
}, {
  message: "Graduation year is required for alumni.",
  path: ["graduationYear"],
}).refine(data => {
  if (data.userType === 'student') return !!data.expectedGraduationYear;
  return true;
}, {
  message: "Expected graduation year is required for students.",
  path: ["expectedGraduationYear"],
});


export async function handleProfileUpdate(prevState: any, formData: FormData): Promise<{ message?: string; error?: string; errors?: z.ZodIssue[] }> {
  const skills = formData.getAll('skills').map(String);
  const interests = formData.getAll('interests').map(String);
  
  const dataToValidate = {
    name: formData.get('name'),
    email: formData.get('email'),
    userType: formData.get('userType'), // This should come from the authenticated user, not directly from form for safety
    graduationYear: formData.get('graduationYear') || undefined,
    expectedGraduationYear: formData.get('expectedGraduationYear') || undefined,
    major: formData.get('major'),
    currentRole: formData.get('currentRole'),
    company: formData.get('company'),
    industry: formData.get('industry'),
    linkedinProfile: formData.get('linkedinProfile'),
    bio: formData.get('bio'),
    achievements: formData.get('achievements'),
    willingToMentor: formData.get('willingToMentor') === 'on',
    skills: skills.length > 0 ? skills : undefined,
    interests: interests.length > 0 ? interests : undefined,
  };

  // IMPORTANT: In a real app, userType should be taken from the authenticated session, not trusted from the form.
  // Here we parse it from form for simplicity of mock.
  const userType = dataToValidate.userType as "student" | "alumni";
  if (!['student', 'alumni'].includes(userType)) {
    return { error: "Invalid user type." };
  }


  const validatedFields = ProfileFormSchema.safeParse({
    ...dataToValidate,
    userType, // ensure it's the correct enum
  });

  if (!validatedFields.success) {
     console.error("Profile Update Validation Errors:", validatedFields.error.flatten().fieldErrors);
    return {
      error: "Invalid profile data. Please check the fields.",
      errors: validatedFields.error.errors,
    };
  }
  // In a real app, save to database.
  console.log("Profile Update Data:", validatedFields.data);
  
  return { message: "Profile updated successfully!" };
}
