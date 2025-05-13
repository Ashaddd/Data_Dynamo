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
import { handleProfileUpdate } from "@/lib/actions"; // Server Action
import type { ProfileFormData } from "@/lib/types";
import { useAuth, MockUser } from "@/hooks/use-auth";
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
import { mockAlumni } from "@/data/alumni"; // For mock data

// Schema aligned with server action
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  userType: z.enum(["student", "alumni"]), // Read-only after registration
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


// Helper for multi-select like experience with badges
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
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      userType: undefined, // Will be set from user context
      graduationYear: "",
      expectedGraduationYear: "",
      major: "",
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
    if (user) {
      // In a real app, fetch full profile data from backend using user.id
      // For mock, find user in mockAlumni or use stored user info from auth context
      const alumniProfile = user.userType === 'alumni' ? mockAlumni.find(a => a.email === user.email) : null;
      
      let dataToSet: Partial<z.infer<typeof formSchema>> = {
        name: user.name,
        email: user.email,
        userType: user.userType,
        major: user.major || "",
        skills: [], // Default empty, should be populated if alumniProfile exists
        interests: [], // Default empty
        willingToMentor: false, // Default
      };

      if (user.userType === 'alumni') {
        dataToSet.graduationYear = user.graduationYear || alumniProfile?.graduationYear.toString();
        if (alumniProfile) {
            dataToSet = {
                ...dataToSet,
                currentRole: alumniProfile.currentRole,
                company: alumniProfile.company,
                industry: alumniProfile.industry,
                skills: alumniProfile.skills,
                interests: alumniProfile.interests,
                linkedinProfile: alumniProfile.linkedinProfile,
                bio: alumniProfile.bio,
                achievements: alumniProfile.achievements,
                willingToMentor: alumniProfile.willingToMentor,
            };
        }
      } else if (user.userType === 'student') {
        dataToSet.expectedGraduationYear = user.expectedGraduationYear || "";
        // Students might have less pre-filled data or different fields
        // For this mock, we'll assume less data for students initially beyond auth context.
      }
      
      form.reset(dataToSet as z.infer<typeof formSchema>);
      setIsLoading(false);
    }
  }, [user, form]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    // Append common fields
    Object.entries(values).forEach(([key, value]) => {
      if (key === 'skills' || key === 'interests') {
        (value as string[]).forEach(item => formData.append(key, item));
      } else if (typeof value === 'boolean') {
        formData.append(key, value ? 'on' : '');
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    
    // Ensure userType is explicitly set (it's read-only on form but needed by action)
    if (user?.userType) {
        formData.set('userType', user.userType);
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
  
  if (isLoading) {
    return <p>Loading profile...</p>; 
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
        {/* Hidden field for userType, though it should ideally come from session on server */}
        <input type="hidden" {...form.register("userType")} value={user.userType} />


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
                  <Select onValueChange={field.onChange} value={field.value}>
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
                  <Select onValueChange={field.onChange} value={field.value}>
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
                <Select onValueChange={field.onChange} value={field.value}>
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
                <FormControl><Input {...field} placeholder={user.userType === 'student' ? "e.g., Computer Science Student" : "e.g., Senior Software Engineer"} /></FormControl>
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
                <FormControl><Input {...field} placeholder={user.userType === 'student' ? "e.g., State University" : "e.g., Acme Corp"} /></FormControl>
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
              <FormControl><Input {...field} placeholder="https://linkedin.com/in/yourprofile" /></FormControl>
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
              <FormControl><Textarea {...field} rows={4} placeholder="Tell us a bit about yourself, your career journey, academic pursuits, and passions." /></FormControl>
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
              <FormControl><Textarea {...field} rows={3} placeholder="Share any significant achievements, projects, or contributions." /></FormControl>
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
