"use client"
import React from 'react';
import { Accordion, AccordionItem, AccordionContent, AccordionTrigger } from './ui/accordion';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from './ui/button';
import { Trash, ArrowLeft } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator';

export function Roadmap({ data }: { data: any }) {
        const handleDelete = async (id: number) => {
                const supabase = await createClient();

                const { error } = await supabase.from('roadmaps').delete().eq('id', id);
                if (!error) {
                        toast.success("Roadmap deleted successfully.");
                }
                else {
                        toast.error("An error occurred while deleting the roadmap.");
                        console.log(error)
                }
        }

        if (!data) {
                return <p className="text-muted-foreground">No roadmap selected.</p>; // Fallback message
        }
        const roadmap = JSON.parse(data.roadmap);
        const [currentDay, setCurrentDay] = useState<number>(data.completed);

        return (
                <>
                        <div className="flex w-full justify-between items-start">
                                <div className='flex flex-col gap-1'>
                                        {/* <h3 className="text-3xl font-extrabold">{data.skill_name}</h3> */}
                                        <Button variant={"secondary"} className='bg-inherit text-primary font-bold w-fit' disabled={currentDay == 0}><ArrowLeft /> Previous Days</Button>
                                        <div className="px-5">
                                                <h3 className='text-3xl font-extrabold'>Day {currentDay + 1}</h3>
                                                <Separator className='my-3' />

                                                <div>
                                                        <h3 className='text-xl font-extrabold'>Today's Task</h3>
                                                        <p>{roadmap[currentDay].task}</p>
                                                </div>

                                                <div className='flex flex-col my-2'>
                                                        <h3 className='font-bold text-xl'>Resources</h3>
                                                        <div className="flex gap-3 mt-2 xs:flex-col md:flex-row">
                                                                {roadmap[currentDay].resources.map((resource: any, index: number) => {
                                                                        return (
                                                                                <div className="bg-card w-fit px-5 py-5 rounded-md">
                                                                                        <h3 className='font-bold text-xl'>{resource.name}</h3>
                                                                                        <Link href={resource.link} className="text-muted-foreground">{resource.link}</Link>
                                                                                </div>
                                                                        )
                                                                })}
                                                        </div>
                                                </div>
                                                <Button onClick={() => setCurrentDay(currentDay + 1)}>Mark as Completed</Button>
                                        </div>
                                </div>
                                <Dialog>
                                        <DialogTrigger>
                                                <Button className='bg-red-500 font-bold hover:bg-red-500'><Trash /> Delete</Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                                <DialogHeader>
                                                        <h3 className='font-bold text-xl'>Are you sure?</h3>
                                                        <p>Are you sure you want to delete the <span className='font-bold'>{data.skill_name}</span> roadmap?</p>
                                                </DialogHeader>
                                                <DialogFooter>
                                                        <Button variant={"ghost"} className='font-bold' onClick={() => { }}>Cancel</Button>
                                                        <Button className='bg-red-500 font-bold hover:bg-red-500' onClick={() => handleDelete(data.id)}>Delete</Button>
                                                </DialogFooter>
                                        </DialogContent>
                                </Dialog>
                        </div>
                </>
        );
}

