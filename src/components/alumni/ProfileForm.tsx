
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { handleProfileUpdate } from "@/lib/actions"; 
import type { ProfileFormData, Alumni } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GRADUATION_YEAR_OPTIONS, EXPECTED_GRADUATION_YEAR_OPTIONS, MAJORS_DEPARTMENTS, INDUSTRIES, SKILLS_INTERESTS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { X, Info } from "lucide-react";
import { db } from '@/lib/firebase'; // Import Firestore
import { doc, getDoc } from 'firebase/firestore';
import { Skeleton } from "@/components/ui/skeleton";


const formSchema = z.object({
  userId: z.string().optional(), // For passing to action, not necessarily displayed
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  userType: z.enum(["student", "alumni"]), 
  graduationYear: z.string().optional(),
  expectedGraduationYear: z.string().optional(),
  major: z.string({ required_error: "Please select your major/department."}),
  currentRole: z.string().optional(),
  company: z.string().optional(),
  industry: z.string().optional(),
  skills: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  linkedinProfile: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
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


const MultiSelectBadgeField = ({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string[];
  onChange: (value: string[]) => void;
  options: { value: string; label: string }[];
  placeholder: string;
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = (itemValue: string) => {
    if (itemValue && !value.includes(itemValue)) {
      onChange([...value, itemValue]);
    }
    setInputValue(""); 
  };

  const handleRemove = (itemToRemove: string) => {
    onChange(value.filter((item) => item !== itemToRemove));
  };

  return (
    <div className="space-y-2">
      <Select onValueChange={(val) => { handleAdd(val); }} value="">
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.filter(opt => !value.includes(opt.value)).map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex flex-wrap gap-2">
        {value.map((item) => {
          const label = options.find(opt => opt.value === item)?.label || item;
          return (
            <Badge key={item} variant="secondary" className="flex items-center gap-1">
              {label}
              <button type="button" onClick={() => handleRemove(item)} className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5">
                <X size={12} />
              </button>
            </Badge>
          );
        })}
      </div>
    </div>
  );
};


export default function ProfileForm() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isFetchingProfile, setIsFetchingProfile] = useState(true);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: user?.id || "",
      name: user?.name || "",
      email: user?.email || "",
      userType: user?.userType || undefined, 
      graduationYear: "",
      expectedGraduationYear: "",
      major: user?.major || "",
      currentRole: "",
      company: "",
      industry: "",
      skills: [],
      interests: [],
      linkedinProfile: "",
      bio: "",
      achievements: "",
      willingToMentor: false,
    },
  });
  
  useEffect(() => {
    if (user && user.id) {
      setIsFetchingProfile(true);
      const fetchProfile = async () => {
        try {
          const docRef = doc(db, "users", user.id);
          const docSnap = await getDoc(docRef);
          
          let dataToSet: Partial<z.infer<typeof formSchema>> = { // Use z.infer for type safety
            userId: user.id,
            name: user.name,
            email: user.email,
            userType: user.userType,
            major: user.major || "", // Default from auth context
          };

          if (docSnap.exists()) {
            const profileData = docSnap.data() as ProfileFormData & { graduationYear?: number | string; expectedGraduationYear?: string }; // Firestore data
            
            dataToSet = {
              ...dataToSet, // Base from auth
              name: profileData.name || user.name, // Prefer Firestore if available
              major: profileData.major || user.major,
              currentRole: profileData.currentRole || "",
              company: profileData.company || "",
              industry: profileData.industry || "",
              skills: profileData.skills || [],
              interests: profileData.interests || [],
              linkedinProfile: profileData.linkedinProfile || "",
              bio: profileData.bio || "",
              achievements: profileData.achievements || "",
              willingToMentor: profileData.willingToMentor || false,
            };
            if (profileData.userType === 'alumni') {
              dataToSet.graduationYear = profileData.graduationYear?.toString() || user.graduationYear || "";
            } else if (profileData.userType === 'student') {
              dataToSet.expectedGraduationYear = profileData.expectedGraduationYear?.toString() || user.expectedGraduationYear || "";
            }
          } else {
            // No profile in Firestore, use defaults from auth context / initial form values
            if (user.userType === 'alumni') {
              dataToSet.graduationYear = user.graduationYear || "";
            } else if (user.userType === 'student') {
              dataToSet.expectedGraduationYear = user.expectedGraduationYear || "";
            }
          }
          form.reset(dataToSet as z.infer<typeof formSchema>);
        } catch (error) {
          console.error("Error fetching profile:", error);
          toast({ title: "Error", description: "Could not load your profile data from the database.", variant: "destructive" });
           // Fallback to auth context data if Firestore fetch fails
           let fallbackData: Partial<z.infer<typeof formSchema>> = {
            userId: user.id,
            name: user.name,
            email: user.email,
            userType: user.userType,
            major: user.major || "",
          };
          if (user.userType === 'alumni') fallbackData.graduationYear = user.graduationYear || "";
          if (user.userType === 'student') fallbackData.expectedGraduationYear = user.expectedGraduationYear || "";
          form.reset(fallbackData as z.infer<typeof formSchema>);
        } finally {
          setIsFetchingProfile(false);
        }
      };
      fetchProfile();
    } else if (!authLoading) { // If user is null and auth is not loading, stop fetching
        setIsFetchingProfile(false);
    }
  }, [user, form, toast, authLoading]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !user.id) {
      toast({ title: "Error", description: "User not authenticated.", variant: "destructive" });
      return;
    }

    const formData = new FormData();
    formData.append('userId', user.id); // Ensure userId is included for the action

    Object.entries(values).forEach(([key, value]) => {
      if (key === 'skills' || key === 'interests') {
        (value as string[]).forEach(item => formData.append(key, item));
      } else if (typeof value === 'boolean') {
        formData.append(key, value ? 'on' : ''); // Standard for HTML form checkbox
      } else if (value !== undefined && value !== null && key !== 'userId') { // userId already added
        formData.append(key, String(value));
      }
    });
    
    // Ensure userType is explicitly set (it's read-only on form but needed by action)
    if (user?.userType) {
        formData.set('userType', user.userType); // Overwrite if already set from values, ensure it's from auth
    }

    const result = await handleProfileUpdate({}, formData); 

    if (result.message) {
      toast({
        title: "Profile Updated",
        description: result.message,
      });
    } else if (result.error) {
      toast({
        title: "Update Failed",
        description: result.error,
        variant: "destructive",
      });
       if (result.errors) {
        result.errors.forEach(err => {
          form.setError(err.path[0] as keyof z.infer<typeof formSchema>, { message: err.message });
        });
      }
    }
  }
  
  if (authLoading || isFetchingProfile) {
    return (
        <div className="space-y-4">
            <Skeleton className="h-10 w-1/3" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-1/4" />
        </div>
    );
  }

  if (!user) {
    return <p>User not found. Please log in.</p>;
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        <div className="rounded-md border border-blue-300 bg-blue-50 p-4">
            <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-600" />
                <p className="text-sm text-blue-700">
                    You are managing your profile as a <span className="font-semibold">{user.userType}</span>.
                </p>
            </div>
        </div>
        
        <input type="hidden" {...form.register("userId")} value={user.id} />


        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl><Input type="email" {...field} readOnly disabled /></FormControl> 
                <FormDescription>Email cannot be changed.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {user.userType === 'alumni' && (
            <FormField
              control={form.control}
              name="graduationYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Graduation Year</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger></FormControl>
                    <SelectContent>{GRADUATION_YEAR_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {user.userType === 'student' && (
             <FormField
              control={form.control}
              name="expectedGraduationYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Graduation Year</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger></FormControl>
                    <SelectContent>{EXPECTED_GRADUATION_YEAR_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="major"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Major / Department</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select major" /></SelectTrigger></FormControl>
                  <SelectContent>{MAJORS_DEPARTMENTS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="industry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Industry {user.userType === 'student' && '(e.g., aspired or current if interning)'}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ''}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select your industry" /></SelectTrigger></FormControl>
                <SelectContent>{INDUSTRIES.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="currentRole"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Role {user.userType === 'student' && '(e.g., Student, Intern)'}</FormLabel>
                <FormControl><Input {...field} value={field.value || ""} placeholder={user.userType === 'student' ? "e.g., Computer Science Student" : "e.g., Senior Software Engineer"} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company / Organization {user.userType === 'student' && '(e.g., University Name)'}</FormLabel>
                <FormControl><Input {...field} value={field.value || ""} placeholder={user.userType === 'student' ? "e.g., State University" : "e.g., Acme Corp"} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="linkedinProfile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LinkedIn Profile URL</FormLabel>
              <FormControl><Input {...field} value={field.value || ""} placeholder="https://linkedin.com/in/yourprofile" /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Skills</FormLabel>
                    <MultiSelectBadgeField 
                        value={field.value || []} 
                        onChange={field.onChange}
                        options={SKILLS_INTERESTS}
                        placeholder="Add skills"
                    />
                    <FormDescription>Select skills relevant to your expertise or studies.</FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
        
        <FormField
            control={form.control}
            name="interests"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Interests</FormLabel>
                     <MultiSelectBadgeField 
                        value={field.value || []} 
                        onChange={field.onChange}
                        options={SKILLS_INTERESTS} 
                        placeholder="Add interests"
                    />
                    <FormDescription>Select interests for networking and mentorship.</FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio / About Me</FormLabel>
              <FormControl><Textarea {...field} value={field.value || ""} rows={4} placeholder="Tell us a bit about yourself, your career journey, academic pursuits, and passions." /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="achievements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notable Achievements / Contributions</FormLabel>
              <FormControl><Textarea {...field} value={field.value || ""} rows={3} placeholder="Share any significant achievements, projects, or contributions." /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="willingToMentor"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
              <FormControl>
                <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange} 
                    disabled={user.userType === 'student'}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Willing to be a Mentor?</FormLabel>
                <FormDescription>
                  {user.userType === 'student' 
                    ? "Mentorship is typically offered by alumni. You can seek mentorship through the platform." 
                    : "Opt-in to appear in mentorship searches and help current students or fellow alumni."}
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full sm:w-auto" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
