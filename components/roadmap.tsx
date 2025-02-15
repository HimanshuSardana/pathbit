"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useState } from "react";
import {
        Accordion,
        AccordionItem,
        AccordionContent,
        AccordionTrigger,
} from "./ui/accordion";
import Link from "next/link";
import { motion } from 'motion/react'
import { Button } from "./ui/button";
import { NewRoadmapSheet } from "./new-roadmap-dialog";
import { ChevronRight, Lock, Unlock, ChevronLeft } from "lucide-react";
import { Trash, ArrowLeft, Loader2, Check, Settings, Pencil } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { toast } from "sonner";
import { Carousel, CarouselItem, CarouselContent, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { editRoadmap } from "@/actions/edit-roadmap";
import {
        Dialog,
        DialogTrigger,
        DialogContent,
        DialogHeader,
        DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
        Sheet,
        SheetHeader,
        SheetTrigger,
        SheetTitle,
        SheetFooter,
        SheetContent,
} from "@/components/ui/sheet";
import { generateQuestions } from "@/actions/generate_questions";
import { FloatingLabelTextarea } from "./floating-label-textarea";
import { checkAnswers } from "@/actions/check_answers";
import { revalidatePath } from "next/cache";
import useCurrentUser from "@/hooks/useCurrentUser";

export function Roadmap({ data }: { data: any }) {
        const handleDelete = async (id: number) => {
                const supabase = await createClient();

                const { error } = await supabase.from("roadmaps").delete().eq("id", id);
                if (!error) {
                        toast.success("Roadmap deleted successfully.");
                } else {
                        toast.error("An error occurred while deleting the roadmap.");
                        console.log(error);
                }
        };

        if (!data) {
                return (
                        <>
                                <div className="flex flex-col">
                                        <p className="text-muted-foreground">No roadmap selected.</p>
                                        <NewRoadmapSheet />
                                </div>
                        </>
                )
        }

        const roadmap = JSON.parse(data.roadmap);
        //const [currentDay, setCurrentDay] = useState<number>(data.completed);
        const [currentDay, setCurrentDay] = useState<number>(5);




        const [currentQuestion, setCurrentQuestion] = useState<number>(0);
        const [totalDays, setTotalDays] = useState<number>(8);
        const [progress, setProgress] = useState((currentDay / totalDays) * 100)
        const [edits, setEdits] = useState<string>();
        //const [progress, setProgress] = useState(75)

        const { user } = useCurrentUser();
        const email = user?.email;

        const handleRoadmapEdit = async (email: string, roadmap: any, edits: string) => {
                const result = await editRoadmap({ id: data.id, email, currentRoadmap: roadmap, edits });
                console.log(result.data)
        }
        return (
                <>
                        <div className="flex w-full justify-between items-start">
                                <div className="flex flex-col gap-1">
                                        <div className="px-5 w-[90vw] mx-auto">
                                                <div className="flex gap-5 items-center justify-center">
                                                        <h3 className="font-bold">Current Progress</h3>
                                                        <div className="flex justify-between w-[80%] rounded-full bg-accent/40">
                                                                <motion.div
                                                                        initial={{ width: 0 }}
                                                                        animate={{ width: `${progress}%` }}
                                                                        className="progressbar bg-primary h-2 rounded-full"
                                                                ></motion.div>
                                                        </div>
                                                        <Dialog>
                                                                <DialogTrigger>
                                                                        <Button variant={"ghost"} size={"icon"} className="rounded-full hover:text-primary"><Settings /></Button>
                                                                </DialogTrigger>
                                                                <DialogContent>
                                                                        <h3 className="font-extrabold">Edit Exisiting Roadmap</h3>
                                                                        <p className="text-muted-foreground">Not happy with the current roadmap? Suggest changes you'd like to see.</p>
                                                                        <FloatingLabelTextarea label="Description" onChange={(e) => setEdits(e.target.value)} />
                                                                        <DialogFooter>
                                                                                <Button className="font-bold" onClick={() => handleRoadmapEdit(email, roadmap, edits)}><Pencil /> Edit Roadmap</Button>
                                                                        </DialogFooter>
                                                                </DialogContent>
                                                        </Dialog>
                                                </div>
                                                <div className="flex flex-col gap-10 items-center justify-center mt-10">
                                                        {roadmap.map((day: any, index: number) => (
                                                                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0, transition: { delay: index * 0.2 } }}>
                                                                        <RoadmapButton
                                                                                day={(index + 1).toString()}
                                                                                points={day.points}
                                                                                resources={day.resources}
                                                                                value={index + 1}
                                                                                variant={index < currentDay ? "completed" : index == currentDay ? "unlocked" : "locked"}
                                                                                position={index % 2 == 0 ? "left" : "right"}
                                                                                task={day.task}
                                                                        />
                                                                </motion.div>
                                                        ))}
                                                </div>
                                        </div>
                                </div>
                        </div >
                </>
        );
}

