
"use server";

import { z } from "zod";
import { mentorMatch } from "@/ai/flows/mentor-matcher";
import type { MentorMatchInput, MentorMatchOutput } from "@/ai/flows/mentor-matcher";
import { MOCK_ALUMNI_PROFILES_FOR_AI } from "./constants";
import type { RegistrationFormData as RegistrationFormDataType, ProfileFormData as ProfileFormDataType, Alumni } from "./types";
import { db } from './firebase'; // Import Firestore instance
import { doc, setDoc, updateDoc, serverTimestamp, getDoc, FieldValue } from 'firebase/firestore';
import { mockAlumni } from "@/data/alumni"; // Still used for other parts of the app not yet migrated

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
    alumniProfiles: MOCK_ALUMNI_PROFILES_FOR_AI,
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
  graduationYear: z.string().optional(),
  expectedGraduationYear: z.string().optional(),
  major: z.string().min(1, "Major is required."), // Changed min to 1 as it's a select
  currentRole: z.string().optional(),
  company: z.string().optional(),
  linkedinProfile: z.string().url("Invalid LinkedIn URL.").optional().or(z.literal('')),
  willingToMentor: z.boolean().default(false),
  // Fields from ProfileFormData that might be included at registration
  industry: z.string().optional(),
  skills: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  bio: z.string().max(500, "Bio cannot exceed 500 characters.").optional(),
  achievements: z.string().max(500, "Achievements cannot exceed 500 characters.").optional(),
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


export async function handleRegistration(prevState: any, formData: RegistrationFormDataType): Promise<{ message?: string; error?: string; errors?: z.ZodIssue[]; userId?: string }> {
  const validatedFields = RegistrationFormSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      error: "Invalid form data. Please check the fields.",
      errors: validatedFields.error.errors,
    };
  }
  
  const data = validatedFields.data;
  // In a real Firebase Auth app, userId would come from auth.currentUser.uid after user creation.
  // For this mock setup, we'll use the email as a temporary ID or generate one.
  // The useAuth hook generates an ID like Date.now().toString() - this will be passed from client.
  // Let's assume for now the client will pass a 'userId' if it's generated there, or we get it from session.
  // For simplicity in this step, we'll derive a pseudo-ID or expect it.
  // The mock `authRegister` in `useAuth` uses `Date.now().toString()` for ID. This ID is used by `ProfileForm` to fetch.
  // So, the ID used here for Firestore doc should match that.
  // This implies `userId` should be part of `RegistrationFormDataType` or passed separately.
  // The `authRegister` function in `useAuth` calls `login`, which sets the user context including an ID.
  // We can assume this ID is what we should use for the Firestore document ID.

  const userId = formData.userId || Date.now().toString(); // Prefer userId from formData if passed by client after mock ID generation

  // Prepare data for Firestore, ensure types are correct (e.g., numbers for years)
  const profileToSave: Omit<Alumni | ProfileFormDataType, 'id' | 'password' | 'confirmPassword'> & { uid: string; createdAt: FieldValue; email: string; userType: 'student' | 'alumni' } = {
    uid: userId,
    name: data.name,
    email: data.email,
    userType: data.userType,
    major: data.major,
    currentRole: data.currentRole || "",
    company: data.company || "",
    industry: data.industry || "",
    skills: data.skills || [],
    interests: data.interests || [],
    linkedinProfile: data.linkedinProfile || "",
    bio: data.bio || "",
    achievements: data.achievements || "",
    profilePictureUrl: `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(data.name)}`,
    isNotable: data.userType === 'alumni' ? true : false, // Default for demo for alumni
    willingToMentor: data.userType === 'alumni' ? (data.willingToMentor ?? false) : false,
    contactInfo: data.email,
    createdAt: serverTimestamp(),
  };

  if (data.userType === 'alumni' && data.graduationYear) {
    (profileToSave as Alumni).graduationYear = parseInt(data.graduationYear, 10);
  } else if (data.userType === 'student' && data.expectedGraduationYear) {
    (profileToSave as ProfileFormDataType & { userType: 'student' }).expectedGraduationYear = data.expectedGraduationYear;
  }
  
  try {
    await setDoc(doc(db, "users", userId), profileToSave);
    console.log(`User ${data.name} profile stored in Firestore with ID: ${userId}`);
    // Removed: mockAlumni.push(newAlumnus);
    return { message: `Successfully registered ${data.name}! You can now log in.`, userId };
  } catch (error) {
    console.error("Firestore registration error:", error);
    return { error: "Failed to store profile information." };
  }
}

// Schema for Login Form
const LoginFormSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(1, "Password is required."),
});

