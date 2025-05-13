"use server";

import { z } from "zod";
import { mentorMatch } from "@/ai/flows/mentor-matcher";
import type { MentorMatchInput, MentorMatchOutput } from "@/ai/flows/mentor-matcher";
import { MOCK_ALUMNI_PROFILES_FOR_AI } from "./constants"; // Using mock data for alumni profiles
import type { RegistrationFormData } from "./types";

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
  graduationYear: z.string().min(4, "Invalid graduation year."),
  major: z.string().min(2, "Major is required."),
  currentRole: z.string().optional(),
  company: z.string().optional(),
  linkedinProfile: z.string().url("Invalid LinkedIn URL.").optional().or(z.literal('')),
  willingToMentor: z.boolean().default(false),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

export async function handleRegistration(prevState: any, formData: RegistrationFormData): Promise<{ message?: string; error?: string; errors?: z.ZodIssue[] }> {
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

export async function handleLogin(prevState: any, formData: FormData): Promise<{ message?: string; error?: string; user?: { email: string } }> {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.email?.[0] || validatedFields.error.flatten().fieldErrors.password?.[0] || "Invalid input."
    };
  }
  // In a real app, verify credentials against a database.
  // For this mock, any valid email/password logs in.
  console.log("Login Attempt:", validatedFields.data);

  // Simulate successful login
  return { message: "Login successful!", user: { email: validatedFields.data.email } };
}


// Schema for Profile Update Form
const ProfileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."), // Typically email is not editable or needs verification
  graduationYear: z.string().min(4, "Invalid graduation year."),
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
});


export async function handleProfileUpdate(prevState: any, formData: FormData): Promise<{ message?: string; error?: string; errors?: z.ZodIssue[] }> {
  // This conversion is a bit manual due to FormData limitations with arrays.
  // In a real scenario with client-side JS form handling, you'd send JSON.
  const skills = formData.getAll('skills').map(String);
  const interests = formData.getAll('interests').map(String);
  
  const dataToValidate = {
    name: formData.get('name'),
    email: formData.get('email'),
    graduationYear: formData.get('graduationYear'),
    major: formData.get('major'),
    currentRole: formData.get('currentRole'),
    company: formData.get('company'),
    industry: formData.get('industry'),
    linkedinProfile: formData.get('linkedinProfile'),
    bio: formData.get('bio'),
    achievements: formData.get('achievements'),
    willingToMentor: formData.get('willingToMentor') === 'on', // Checkbox value
    skills: skills.length > 0 ? skills : undefined,
    interests: interests.length > 0 ? interests : undefined,
  };

  const validatedFields = ProfileFormSchema.safeParse(dataToValidate);

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