type RoadmapButtonProps = {
        day: string;
        points: number;
        resources: any;
        value: number;
        variant: "locked" | "unlocked" | "completed";
        position: string;
        task: string;
}

function RoadmapButton({ day, points, resources, value, variant, position, task }: RoadmapButtonProps) {
        const handleAnswerChange = (index: number, value: string) => {
                setQuestions((prevQuestions) => {
                        return prevQuestions.map((q, i) =>
                                i === index ? { ...q, answer: value } : q
                        );
                });
        };

        const [results, setResults] = useState<any[]>([]);
        const [isSubmitting, setIsSubmitting] = useState(false);
        const [questions, setQuestions] = useState<any[]>([]);

        const getQuestions = async () => {
                const result = await generateQuestions(task);
                if (result.success) {
                        toast.success("Questions generated successfully.");
                        const questionsWithAnswers = result.data.map((q: any) => ({
                                ...q,
                                answer: "",
                        }));
                        setQuestions(questionsWithAnswers);
                } else {
                        toast.error("An error occurred while generating questions.");
                        console.log(result.message);
                }
        };

        const submitQuiz = async () => {
                setIsSubmitting(true);
                try {
                        const result = await checkAnswers(task, questions);
                        if (result.success) {
                                toast.success("Quiz submitted successfully.");
                                setResults(result.data);
                                console.log(result.data)
                        } else {
                                toast.error("Failed to submit the quiz.");
                        }
                } catch (error) {
                        toast.error("An unexpected error occurred.");
                        console.error(error);
                } finally {
                        setIsSubmitting(false);
                }
        };

        const [currentQuestion, setCurrentQuestion] = useState(0)
        return (
                <Popover>
                        <PopoverTrigger asChild>
                                <div className={`${position == 'left' && '-ml-[10rem]'} ${position == 'right' && '-mr-[10rem]'} ${variant == "locked" && 'bg-accent/40'} ${(variant == 'unlocked' || variant == "completed") && 'bg-primary'} cursor-pointer w-24 h-24 flex items-center justify-center p-8 font-extrabold text-xl rounded-full`}>
                                        {variant == "locked" && <h3>{<Lock />}</h3>}
                                        {variant == "completed" && <h3>{<Check size={32} />}</h3>}
                                        {variant == "unlocked" && (
                                                <div className="flex flex-col gap-[-5px] justify-center items-center">
                                                        <h3 className="uppercase text-sm tracking-wide">Day</h3>
                                                        <h3 className="text-3xl -mt-1">{value}</h3>
                                                </div>
                                        )}
                                </div>
                        </PopoverTrigger>
                        {variant != "locked" && (
                                <PopoverContent side="top">
                                        <div className="flex flex-col gap-3">
                                                <h3 className="font-extrabold text-lg">Day {day}</h3>
                                                <p className="text-neutral-400">{task}</p>
                                                <Dialog>
                                                        <DialogTrigger>
                                                                <Button className="w-full bg-inherit text-primary font-bold hover:bg-inherit">View Resources</Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                                <h3 className="font-extrabold text-lg">Resources for Day {day}</h3>

                                                                {resources.map((resource: any) => (
                                                                        <ResourceButton name={resource.name} link={resource.link} />
                                                                ))}
                                                        </DialogContent>
                                                </Dialog>
                                                <Button className="font-bold" disabled={variant == "completed"}>{variant == "completed" ? (<>
                                                        <Check />
                                                        <h3>Completed</h3>
                                                </>) : (
                                                        <Sheet onOpenChange={(open) => {
                                                                if (open) {
                                                                        setResults([])
                                                                        getQuestions()
                                                                }
                                                        }}>
                                                                <SheetTrigger asChild>
                                                                        <h3>Mark as Completed</h3>
                                                                </SheetTrigger>
                                                                <SheetContent className="max-h-screen overflow-y-scroll">
                                                                        <SheetHeader>
                                                                                <div className="flex flex-col gap-2">
                                                                                        <h3 className="font-extrabold text-xl">Day {day} Quiz</h3>
                                                                                        <p className="text-neutral-400">{task.slice(0, 40) + '...'}</p>
                                                                                        <Separator className="mt-1" />
                                                                                </div>
                                                                        </SheetHeader>
                                                                        <div className="flex flex-col gap-3 mt-2">
                                                                                {questions.length > 0 ? (
                                                                                        <>
                                                                                                <h3 className="font-bold text-md">{questions[currentQuestion].question}</h3>
                                                                                                <FloatingLabelTextarea value={questions[currentQuestion].answer} label="Answer" onChange={(e) => handleAnswerChange(
                                                                                                        currentQuestion,
                                                                                                        e.target.value
                                                                                                )} />
                                                                                                <div className="flex gap-2 w-full">
                                                                                                        <Button className="" disabled={currentQuestion == 0} size={"icon"} onClick={() => setCurrentQuestion(currentQuestion - 1)}><ChevronLeft /></Button>
                                                                                                        <Button className={`${(currentQuestion == questions.length - 1) && 'hidden'}`} size={"icon"} onClick={() => setCurrentQuestion(currentQuestion + 1)}><ChevronRight /></Button>
                                                                                                </div>
                                                                                        </>
                                                                                ) : (
                                                                                        <div className="flex gap-3 items-center">
                                                                                                <div className="animate animate-spin text-primary">
                                                                                                        <Loader2 />
                                                                                                </div>
                                                                                                <h3>Loading Questions</h3>
                                                                                        </div>
                                                                                )}
                                                                                <div>
                                                                                        <div className="flex gap-2">
                                                                                                <h3 className="font-bold">Total Marks</h3>
                                                                                                {results.length > 0 && (
                                                                                                        <div className="flex gap-2">
                                                                                                                <h3 className={`${(results.reduce((acc, curr) => acc + curr.grade, 0)) > 25 ? 'text-green-500' : 'text-red-500'}`}>{results.reduce((acc, curr) => acc + curr.grade, 0)}/50</h3>
                                                                                                        </div>
                                                                                                )}

                                                                                        </div>
                                                                                        <Accordion type="single" collapsible className="mt-4">
                                                                                                {results.length > 0 && (
                                                                                                        results.map((result: any, index: number) => (
                                                                                                                <AccordionItem className="border px-5" key={index} value={index.toString()}>
                                                                                                                        <AccordionTrigger>
                                                                                                                                <h3 className="font-bold">Question {index + 1}</h3>
                                                                                                                        </AccordionTrigger>
                                                                                                                        <AccordionContent>
                                                                                                                                <div className="flex flex-col gap-2">
                                                                                                                                        <h3>
                                                                                                                                                {result.analysis}
                                                                                                                                        </h3>
                                                                                                                                        <Separator className="my-2" />
                                                                                                                                        <h3 className="font-bold">Points: <span className="font-normal">{result.grade}/10</span></h3>
                                                                                                                                </div>
                                                                                                                        </AccordionContent>
                                                                                                                </AccordionItem>
                                                                                                        ))
                                                                                                )}
                                                                                        </Accordion>
                                                                                </div>

                                                                        </div>
                                                                        <ScrollArea>
                                                                                <SheetFooter className="relative flex flex-col">
                                                                                        <div>
                                                                                                {(currentQuestion == questions.length - 1) && (
                                                                                                        <Button disabled={isSubmitting} className="w-full" onClick={submitQuiz}>
                                                                                                                Submit Quiz
                                                                                                        </Button>
                                                                                                )}
                                                                                        </div>
                                                                                </SheetFooter>
                                                                        </ScrollArea>
                                                                </SheetContent>


                                                        </Sheet>
                                                )}</Button>
                                        </div>
                                </PopoverContent>
                        )
                        }
                </Popover >
        )
}

type ResourceButtonProps = {
        link: string;
        name: string;
}

function ResourceButton({ name, link }: ResourceButtonProps) {
        return (
                <Link href={link}>
                        <div className="button w-full bg-accent/40 p-5 rounded-md">
                                <div className="flex justify-between items-center">
                                        <div>
                                                <div className="font-bold">{name}</div>
                                                <p className="text-neutral-400">{link.slice(0, 30) + '...'}</p>
                                        </div>
                                        <Button variant={"ghost"} size={"icon"} className="rounded-full"><ChevronRight /></Button>
                                </div>
                        </div>
                </Link>
        )
}
