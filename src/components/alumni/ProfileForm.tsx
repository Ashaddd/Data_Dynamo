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
import { GRADUATION_YEAR_OPTIONS, MAJORS_DEPARTMENTS, INDUSTRIES, SKILLS_INTERESTS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { mockAlumni } from "@/data/alumni"; // For mock data

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  graduationYear: z.string({ required_error: "Please select your graduation year."}),
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
    setInputValue(""); // Clear input or reset select
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
  const [initialData, setInitialData] = useState<ProfileFormData | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      graduationYear: "",
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
      // In a real app, fetch profile data from backend using user.id
      // For mock, find user in mockAlumni or use stored user info
      const alumniProfile = mockAlumni.find(a => a.email === user.email);
      const dataToSet = alumniProfile ? {
        name: alumniProfile.name,
        email: alumniProfile.email,
        graduationYear: alumniProfile.graduationYear.toString(),
        major: alumniProfile.major, // This might need to be a value if using select
        currentRole: alumniProfile.currentRole,
        company: alumniProfile.company,
        industry: alumniProfile.industry,
        skills: alumniProfile.skills,
        interests: alumniProfile.interests,
        linkedinProfile: alumniProfile.linkedinProfile,
        bio: alumniProfile.bio,
        achievements: alumniProfile.achievements,
        willingToMentor: alumniProfile.willingToMentor,
      } : { // Fallback to user context data if no full profile found
        name: user.name,
        email: user.email,
        graduationYear: user.graduationYear?.toString() || "",
        major: user.major || "",
        skills: [],
        interests: [],
        willingToMentor: false,
      };
      form.reset(dataToSet as ProfileFormData); // Ensure type compatibility
      setInitialData(dataToSet as ProfileFormData);
    }
  }, [user, form]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(item => formData.append(key, item as string));
      } else if (typeof value === 'boolean') {
        formData.append(key, value ? 'on' : ''); // 'on' for true, empty for false for FormData
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    const result = await handleProfileUpdate({}, formData); // Using server action

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
  
  if (!initialData && !user) {
    return <p>Loading profile...</p>; // Or a skeleton loader
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                <FormControl><Input type="email" {...field} readOnly disabled /></FormControl> {/* Email usually not editable */}
                <FormDescription>Email cannot be changed.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <FormLabel>Industry</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
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
                <FormLabel>Current Role</FormLabel>
                <FormControl><Input {...field} placeholder="e.g., Senior Software Engineer" /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl><Input {...field} placeholder="e.g., Acme Corp" /></FormControl>
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
                    <FormDescription>Select skills relevant to your expertise.</FormDescription>
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
                        options={SKILLS_INTERESTS} // Can use same list or create a dedicated one
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
              <FormControl><Textarea {...field} rows={4} placeholder="Tell us a bit about yourself, your career journey, and passions." /></FormControl>
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
              <FormControl><Textarea {...field} rows={3} placeholder="Share any significant achievements or contributions." /></FormControl>
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
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Willing to be a Mentor?</FormLabel>
                <FormDescription>
                  Opt-in to appear in mentorship searches and help current students.
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
