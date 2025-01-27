"use client";
import React, { useState, useEffect } from "react";
import ProtectedRoute from "@/components/auth/protected-route-wrapper";
import useCurrentUser from "@/hooks/useCurrentUser";
import logout from "@/actions/logout";
import { usePathname } from "next/navigation";
import { Blocks, Plus, ChevronDown, Users, Ellipsis } from 'lucide-react'
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger, Sidebar, SidebarContent, SidebarHeader, SidebarGroup, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroupLabel, SidebarGroupContent, SidebarFooter } from "@/components/ui/sidebar";
import { SettingsModal } from "@/components/settings-dialog";
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenuTrigger, DropdownMenu, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { NewRoadmapSheet } from "@/components/new-roadmap-dialog";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/client";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
        const { user, loading } = useCurrentUser(); // Ensure proper type for 'user' (optional chaining or proper types for user fields)
        const initials = user?.user_metadata?.name?.split(" ").map((name: string) => name.charAt(0).toUpperCase()).join("") ?? "";
        const path = usePathname();
        const email = user?.email ?? "No email"; // Safe fallback
        const breadcrumbs = path.split("/").map((path) => path.charAt(0).toUpperCase() + path.slice(1)).slice(1);

        const [roadmaps, setRoadmaps] = useState<any>([]);

        useEffect(() => {
                if (!email || email === "No email") return; // Avoid fetching with invalid email

                const fetchRoadmaps = async () => {
                        try {
                                const client = await createClient();
                                const { data, error } = await client.from("roadmaps").select("*")
                                if (error) {
                                        console.error("Error fetching roadmaps:", error.message);
                                } else {
                                        setRoadmaps(data);
                                }
                        } catch (err) {
                                console.error("Unexpected error fetching roadmaps:", err);
                        }
                };

                fetchRoadmaps();
        }, [email]); // Add 'email' and 'client' as dependencies


        return (
                <ProtectedRoute user={user} loading={loading}>
                        <SidebarProvider>
                                <Sidebar variant="sidebar" collapsible="icon">
                                        <SidebarContent className="bg-sidebar/10">
                                                <SidebarHeader className="h-fit">
                                                        <DropdownMenu>
                                                                {roadmaps.length === 0 ? (
                                                                        // Case: No roadmaps, show only NewRoadmapSheet
                                                                        <DropdownMenuTrigger asChild>
                                                                                <SidebarMenuButton size="lg" className="flex justify-between items-center">
                                                                                        <div className="flex items-center gap-3">
                                                                                                <Avatar className="rounded-sm">
                                                                                                        <AvatarFallback className="bg-primary/20 rounded-sm">NR</AvatarFallback>
                                                                                                </Avatar>
                                                                                                <div className="flex flex-col">
                                                                                                        <h3 className="font-bold">New Roadmap</h3>
                                                                                                        <h3 className="text-sm text-muted-foreground">Create your first roadmap</h3>
                                                                                                </div>
                                                                                        </div>
                                                                                </SidebarMenuButton>
                                                                        </DropdownMenuTrigger>
                                                                ) : roadmaps.length === 1 ? (
                                                                        // Case: One roadmap, use it as the dropdown trigger
                                                                        <DropdownMenuTrigger asChild>
                                                                                <SidebarMenuButton size="lg" className="flex justify-between items-center">
                                                                                        <div className="flex items-center gap-3">
                                                                                                <Avatar className="rounded-sm">
                                                                                                        <AvatarFallback className="bg-primary/20 rounded-sm">
                                                                                                                {roadmaps[0].skill_name
                                                                                                                        .split(" ")
                                                                                                                        .map((word: string) => word.charAt(0).toUpperCase())
                                                                                                                        .join("")}
                                                                                                        </AvatarFallback>
                                                                                                </Avatar>
                                                                                                <div className="flex flex-col">
                                                                                                        <h3 className="font-bold">{roadmaps[0].skill_name}</h3>
                                                                                                        <h3 className="text-sm text-muted-foreground">
                                                                                                                {`${new Date(roadmaps[0].start_date).toLocaleDateString("en-US", {
                                                                                                                        day: "2-digit",
                                                                                                                        month: "short",
                                                                                                                })} - ${new Date(roadmaps[0].end_date).toLocaleDateString("en-US", {
                                                                                                                        day: "2-digit",
                                                                                                                        month: "short",
                                                                                                                })}`}
                                                                                                        </h3>
                                                                                                </div>
                                                                                                <span className="text-xs">
                                                                                                        <ChevronDown size={16} />
                                                                                                </span>
                                                                                        </div>
                                                                                </SidebarMenuButton>
                                                                        </DropdownMenuTrigger>
                                                                ) : (
                                                                        // Case: Multiple roadmaps
                                                                        <DropdownMenuTrigger asChild>
                                                                                <SidebarMenuButton size="lg" className="flex justify-between items-center">
                                                                                        <div className="flex items-center gap-3">
                                                                                                <Avatar className="rounded-sm">
                                                                                                        <AvatarFallback className="bg-primary/20 rounded-sm">WD</AvatarFallback>
                                                                                                </Avatar>
                                                                                                <div className="flex flex-col">
                                                                                                        <h3 className="font-bold">Web Development</h3>
                                                                                                        <h3 className="text-sm text-muted-foreground">24th Jan - 24th Feb</h3>
                                                                                                </div>
                                                                                        </div>
                                                                                        <span className="text-xs">
                                                                                                <ChevronDown size={16} />
                                                                                        </span>
                                                                                </SidebarMenuButton>
                                                                        </DropdownMenuTrigger>
                                                                )}
                                                                {roadmaps.length > 0 && (
                                                                        <DropdownMenuContent className="w-56">
                                                                                {roadmaps.map((roadmap: any) => {
                                                                                        const initials = roadmap.skill_name
                                                                                                .split(" ")
                                                                                                .map((word: string) => word.charAt(0).toUpperCase())
                                                                                                .join("");

                                                                                        const startDate = new Date(roadmap.start_date).toLocaleDateString("en-US", {
                                                                                                day: "2-digit",
                                                                                                month: "short",
                                                                                        });
                                                                                        const endDate = new Date(roadmap.end_date).toLocaleDateString("en-US", {
                                                                                                day: "2-digit",
                                                                                                month: "short",
                                                                                        });

                                                                                        return (
                                                                                                <DropdownMenuItem key={roadmap.id} asChild className="w-full">
                                                                                                        <SidebarMenuButton className="h-16 flex justify-between items-center">
                                                                                                                <div className="flex items-center gap-3">
                                                                                                                        <Avatar className="rounded-sm">
                                                                                                                                <AvatarFallback className="bg-primary/20 rounded-sm">{initials}</AvatarFallback>
                                                                                                                        </Avatar>
                                                                                                                        <div className="flex flex-col">
                                                                                                                                <h3 className="font-bold">{roadmap.skill_name}</h3>
                                                                                                                                <h3 className="text-sm text-muted-foreground">{`${startDate} - ${endDate}`}</h3>
                                                                                                                        </div>
                                                                                                                </div>
                                                                                                        </SidebarMenuButton>
                                                                                                </DropdownMenuItem>
                                                                                        );
                                                                                })}
                                                                                <DropdownMenuItem asChild className="w-full">
                                                                                        <NewRoadmapSheet />
                                                                                </DropdownMenuItem>
                                                                        </DropdownMenuContent>
                                                                )}
                                                        </DropdownMenu>

                                                </SidebarHeader>
                                                <SidebarGroup>
                                                        <SidebarGroupLabel>Account</SidebarGroupLabel>
                                                        <SidebarGroupContent>
                                                                <SidebarMenu >
                                                                        <SidebarMenuItem><SidebarMenuButton tooltip={"Dashboard"}><Blocks /> Dashboard</SidebarMenuButton></SidebarMenuItem>
                                                                        <SidebarMenuItem>
                                                                                <SidebarMenuButton tooltip={"Communities"}>
                                                                                        <Users /> Communities
                                                                                </SidebarMenuButton>
                                                                        </SidebarMenuItem>
                                                                        <SidebarMenuItem>
                                                                                <SettingsModal />
                                                                        </SidebarMenuItem>
                                                                </SidebarMenu>
                                                        </SidebarGroupContent>
                                                </SidebarGroup>
                                                <SidebarGroup>
                                                        <SidebarGroupLabel>Roadmap</SidebarGroupLabel>
                                                        <SidebarGroupContent>
                                                                <SidebarMenu>
                                                                        <SidebarMenuItem>
                                                                                <SidebarMenuButton className="text-center">1</SidebarMenuButton>
                                                                                <SidebarMenuButton disabled className="text-center">2</SidebarMenuButton>
                                                                                <SidebarMenuButton disabled className="text-center">3</SidebarMenuButton>
                                                                                <SidebarMenuButton disabled className="text-center">4</SidebarMenuButton>
                                                                                <SidebarMenuButton disabled className="text-center">5</SidebarMenuButton>
                                                                                <SidebarMenuButton disabled className="text-center">6</SidebarMenuButton>
                                                                                <SidebarMenuButton disabled className="text-center">7</SidebarMenuButton>
                                                                        </SidebarMenuItem>
                                                                </SidebarMenu>
                                                        </SidebarGroupContent>
                                                </SidebarGroup>
                                        </SidebarContent>
                                        <SidebarFooter>
                                                <SidebarMenuButton size="lg" className="hover:bg-inherit focus:bg-inherit flex justify-between">
                                                        <div className="flex gap-3 justify-between items-center">
                                                                <Avatar>
                                                                        <AvatarFallback>{initials}</AvatarFallback>
                                                                </Avatar>
                                                                <div className="flex flex-col ">
                                                                        <h3 className="font-bold">Himanshu Sardana</h3>
                                                                        <h3 className="text-muted-foreground truncate">{email}</h3>
                                                                </div>
                                                                <DropdownMenu>
                                                                        <DropdownMenuTrigger>
                                                                                <Button className="rounded-full" variant={"ghost"} size="icon">
                                                                                        <Ellipsis />
                                                                                </Button>
                                                                        </DropdownMenuTrigger>
                                                                        <DropdownMenuContent>
                                                                                <DropdownMenuItem className="text-red-500" onClick={() => logout()}>
                                                                                        Log Out
                                                                                </DropdownMenuItem>
                                                                        </DropdownMenuContent>
                                                                </DropdownMenu>
                                                        </div>
                                                </SidebarMenuButton>
                                        </SidebarFooter>
                                </Sidebar>
                                <main className="w-full">
                                        <div className="nav w-full px-3 h-16 flex items-center">
                                                <div className="flex flex-row gap-3">
                                                        <SidebarTrigger />
                                                        <Separator orientation="vertical" />
                                                        <h3>Dashboard</h3>
                                                </div>
                                        </div>
                                        <div className="px-3">
                                                {children}
                                        </div>
                                </main>
                        </SidebarProvider>
                </ProtectedRoute>
        );
}

