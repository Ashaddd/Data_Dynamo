
"use client"; 

import { useAuth } from "@/hooks/use-auth";
import PublicHomePageContent from "@/components/home/PublicHomePageContent";
import AlumniHomePageContent from "@/components/home/AlumniHomePageContent";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] p-4"> {/* Adjusted height */}
        <Card className="w-full max-w-md p-8 shadow-lg">
          <CardHeader className="items-center text-center">
            <GraduationCap size={48} className="text-primary mb-4" />
            <CardTitle className="text-2xl">Loading {SITE_NAME}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-10 w-full mt-4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user && user.userType === 'alumni') {
    return <AlumniHomePageContent user={user} />;
  }

  // For guests or students, show the public home page
  return <PublicHomePageContent />;
}