export async function handleLogin(prevState: any, formData: FormData): Promise<{ message?: string; error?: string; user?: { id: string, email: string, name: string, userType: 'student' | 'alumni', year: string, major?: string} }> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const validatedFields = LoginFormSchema.safeParse({ email, password });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.email?.[0] || validatedFields.error.flatten().fieldErrors.password?.[0] || "Invalid input."
    };
  }
  
  console.log("Login Attempt:", validatedFields.data);

  // Try to find user in Firestore
  // Note: In real Firebase Auth, UID is the primary key. Here we search by email for mock.
  // This part is more for informing the mock user context. Actual auth is separate.
  // For this example, we'll try to find a user by email if they were registered through the new system.
  // This is a simplified lookup. A real app would query Firestore more effectively.
  
  // The critical part is that useAuth.login will be called with some user data.
  // ProfileForm will then try to fetch from Firestore using the ID from useAuth.
  // Let's find the user in the mockAlumni array first if they are alumni
  let foundUserInMock = mockAlumni.find(alum => alum.email === validatedFields.data.email);
  let userToReturn;

  if (foundUserInMock) {
     userToReturn = {
        id: foundUserInMock.id, // Use existing ID from mock data
        email: foundUserInMock.email,
        name: foundUserInMock.name,
        userType: 'alumni' as 'alumni',
        year: foundUserInMock.graduationYear.toString(),
        major: foundUserInMock.major
    };
  } else {
    // Fallback or if it's a student (not in mockAlumni)
    // For demo, create a generic user object. ID will be generated by useAuth if not found.
    // This needs to align with how useAuth populates its user object upon login.
    // The ID for Firestore should ideally be the Firebase Auth UID.
    // For the mock, useAuth generates an ID. That ID must be used for Firestore.
    // We can't reliably query by email to get the Firestore ID here without a query.
    // So, login action will return basic info, useAuth will return basic info, then ProfileForm fetches by that ID.
     userToReturn = {
        id: '', // This ID will be set by useAuth's login if not found from a more concrete source
        email: validatedFields.data.email,
        name: "Mock User " + validatedFields.data.email.split('@')[0], 
        userType: (Math.random() > 0.5 ? 'alumni' : 'student') as 'student' | 'alumni', // Random for demo
        year: "2022", 
        major: "Computer Science" 
    };
  }

  return { message: "Login successful!", user: userToReturn };
}


// Schema for Profile Update Form (should align with ProfileFormDataType and Alumni)
const ProfileFormSchema = z.object({
  userId: z.string(), // Added userId to be passed in formData
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."), // Typically not updatable or managed by auth provider
  userType: z.enum(["student", "alumni"]), // Should be read from session/auth context
  graduationYear: z.string().optional(),
  expectedGraduationYear: z.string().optional(),
  major: z.string().min(1, "Major is required."),
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
  const userId = formData.get('userId') as string;
  if (!userId) {
    return { error: "User ID is missing. Cannot update profile." };
  }

  const skills = formData.getAll('skills').map(String);
  const interests = formData.getAll('interests').map(String);
  
  const rawData = {
    userId: userId,
    name: formData.get('name'),
    email: formData.get('email'),
    userType: formData.get('userType'),
    graduationYear: formData.get('graduationYear') || undefined,
    expectedGraduationYear: formData.get('expectedGraduationYear') || undefined,
    major: formData.get('major'),
    currentRole: formData.get('currentRole'),
    company: formData.get('company'),
    industry: formData.get('industry'),
    linkedinProfile: formData.get('linkedinProfile'),
    bio: formData.get('bio'),
    achievements: formData.get('achievements'),
    willingToMentor: formData.get('willingToMentor') === 'on', // Checkbox value
    skills: skills.length > 0 ? skills : [], // Ensure array, even if empty
    interests: interests.length > 0 ? interests : [], // Ensure array, even if empty
  };

  // Ensure userType is correctly typed for validation
  const userType = rawData.userType as "student" | "alumni";
  if (!['student', 'alumni'].includes(userType)) {
    return { error: "Invalid user type provided." };
  }

  const validatedFields = ProfileFormSchema.safeParse({
    ...rawData,
    userType, // Pass the correctly typed userType
  });

  if (!validatedFields.success) {
    console.error("Profile Update Validation Errors:", validatedFields.error.flatten().fieldErrors);
    return {
      error: "Invalid profile data. Please check the fields.",
      errors: validatedFields.error.errors,
    };
  }
  
  // Prepare data for Firestore update, excluding userId from the document data itself.
  const { userId: validatedUserId, ...dataToUpdate } = validatedFields.data;

  const firestoreData: Partial<Alumni | ProfileFormDataType> & {updatedAt: FieldValue} = {
    ...dataToUpdate,
    updatedAt: serverTimestamp(),
  };
  
  // Convert year strings to numbers if present
  if (firestoreData.userType === 'alumni' && firestoreData.graduationYear) {
    firestoreData.graduationYear = parseInt(firestoreData.graduationYear, 10) as any; // Type workaround
  }
  // expectedGraduationYear is already string in ProfileFormDataType

  try {
    await updateDoc(doc(db, "users", validatedUserId), firestoreData);
    console.log(`User ${dataToUpdate.name} (ID: ${validatedUserId}) profile updated in Firestore.`);
    // Removed: mockAlumni update logic
    return { message: "Profile updated successfully!" };
  } catch (error) {
    console.error("Firestore profile update error:", error);
    return { error: "Failed to update profile information." };
  }
}
