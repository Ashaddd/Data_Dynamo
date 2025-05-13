"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { AppNotification } from "@/lib/types";
import { mockNotifications } from "@/data/notifications"; // Using mock data for now
import { BellRing, CalendarCheck, MessageSquare, X } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';


interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationIcon = ({ type }: { type: AppNotification['type'] }) => {
  switch (type) {
    case 'event':
      return <CalendarCheck className="h-5 w-5 text-primary" />;
    case 'message':
      return <MessageSquare className="h-5 w-5 text-accent" />;
    case 'system':
      return <BellRing className="h-5 w-5 text-muted-foreground" />;
    default:
      return <BellRing className="h-5 w-5 text-muted-foreground" />;
  }
};

export default function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const notifications = mockNotifications; // In a real app, this would be fetched or come from state

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-4 border-b">
          <div className="flex justify-between items-center">
            <SheetTitle className="text-xl">Notifications</SheetTitle>
            <SheetClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-5 w-5" />
              </Button>
            </SheetClose>
          </div>
          <SheetDescription>
            Recent updates, messages, and event reminders.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-grow">
          {notifications.length > 0 ? (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <div key={notification.id} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <NotificationIcon type={notification.type} />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-semibold text-sm text-foreground">
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <Badge variant="destructive" className="text-xs px-1.5 py-0.5">New</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground/80">
                        {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                      </p>
                      {notification.link && (
                         <Button variant="link" size="sm" asChild className="p-0 h-auto mt-1 text-xs">
                           <Link href={notification.link}>View Details</Link>
                         </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-muted-foreground">
              <BellRing className="mx-auto h-12 w-12 mb-4" />
              <p className="text-lg">No new notifications</p>
              <p className="text-sm">You're all caught up!</p>
            </div>
          )}
        </ScrollArea>

        <SheetFooter className="p-4 border-t">
          <Button variant="outline" className="w-full" onClick={onClose}>
            Close Panel
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
