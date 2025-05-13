
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ChatConversation } from "@/lib/types";
import { mockChatConversations } from "@/data/chats"; // Using mock data
import { MessageCircle, Users, User, X, Search } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";


interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const getInitials = (name: string) => {
  if (!name) return "??";
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

const ConversationItem = ({ conversation }: { conversation: ChatConversation }) => {
  const { toast } = useToast();
  const handleChatOpen = () => {
    // Placeholder: In a real app, this would navigate to the chat or open a chat modal
    toast({
      title: "Open Chat",
      description: `Opening chat with ${conversation.participant.name}. (Placeholder)`,
    });
  };

  return (
    <div
      className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors cursor-pointer border-b"
      onClick={handleChatOpen}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleChatOpen(); }}
      tabIndex={0}
      role="button"
      aria-label={`Chat with ${conversation.participant.name}`}
    >
      <Avatar className="h-10 w-10">
        <AvatarImage src={conversation.participant.avatarUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${conversation.participant.name}`} alt={conversation.participant.name} data-ai-hint="user avatar" />
        <AvatarFallback>{getInitials(conversation.participant.name)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 overflow-hidden">
        <div className="flex justify-between items-center">
          <h4 className="font-semibold text-sm text-foreground truncate">
            {conversation.participant.name}
          </h4>
          {conversation.unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs px-1.5 py-0.5 whitespace-nowrap">
              {conversation.unreadCount} New
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {conversation.lastMessage.text}
        </p>
        <p className="text-xs text-muted-foreground/80 mt-0.5">
          {formatDistanceToNow(new Date(conversation.lastMessage.timestamp), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
};


export default function ChatPanel({ isOpen, onClose }: ChatPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  // In a real app, conversations would be fetched or come from state management
  const conversations = mockChatConversations;

  const filterConversations = (convs: ChatConversation[], type?: 'student' | 'alumni') => {
    let filtered = convs;
    if (type) {
      filtered = filtered.filter(c => c.participant.type === type);
    }
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(c =>
        c.participant.name.toLowerCase().includes(lowerSearchTerm) ||
        c.lastMessage.text.toLowerCase().includes(lowerSearchTerm)
      );
    }
    return filtered;
  };

  const studentConversations = filterConversations(conversations, 'student');
  const alumniConversations = filterConversations(conversations, 'alumni');
  const allFilteredConversations = filterConversations(conversations);


  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-4 border-b">
          <div className="flex justify-between items-center">
            <SheetTitle className="text-xl flex items-center gap-2">
              <MessageCircle className="h-6 w-6"/> Messages
            </SheetTitle>
            <SheetClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-5 w-5" />
              </Button>
            </SheetClose>
          </div>
           <div className="relative mt-2">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search messages or people..."
              className="w-full rounded-lg bg-muted pl-8 h-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </SheetHeader>

        <Tabs defaultValue="all" className="flex-grow flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-3 sticky top-0 bg-background z-10 p-1 border-b rounded-none">
            <TabsTrigger value="all" className="text-xs sm:text-sm"><Users className="mr-1 h-4 w-4" /> All</TabsTrigger>
            <TabsTrigger value="students" className="text-xs sm:text-sm"><User className="mr-1 h-4 w-4" /> Students</TabsTrigger>
            <TabsTrigger value="alumni" className="text-xs sm:text-sm"><User className="mr-1 h-4 w-4" /> Alumni</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="flex-grow">
            <TabsContent value="all">
              {allFilteredConversations.length > 0 ? (
                allFilteredConversations.map((conv) => <ConversationItem key={conv.id} conversation={conv} />)
              ) : (
                <p className="p-4 text-center text-sm text-muted-foreground">No messages found.</p>
              )}
            </TabsContent>
            <TabsContent value="students">
              {studentConversations.length > 0 ? (
                studentConversations.map((conv) => <ConversationItem key={conv.id} conversation={conv} />)
              ) : (
                <p className="p-4 text-center text-sm text-muted-foreground">No messages with students.</p>
              )}
            </TabsContent>
            <TabsContent value="alumni">
              {alumniConversations.length > 0 ? (
                alumniConversations.map((conv) => <ConversationItem key={conv.id} conversation={conv} />)
              ) : (
                <p className="p-4 text-center text-sm text-muted-foreground">No messages with alumni.</p>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <SheetFooter className="p-4 border-t">
          <Button variant="outline" className="w-full" onClick={onClose}>
            Close Messages
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
