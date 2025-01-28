"use client"
import { useState, useTransition, useEffect } from "react";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import {
        Sheet,
        SheetTrigger,
        SheetDescription,
        SheetHeader,
        SheetTitle,
        SheetContent,
        SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { FloatingLabelInput } from "./floating-label-input";
import { FloatingLabelTextarea } from "./floating-label-textarea";
import { Plus } from "lucide-react";
import { generateRoadmap } from "@/actions/generate_roadmap";
import { LoadingButton } from "./ui/loading-button";
import { toast } from "sonner";
import useCurrentUser from "@/hooks/useCurrentUser";
import { DateRangePicker } from "./ui/date-range-picker";

export function NewRoadmapSheet() {
        const { user } = useCurrentUser();
        const [formData, setFormData] = useState({
                email: "",
                skillName: "",
                startDate: "",
                endDate: "",
                prereqKnowledge: "",
        });

        useEffect(() => {
                if (user) {
                        setFormData((prev: any) => ({
                                ...prev,
                                email: user.email,
                        }));
                }
        }, [user]);

        const [isPending, startTransition] = useTransition();

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                const { name, value } = e.target;
                setFormData((prev) => ({
                        ...prev,
                        [name]: value,
                }));
        };

        const handleDateRangeChange = (range: { from: string; to: string }) => {
                setFormData((prev) => ({
                        ...prev,
                        startDate: range.from,
                        endDate: range.to,
                }));
        };

        const handleSubmit = () => {
                startTransition(async () => {
                        try {
                                const result = await generateRoadmap(formData);
                                if (result.success) {
                                        toast.success(result.message);
                                } else {
                                        toast.error(result.message);
                                }
                        } catch (error) {
                                console.error("Error creating roadmap:", error);
                                toast.error("Failed to create roadmap. Please try again.");
                        }
                });
        };

        return (
                <Sheet>
                        <SheetTrigger asChild>
                                <SidebarMenuButton className="h-16 flex justify-start items-center gap-3">
                                        <div className="w-fit h-fit border border-2 rounded-md border-foreground/70 border-dashed p-2">
                                                <Plus />
                                        </div>
                                        <h3>New Roadmap</h3>
                                </SidebarMenuButton>
                        </SheetTrigger>
                        <SheetContent>
                                <SheetHeader className="mb-5">
                                        <SheetTitle>New Roadmap</SheetTitle>
                                        <SheetDescription>
                                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque iusto expedita ipsa laboriosam deserunt sed nulla illum doloribus ea rem?
                                        </SheetDescription>
                                </SheetHeader>
                                <div className="flex flex-col gap-3">
                                        <FloatingLabelInput
                                                name="skillName"
                                                value={formData.skillName}
                                                disabled={isPending}
                                                onChange={handleInputChange}
                                                label="What skill would you like to learn?"
                                        />
                                        <div className="flex gap-1 w-full justify-between">
                                                <DateRangePicker
                                                        value={{ from: formData.startDate, to: formData.endDate }}
                                                        onChange={handleDateRangeChange}
                                                />
                                        </div>
                                        <FloatingLabelTextarea
                                                name="prereqKnowledge"
                                                value={formData.prereqKnowledge}
                                                disabled={isPending}
                                                onChange={handleInputChange}
                                                label="What do you already know about this skill?"
                                        />
                                </div>
                                <SheetFooter className="mt-5">
                                        <LoadingButton
                                                className="font-bold"
                                                disabled={isPending}
                                                loading={isPending}
                                                onClick={handleSubmit}
                                        >
                                                {!isPending && <Plus />} Create
                                        </LoadingButton>
                                </SheetFooter>
                        </SheetContent>
                </Sheet>
        );
}
