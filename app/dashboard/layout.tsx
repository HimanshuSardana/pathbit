"use client";
import React, { useState, useEffect } from "react";
import ProtectedRoute from "@/components/auth/protected-route-wrapper";
import useCurrentUser from "@/hooks/useCurrentUser";
import logout from "@/actions/logout";
import { usePathname } from "next/navigation";
import { Blocks, Plus, ChevronDown, Users, Ellipsis } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Roadmap } from "@/components/roadmap";
import {
        SidebarProvider,
        SidebarTrigger,
        Sidebar,
        SidebarContent,
        SidebarHeader,
        SidebarGroup,
        SidebarMenu,
        SidebarMenuItem,
        SidebarMenuButton,
        SidebarGroupLabel,
        SidebarGroupContent,
        SidebarFooter,
} from "@/components/ui/sidebar";
import { SettingsModal } from "@/components/settings-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
        DropdownMenuTrigger,
        DropdownMenu,
        DropdownMenuContent,
        DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
        Dialog,
        DialogTrigger,
        DialogContent,
        DialogHeader,
        DialogTitle,
        DialogFooter,
} from "@/components/ui/dialog";
import { NewRoadmapSheet } from "@/components/new-roadmap-dialog";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/client";

type Roadmap = {
        id: number;
        skill_name: string;
        start_date: string;
        end_date: string;
        roadmap: Milestone[];
};

type Milestone = {
        title: string;
        description: string;
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
        const { user, loading } = useCurrentUser();
        const initials =
                user?.user_metadata?.name
                        ?.split(" ")
                        .map((name: string) => name.charAt(0).toUpperCase())
                        .join("") ?? "";
        const path = usePathname();
        const email = user?.email ?? "No email";
        const breadcrumbs = path.split("/").map((p) => p.charAt(0).toUpperCase() + p.slice(1)).slice(1);

        const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
        const [selectedRoadmap, setSelectedRoadmap] = useState<number>(0);

        useEffect(() => {
                if (!email || email === "No email") return;

                const fetchRoadmaps = async () => {
                        try {
                                const client = await createClient();
                                const { data, error } = await client.from("roadmaps").select("*");
                                if (error) {
                                        console.error("Error fetching roadmaps:", error.message);
                                } else {
                                        setRoadmaps(data || []);
                                }
                        } catch (err) {
                                console.error("Unexpected error fetching roadmaps:", err);
                        }
                };

                fetchRoadmaps();
        }, [email]);

        const handleRoadmapSelect = (index: number) => {
                setSelectedRoadmap(index);
        };

        return (
                <ProtectedRoute user={user} loading={loading}>
                        <SidebarProvider>
                                <Sidebar variant="sidebar" collapsible="icon">
                                        <SidebarContent className="bg-sidebar/10">
                                                <SidebarHeader className="py-3">
                                                        <DropdownMenu>
                                                                <DropdownMenuTrigger className="">
                                                                        {roadmaps.length === 0 ? (
                                                                                <CourseButton
                                                                                        skill_name="No Roadmaps"
                                                                                        start_date="N/A"
                                                                                        end_date="N/A"
                                                                                        disabled={true}
                                                                                        onClick={() => { }}
                                                                                />
                                                                        ) : (
                                                                                <CourseButton
                                                                                        skill_name={roadmaps[selectedRoadmap]?.skill_name || "No Roadmap"}
                                                                                        start_date={roadmaps[selectedRoadmap]?.start_date || "N/A"}
                                                                                        end_date={roadmaps[selectedRoadmap]?.end_date || "N/A"}
                                                                                        disabled={false}
                                                                                        onClick={() => { }}
                                                                                />
                                                                        )}
                                                                </DropdownMenuTrigger>
                                                                {roadmaps.length >= 1 && (
                                                                        <DropdownMenuContent>
                                                                                {roadmaps.map((roadmap, index) => (
                                                                                        <DropdownMenuItem key={roadmap.id}>
                                                                                                <CourseButton
                                                                                                        skill_name={roadmap.skill_name}
                                                                                                        start_date={roadmap.start_date}
                                                                                                        end_date={roadmap.end_date}
                                                                                                        disabled={index === selectedRoadmap}
                                                                                                        onClick={() => handleRoadmapSelect(index)}
                                                                                                />
                                                                                        </DropdownMenuItem>
                                                                                ))}
                                                                                <NewRoadmapSheet />
                                                                        </DropdownMenuContent>
                                                                )}
                                                        </DropdownMenu>
                                                </SidebarHeader>
                                                <SidebarGroup>
                                                        <SidebarGroupLabel>Account</SidebarGroupLabel>
                                                        <SidebarGroupContent>
                                                                <SidebarMenu>
                                                                        <SidebarMenuItem>
                                                                                <SidebarMenuButton tooltip={"Dashboard"}>
                                                                                        <Blocks /> Dashboard
                                                                                </SidebarMenuButton>
                                                                        </SidebarMenuItem>
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
                                                                <div className="flex flex-col">
                                                                        <h3 className="font-bold">{user?.user_metadata?.name || "User"}</h3>
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
                                        <div className="p-3 px-10">
                                                {roadmaps && <Roadmap data={roadmaps[selectedRoadmap]} />}
                                                {children}
                                        </div>
                                </main>
                        </SidebarProvider>
                </ProtectedRoute>
        );
}

type CourseButtonProps = {
        skill_name: string;
        start_date: string;
        end_date: string;
        disabled: boolean;
        onClick: () => void;
};

function CourseButton({ skill_name, start_date, end_date, disabled, onClick }: CourseButtonProps) {
        return (
                <SidebarMenuButton
                        size="lg"
                        className="w-full h-fit flex justify-between items-center"
                        onClick={onClick}
                        disabled={disabled}
                >
                        <div className="flex items-center gap-3">
                                <Avatar className="rounded-sm">
                                        <AvatarFallback className="bg-primary/20 rounded-sm">
                                                {skill_name
                                                        .split(" ")
                                                        .map((word) => word.charAt(0).toUpperCase())
                                                        .join("")}
                                        </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                        <h3 className="font-bold">{skill_name}</h3>
                                        <h3 className="text-sm text-muted-foreground">
                                                {start_date !== "N/A" && end_date !== "N/A"
                                                        ? `${new Date(start_date).toLocaleDateString("en-US", {
                                                                day: "2-digit",
                                                                month: "short",
                                                        })} - ${new Date(end_date).toLocaleDateString("en-US", {
                                                                day: "2-digit",
                                                                month: "short",
                                                        })}`
                                                        : "No Dates"}
                                        </h3>
                                </div>
                        </div>
                </SidebarMenuButton>
        );
}

