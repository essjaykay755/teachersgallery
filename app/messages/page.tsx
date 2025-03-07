"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  MoreVertical,
  Send,
  Image as ImageIcon,
  Phone,
  MessageSquare,
  User,
  AlertTriangle,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { AnimatedContainer, slideRight } from "@/components/ui/animations";
import { AvatarWithTypeIndicator } from "@/components/ui/avatar";
import { useAuth } from "@/lib/contexts/auth";

// Mock data for messages
const conversations = [
  {
    id: 1,
    name: "Priya Sharma",
    avatar: "/avatars/avatar1.jpg",
    lastMessage: "Thank you for your interest in my classes...",
    time: "2m ago",
    unread: 2,
    online: true,
    userType: "teacher"
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    avatar: "/avatars/avatar2.jpg",
    lastMessage: "Yes, I'm available for Physics tuition...",
    time: "1h ago",
    unread: 0,
    online: false,
    userType: "teacher"
  },
  {
    id: 3,
    name: "Anjali Desai",
    avatar: "/avatars/avatar3.jpg",
    lastMessage: "Let's schedule the trial class for tomorrow...",
    time: "2h ago",
    unread: 1,
    online: true,
    userType: "student"
  },
  // Add more conversations as needed
];

export default function Messages() {
  const { user, profile } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState(
    conversations[0]
  );
  const [messageInput, setMessageInput] = useState("");
  const [showActions, setShowActions] = useState(false);

  const handleRequestContact = (type: "phone" | "whatsapp") => {
    // Add logic to request contact
    console.log(`Requesting ${type} number...`);
    setShowActions(false);
  };

  const handleAssignTeacher = () => {
    // Add logic to assign teacher
    console.log("Assigning teacher...");
    setShowActions(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-[350px_1fr] h-[calc(100vh-12rem)]">
            {/* Conversations List */}
            <div className="border-r border-gray-100">
              <div className="p-4 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search messages"
                    className="pl-10 bg-gray-50 border-0"
                  />
                </div>
              </div>
              <div className="overflow-y-auto h-[calc(100%-73px)]">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 flex items-start gap-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedConversation.id === conversation.id
                        ? "bg-gray-50"
                        : ""
                    }`}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <div className="relative flex-shrink-0">
                      <AvatarWithTypeIndicator
                        userType={conversation.userType}
                        src={conversation.avatar}
                        size="md"
                        alt={conversation.name}
                      />
                      {conversation.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium">{conversation.name}</span>
                        <span className="text-xs text-gray-500">
                          {conversation.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.lastMessage}
                      </p>
                    </div>
                    {conversation.unread > 0 && (
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                        {conversation.unread}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <AvatarWithTypeIndicator
                      userType={selectedConversation.userType}
                      src={selectedConversation.avatar || "/default-avatar.png"}
                      size="sm"
                      alt={selectedConversation.name}
                    />
                    {selectedConversation.online && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div>
                    <h2 className="font-medium">{selectedConversation.name}</h2>
                    <p className="text-xs text-gray-500">
                      {selectedConversation.online ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={() => setShowActions(!showActions)}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>

                  {showActions && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50">
                      <button
                        onClick={() => handleRequestContact("phone")}
                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <Phone className="h-4 w-4" />
                        Request Phone Number
                      </button>
                      <button
                        onClick={() => handleRequestContact("whatsapp")}
                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <MessageSquare className="h-4 w-4" />
                        Request WhatsApp
                      </button>
                      <button
                        onClick={handleAssignTeacher}
                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 border-t border-gray-100 mt-2"
                      >
                        <User className="h-4 w-4" />
                        Assign as Teacher
                      </button>
                      <button
                        onClick={() => {
                          // Add report logic here
                          console.log("Reporting user...");
                          setShowActions(false);
                        }}
                        className="w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2 border-t border-gray-100 mt-2"
                      >
                        <AlertTriangle className="h-4 w-4" />
                        Report User
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {/* Sample messages - you would map through actual messages here */}
                <div className="flex gap-3 max-w-[80%]">
                  <div className="relative flex-shrink-0">
                    <AvatarWithTypeIndicator
                      userType={selectedConversation.userType}
                      src={selectedConversation.avatar || "/default-avatar.png"}
                      size="sm"
                      alt={selectedConversation.name}
                    />
                  </div>
                  <div>
                    <div className="bg-gray-100 rounded-2xl rounded-tl-none p-3">
                      <p className="text-sm">
                        Hi! I'm interested in your Mathematics classes. Could
                        you tell me more about your teaching methodology?
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">10:30 AM</span>
                  </div>
                </div>

                <div className="flex gap-3 max-w-[80%] ml-auto flex-row-reverse">
                  <div className="relative flex-shrink-0">
                    <AvatarWithTypeIndicator
                      userType={profile?.user_type || "student"}
                      src="/default-avatar.png"
                      size="sm"
                      alt="You"
                    />
                  </div>
                  <div className="text-right">
                    <div className="bg-blue-500 text-white rounded-2xl rounded-tr-none p-3">
                      <p className="text-sm">
                        Hello! Thank you for your interest. I follow an
                        interactive teaching approach...
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">10:32 AM</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="px-4 py-2 border-t border-gray-100 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRequestContact("phone")}
                  className="text-xs"
                >
                  <Phone className="h-3 w-3 mr-1" />
                  Request Phone
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRequestContact("whatsapp")}
                  className="text-xs"
                >
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Request WhatsApp
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAssignTeacher}
                  className="text-xs"
                >
                  <User className="h-3 w-3 mr-1" />
                  Assign as Teacher
                </Button>
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full flex-shrink-0"
                  >
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <div className="flex-1">
                    <Input
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      className="bg-gray-50 border-0 w-full"
                    />
                  </div>
                  <Button size="icon" className="rounded-full flex-shrink-0">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
