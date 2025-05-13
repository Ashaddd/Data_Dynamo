"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { handleRegistration } from "@/lib/actions"; // Using Server Action
import type { RegistrationFormData } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GRADUATION_YEAR_OPTIONS, MAJORS_DEPARTMENTS } from "@/lib/constants";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string(),
  graduationYear: z.string({ required_error: "Please select your graduation year."}),
  major: z.string({ required_error: "Please select your major/department."}),
  currentRole: z.string().optional(),
  company: z.string().optional(),
  linkedinProfile: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  willingToMentor: z.boolean().default(false).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // path of error
});

export default function RegistrationForm() {
  const { register: authRegister } = useAuth(); // Mock auth register
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      graduationYear: undefined,
      major: undefined,
      currentRole: "",
      company: "",
      linkedinProfile: "",
      willingToMentor: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Using a mock Server Action handler
    const result = await handleRegistration({}, values as RegistrationFormData); // Cast to include password fields

    if (result.message) {
      toast({
        title: "Registration Successful",
        description: result.message,
      });
      authRegister(values.name, values.email); // Use mock auth context to set user
      // router.push('/login'); // Or directly to dashboard if auto-login
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
        <CardTitle className="text-2xl">Create your Alumni Account</CardTitle>
        <CardDescription>Join the Nexus Alumni network to connect and grow.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    <Input placeholder="e.g., Software Engineer" {...field} />
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
                  <FormLabel>Company (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Tech Corp" {...field} />
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
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Willing to be a mentor?
                    </FormLabel>
                    <FormDescription>
                      Opt-in to appear in mentorship searches for current students.
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
