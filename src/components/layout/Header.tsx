"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import AppLogo from './AppLogo';
import { MAIN_NAVIGATION_PUBLIC, AUTH_NAVIGATION, USER_HEADER_NAVIGATION, SITE_NAME } from '@/lib/constants';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, UserCircle, LayoutDashboard, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function Header() {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const allNavLinks = [
    ...MAIN_NAVIGATION_PUBLIC,
    ...AUTH_NAVIGATION,
    ...USER_HEADER_NAVIGATION
  ];

  const MobileNav = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-xs sm:max-w-sm bg-background p-4">
        <AppLogo className="mb-6" />
        <nav className="flex flex-col space-y-2">
          {MAIN_NAVIGATION_PUBLIC.map((item) => (
             <Button key={item.label} variant={pathname === item.href ? "secondary" : "ghost"} className="justify-start" asChild>
                <Link href={item.href} className="flex items-center gap-2">
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
             </Button>
          ))}
          <DropdownMenuSeparator />
          {user ? (
            <>
              {USER_HEADER_NAVIGATION.map((item) => (
                <Button key={item.label} variant={pathname === item.href ? "secondary" : "ghost"} className="justify-start" asChild>
                  <Link href={item.href} className="flex items-center gap-2">
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                </Button>
              ))}
              <Button variant="ghost" onClick={logout} className="justify-start text-destructive hover:text-destructive-foreground hover:bg-destructive">
                <LogOut className="mr-2 h-5 w-5" />
                Logout
              </Button>
            </>
          ) : (
            AUTH_NAVIGATION.map((item) => (
              <Button key={item.label} variant={pathname === item.href ? "secondary" : "ghost"} className="justify-start" asChild>
                  <Link href={item.href} className="flex items-center gap-2">
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
              </Button>
            ))
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AppLogo />
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {MAIN_NAVIGATION_PUBLIC.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "transition-colors hover:text-primary",
                pathname === item.href ? "text-primary font-semibold" : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          {loading ? (
            <div className="h-8 w-20 animate-pulse rounded-md bg-muted"></div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${user.name}`} alt={user.name} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">
                    <UserCircle className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive focus:bg-destructive focus:text-destructive-foreground">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              {AUTH_NAVIGATION.map(item => (
                <Button key={item.label} variant={item.href === "/register" ? "default" : "outline"} asChild>
                  <Link href={item.href} className="flex items-center gap-1">
                     <item.icon className="h-4 w-4" /> {item.label}
                  </Link>
                </Button>
              ))}
            </div>
          )}
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
