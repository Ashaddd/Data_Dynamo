"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from '@/components/ui/sidebar'; // Ensure this path is correct for your shadcn/ui sidebar
import AppLogo from './AppLogo';
import { Button } from '@/components/ui/button';
import { LogOut, Settings, Bell } from 'lucide-react';
import { DASHBOARD_NAVIGATION } from '@/lib/constants';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left" className="border-r">
      <SidebarHeader className="flex items-center justify-between p-4">
        <AppLogo iconSize={24} textSize="text-xl" />
        <SidebarTrigger className="md:hidden" />
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarMenu>
          {DASHBOARD_NAVIGATION.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={{ children: item.label, side: 'right', align: 'center' }}
              >
                <Link href={item.href} className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  <span className="truncate">{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-2 border-t">
        {user && (
          <div className="flex items-center gap-3 p-2 group-data-[collapsible=icon]:justify-center">
            <Avatar className="h-9 w-9 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8">
              <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${user.name}`} alt={user.name} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="truncate group-data-[collapsible=icon]:hidden">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={logout} 
              className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
              tooltip={{ children: 'Logout', side: 'right', align: 'center' }}
            >
              <LogOut className="h-5 w-5" />
              <span className="truncate">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
