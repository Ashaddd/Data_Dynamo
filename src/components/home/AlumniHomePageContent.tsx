
"use client";

import type { MockUser } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SITE_NAME } from "@/lib/constants";
import { Award, Briefcase, CalendarCheck, Handshake, LogOut, UserCog, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";

interface AlumniHomePageContentProps {
  user: MockUser;
}

const alumniFeatures = [
  {
    icon: <Handshake className="h-8 w-8 text-primary" />,
    title: "Offer Mentorship",
    description: "Share your expertise and guide current students or fellow alumni. Make a difference in someone's career journey.",
    href: "/dashboard/mentorship/search" // Or a dedicated page for offering mentorship
  },
  {
    icon: <CalendarCheck className="h-8 w-8 text-primary" />,
    title: "Alumni Events",
    description: "Discover exclusive events, reunions, and networking opportunities tailored for alumni.",
    href: "/dashboard/events"
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Connect with Peers",
    description: "Reconnect with old classmates and expand your professional network within the alumni community.",
    href: "/dashboard/notable-alumni" // Placeholder, could be a directory
  },
  {
    icon: <UserCog className="h-8 w-8 text-primary" />,
    title: "Update Your Profile",
    description: "Keep your information current to stay connected and ensure you receive relevant updates.",
    href: "/dashboard/profile"
  },
  {
    icon: <Award className="h-8 w-8 text-primary" />,
    title: "Notable Alumni",
    description: "Explore the achievements of distinguished alumni and get inspired by their stories.",
    href: "/dashboard/notable-alumni"
  },
];

export default function AlumniHomePageContent({ user }: AlumniHomePageContentProps) {
  const { logout } = useAuth();
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-foreground">
                Welcome Back, {user.name}!
              </h1>
              <p className="mt-4 max-w-xl text-lg text-muted-foreground md:text-xl">
                As a valued member of the {SITE_NAME} alumni network, you have access to exclusive resources, events, and opportunities to connect and give back.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
                <Button size="lg" variant="outline" onClick={logout}>
                  <LogOut className="mr-2 h-5 w-5" /> Logout
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <Image
                src="https://picsum.photos/seed/alumni-home/600/400"
                alt="Alumni networking"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
                data-ai-hint="professional networking"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section for Alumni */}
      <section id="alumni-features" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-center sm:text-4xl text-foreground mb-12">
            Engage with Your Alumni Network
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {alumniFeatures.map((feature) => (
              <Link href={feature.href} key={feature.title} legacyBehavior>
                <a className="block h-full">
                  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                    <CardHeader className="items-center text-center">
                      {feature.icon}
                      <CardTitle className="mt-4 text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center flex-grow">
                      <CardDescription>{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action/Information Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container mx-auto max-w-4xl px-4 md:px-6 text-center">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl sm:text-3xl">Stay Involved, Stay Connected</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg text-muted-foreground">
                Your journey with {SITE_NAME} doesn&apos;t end at graduation. Explore ways to contribute, share your success, and help shape the future of our community.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="default" asChild>
                    <Link href="/dashboard/events">View Upcoming Events</Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/dashboard/mentorship/search">Become a Mentor</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
