"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { handleRegistration } from "@/lib/actions"; 
import type { RegistrationFormData } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { GRADUATION_YEAR_OPTIONS, EXPECTED_GRADUATION_YEAR_OPTIONS, MAJORS_DEPARTMENTS } from "@/lib/constants";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string(),
  userType: z.enum(["student", "alumni"], { required_error: "Please select if you are a student or an alumnus."}),
  graduationYear: z.string().optional(),
  expectedGraduationYear: z.string().optional(),
  major: z.string({ required_error: "Please select your major/department."}),
  currentRole: z.string().optional(),
  company: z.string().optional(),
  linkedinProfile: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  willingToMentor: z.boolean().default(false).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
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

export default function RegistrationForm() {
  const { register: authRegister } = useAuth(); 
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      userType: undefined,
      graduationYear: undefined,
      expectedGraduationYear: undefined,
      major: undefined,
      currentRole: "",
      company: "",
      linkedinProfile: "",
      willingToMentor: false,
    },
  });

  const userType = form.watch("userType");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Prepare data according to RegistrationFormData structure
    const dataToSubmit: RegistrationFormData = {
      name: values.name,
      email: values.email,
      password: values.password,
      confirmPassword: values.confirmPassword,
      major: values.major,
      currentRole: values.currentRole,
      company: values.company,
      linkedinProfile: values.linkedinProfile,
      willingToMentor: values.willingToMentor ?? false,
      userType: values.userType!, // userType is guaranteed by schema if validation passes this far
      ...(values.userType === 'alumni' 
        ? { graduationYear: values.graduationYear! } 
        : { expectedGraduationYear: values.expectedGraduationYear! })
    };
    
    const result = await handleRegistration({}, dataToSubmit);

    if (result.message) {
      toast({
        title: "Registration Successful",
        description: result.message,
      });
      // The authRegister in useAuth now expects userType and year.
      const year = values.userType === 'alumni' ? values.graduationYear! : values.expectedGraduationYear!;
      authRegister(values.name, values.email, values.userType!, year, values.major); 
      router.push('/dashboard'); 
    } else if (result.error) {
      toast({
        title: "Registration Failed",
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

  return (
    <Card className="w-full max-w-lg mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl">Create your Account</CardTitle>
        <CardDescription>Join the {userType === 'student' ? 'Student' : userType === 'alumni' ? 'Alumni' : ''} Network to connect and grow.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="userType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>I am a...</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1 md:flex-row md:space-y-0 md:space-x-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="student" />
                        </FormControl>
                        <FormLabel className="font-normal">Current Student</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="alumni" />
                        </FormControl>
                        <FormLabel className="font-normal">Alumnus / Alumna</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
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
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {userType === 'alumni' && (
              <FormField
                control={form.control}
                name="graduationYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Graduation Year</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your graduation year" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {GRADUATION_YEAR_OPTIONS.map(option => (
                          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {userType === 'student' && (
              <FormField
                control={form.control}
                name="expectedGraduationYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Graduation Year</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your expected graduation year" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {EXPECTED_GRADUATION_YEAR_OPTIONS.map(option => (
                          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                      </SelectContent>
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
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your major or department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {MAJORS_DEPARTMENTS.map(option => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currentRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Role (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Software Engineer Intern (if student), or Software Engineer (if alumni)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company / Organization (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., University Name (if student), or Tech Corp (if alumni)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="linkedinProfile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn Profile URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://linkedin.com/in/yourprofile" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="willingToMentor"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={userType === 'student'} // Students typically don't mentor in this context
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Willing to be a mentor?
                    </FormLabel>
                    <FormDescription>
                      {userType === 'student' 
                        ? "Mentorship option available for alumni." 
                        : "Opt-in to appear in mentorship searches."}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Registering..." : "Register"}
            </Button>
          </form>
        </Form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
