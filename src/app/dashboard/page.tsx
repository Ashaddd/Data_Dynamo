"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Award, CalendarCheck, Handshake, Users } from "lucide-react";
import Link from "next/link";

export default function DashboardOverviewPage() {
  const { user } = useAuth();

  const quickLinks = [
    { title: "My Profile", href: "/dashboard/profile", icon: Users, description: "View and update your information." },
    { title: "Notable Alumni", href: "/dashboard/notable-alumni", icon: Award, description: "See who's making an impact." },
    { title: "Events & News", href: "/dashboard/events", icon: CalendarCheck, description: "Stay updated with happenings." },
    { title: "Mentorship Hub", href: "/dashboard/mentorship/search", icon: Handshake, description: "Find or become a mentor." },
  ];

  return (
    <div className="space-y-8">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-3xl">Welcome, {user?.name || 'Alumni'}!</CardTitle>
          <CardDescription>
            This is your central hub for connecting with the alumni network, finding opportunities, and staying informed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Explore the sections below to make the most of the Nexus Alumni platform.</p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {quickLinks.map((link) => (
          <Link href={link.href} key={link.title} legacyBehavior>
            <a className="block">
              <Card className="h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-medium">{link.title}</CardTitle>
                  <link.icon className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{link.description}</p>
                </CardContent>
              </Card>
            </a>
          </Link>
        ))}
      </div>

      {/* Placeholder for recent activity or personalized content */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Updates and notifications relevant to you.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No new activity at the moment. Check back later!</p>
          {/* Example items:
          <ul className="space-y-2">
            <li>New event: "Annual Tech Summit" posted.</li>
            <li>You have 1 new mentorship request.</li>
          </ul>
          */}
        </CardContent>
      </Card>
    </div>
  );
}
