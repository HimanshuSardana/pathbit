import React, { useState, useTransition } from 'react'
import { SidebarMenuButton } from '@/components/ui/sidebar'
import { Sheet, SheetTrigger, SheetDescription, SheetHeader, SheetTitle, SheetContent, SheetFooter } from '@/components/ui/sheet'
import { Button } from './ui/button'
import { FloatingLabelInput } from './floating-label-input'
import { FloatingLabelTextarea } from './floating-label-textarea'
import { Plus } from 'lucide-react'
import { generateRoadmap } from '@/actions/generate_roadmap'
import { LoadingButton } from './ui/loading-button'

export function NewRoadmapSheet() {
        const [formData, setFormData] = useState({
                skillName: '',
                startDate: '',
                endDate: '',
                prereqKnowledge: '',
        });

        const [isPending, startTransition] = useTransition();

        const handleInputChange = (e: any) => {
                const { name, value } = e.target;
                setFormData((prev) => ({
                        ...prev,
                        [name]: value,
                }));
        };

        const handleSubmit = () => {
                startTransition(async () => {
                        try {
                                const result = await generateRoadmap(formData);
                                console.log('Roadmap created successfully:', result);
                                // Optionally clear form fields or provide feedback here
                        } catch (error) {
                                console.error('Error creating roadmap:', error);
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
                                        <SheetDescription>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque iusto expedita ipsa laboriosam deserunt sed nulla illum doloribus ea rem?</SheetDescription>
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
                                                <FloatingLabelInput
                                                        type="date"
                                                        name="startDate"
                                                        disabled={isPending}
                                                        value={formData.startDate}
                                                        onChange={handleInputChange}
                                                        className="w-full"
                                                        label="Start Date"
                                                />
                                                <FloatingLabelInput
                                                        type="date"
                                                        name="endDate"
                                                        value={formData.endDate}
                                                        disabled={isPending}
                                                        onChange={handleInputChange}
                                                        className="w-full"
                                                        label="End Date"
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

