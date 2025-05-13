import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";
import { Award, CalendarCheck, Handshake, Lightbulb, Users, GraduationCap, Cpu, Zap, Building } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const features = [
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Profiles for All",
    description: "Students and alumni can register, manage profiles, share journeys, and connect."
  },
  {
    icon: <Award className="h-8 w-8 text-primary" />,
    title: "Notable Alumni",
    description: "Discover and celebrate the achievements of distinguished alumni from our community."
  },
  {
    icon: <CalendarCheck className="h-8 w-8 text-primary" />,
    title: "Events & News",
    description: "Stay updated with the latest college events, alumni meetups, and news relevant to all."
  },
  {
    icon: <Handshake className="h-8 w-8 text-primary" />,
    title: "Mentorship Hub",
    description: "Students can find mentors, and alumni can offer guidance, fostering growth within the network."
  },
  {
    icon: <Lightbulb className="h-8 w-8 text-primary" />,
    title: "AI Mentor Matching",
    description: "Students can intelligently connect with alumni mentors based on career interests and expertise."
  },
];

const departmentShowcase = [
  {
    icon: <Cpu size={48} className="text-primary mb-2" />,
    title: "Computer Science",
    description: "Innovators, developers, and leaders in the world of computing and technology.",
    href: "/dashboard/notable-alumni", 
  },
  {
    icon: <Zap size={48} className="text-primary mb-2" />,
    title: "Electrical Engineering",
    description: "Pioneers in electronics, power systems, and telecommunications.",
    href: "/dashboard/notable-alumni", 
  },
  {
    icon: <Building size={48} className="text-primary mb-2" />,
    title: "Civil Engineering",
    description: "Builders of infrastructure, shaping our environment and modern society.",
    href: "/dashboard/notable-alumni", 
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 text-center">
          <div className="flex flex-col items-center space-y-6">
            <GraduationCap size={64} className="text-primary" />
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-foreground">
              Welcome to {SITE_NAME}
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
              {SITE_DESCRIPTION} For students and alumni to reconnect, share, and grow with your alma mater.
            </p>
            
            {/* New Student/Alumni Sections replacing old buttons */}
            <div className="mt-10 grid w-full max-w-3xl gap-8 md:grid-cols-2">
              <Card className="shadow-lg">
                <CardHeader className="items-center">
                  <CardTitle className="text-2xl text-primary">For Students</CardTitle>
                  <CardDescription>Connect with mentors and explore opportunities.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <Button size="lg" asChild className="w-full">
                    <Link href="/login?userType=student">Student Login</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="w-full">
                    <Link href="/register?userType=student">Student Registration</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="items-center">
                  <CardTitle className="text-2xl text-primary">For Alumni</CardTitle>
                  <CardDescription>Offer mentorship and reconnect with peers.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <Button size="lg" asChild className="w-full">
                    <Link href="/login?userType=alumni">Alumni Login</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="w-full">
                    <Link href="/register?userType=alumni">Alumni Registration</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Department Showcase Section */}
        <div className="container mx-auto max-w-5xl px-4 md:px-6 mt-16 lg:mt-20">
          <h2 className="text-3xl font-bold tracking-tight text-center sm:text-4xl text-foreground mb-10">
            Explore Our Alumni Network
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {departmentShowcase.map((dept) => (
              <Link href={dept.href} key={dept.title} legacyBehavior>
                <a className="block h-full">
                  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col text-center items-center p-6">
                    <CardHeader className="p-0 mb-4">
                      {dept.icon}
                      <CardTitle className="text-xl mt-2">{dept.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <p className="text-sm text-muted-foreground">
                        {dept.description}
                      </p>
                    </CardContent>
                  </Card>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-center sm:text-4xl text-foreground mb-12">
            Platform Features
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="items-center text-center">
                  {feature.icon}
                  <CardTitle className="mt-4 text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
            Ready to Connect?
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-lg text-muted-foreground">
            Become an active member of the {SITE_NAME} community today. Whether you're a student or an alumnus, share your experiences, find or offer mentorship, and stay informed.
          </p>
          <div className="mt-8">
            <Button size="lg" asChild>
              <Link href="/register">Create Your Profile</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Placeholder for Contact Section */}
       <section id="contact" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
            Get In Touch
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-lg text-muted-foreground">
            Have questions or suggestions? We'd love to hear from you.
          </p>
          <div className="mt-8">
            <Button size="lg" variant="outline" asChild>
              <Link href="mailto:contact@nexus.alumni">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
