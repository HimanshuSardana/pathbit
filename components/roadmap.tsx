"use client";
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
import { Trash, ArrowLeft, Loader2, Check } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { toast } from "sonner";
import { Carousel, CarouselItem, CarouselContent, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
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
        const [results, setResults] = useState<any[]>([]); // Store results after submission
        const [isSubmitting, setIsSubmitting] = useState(false); // Manage submission state


        const handleAnswerChange = (index: number, value: string) => {
                setQuestions((prevQuestions) => {
                        const updatedQuestions = [...prevQuestions];
                        updatedQuestions[index].answer = value;
                        return updatedQuestions;
                });
        };

        const submitQuiz = async () => {
                setIsSubmitting(true);
                try {
                        const result = await checkAnswers(roadmap[currentDay].task, questions);
                        if (result.success) {
                                toast.success("Quiz submitted successfully.");
                                setResults(result.data); // Store results in state
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

        const [currentQuestion, setCurrentQuestion] = useState<number>(0);
        const [totalDays, setTotalDays] = useState<number>(roadmap.length);
        //const [progress, setProgress] = useState((currentDay / totalDays) * 100)
        const [progress, setProgress] = useState(75)

        return (
                <>
                        <div className="flex w-full justify-between items-start">
                                <div className="flex flex-col gap-1">
                                        <div className="px-5 w-[90vw] mx-auto">
                                                <div className="flex gap-5 items-center justify-center">
                                                        <h3 className="font-bold">Current Progress</h3>
                                                        <div className="flex justify-between w-[80%] rounded-full bg-accent/40">
                                                                <motion.div initial={{ width: 0 }} animate={{ width: 750 }} className={`progressbar bg-primary w-[75%] h-2 rounded-full`}></motion.div>
                                                        </div>
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
                                                {/* 
                                                <h3 className="text-3xl font-extrabold">Day {currentDay + 1}</h3>
                                                <Separator className="my-3" />

                                                <div>
                                                        <h3 className="text-xl font-extrabold">Today's Task</h3>
                                                        <p>{roadmap[currentDay].task}</p>
                                                </div>

                                                <div className="flex flex-col my-2">
                                                        <h3 className="font-bold text-xl">Resources</h3>
                                                        <div className="flex gap-3 mt-2 xs:flex-col md:flex-row">
                                                                <Carousel>
                                                                        <CarouselContent>
                                                                                {roadmap[currentDay].resources.map(
                                                                                        (resource: any, index: number) => {
                                                                                                return (
                                                                                                        <CarouselItem className="sm:basis-1 md:basis-1/3">
                                                                                                                <div
                                                                                                                        className="bg-accent/40 w-fit p-5 rounded-md"
                                                                                                                        key={index}
                                                                                                                >
                                                                                                                        <h3 className="font-bold text-xl">{resource.name}</h3>
                                                                                                                        <Link
                                                                                                                                href={resource.link}
                                                                                                                                className="text-muted-foreground"
                                                                                                                        >
                                                                                                                                {resource.link}
                                                                                                                        </Link>
                                                                                                                </div>
                                                                                                        </CarouselItem>
                                                                                                );
                                                                                        }
                                                                                )}
                                                                        </CarouselContent>
                                                                        <CarouselNext />
                                                                        <CarouselPrevious />
                                                                </Carousel>
                                                        </div>
                                                </div>

                                                <Sheet>
                                                        <SheetTrigger asChild>
                                                                <Button onClick={() => getQuestions()}>Mark as Completed</Button>
                                                        </SheetTrigger>
                                                        <SheetContent className="w-full">
                                                                <SheetHeader>
                                                                        <SheetTitle>Day {currentDay + 1} Quiz</SheetTitle>
                                                                        <h3 className="truncate">
                                                                                <span className="font-bold">Topic:</span> {roadmap[currentDay].task}
                                                                        </h3>
                                                                </SheetHeader>
                                                                <Separator className="my-3" />
                                                                <div className="my-3">
                                                                        {questions.length > 0 ? (
                                                                                <div className="flex flex-col gap-3">
                                                                                        <div className="flex flex-col gap-2">
                                                                                                <h3 className="font-bold text-md">
                                                                                                        {currentQuestion + 1}.{" "}
                                                                                                        {questions[currentQuestion].question}
                                                                                                </h3>
                                                                                                <FloatingLabelTextarea
                                                                                                        className=""
                                                                                                        label="Answer"
                                                                                                        value={questions[currentQuestion].answer || ""}
                                                                                                        onChange={(e) =>
                                                                                                                handleAnswerChange(
                                                                                                                        currentQuestion,
                                                                                                                        e.target.value
                                                                                                                )
                                                                                                        }
                                                                                                />
                                                                                        </div>
                                                                                        <div className="flex gap-2">
                                                                                                {currentQuestion > 0 && (
                                                                                                        <Button
                                                                                                                onClick={() =>
                                                                                                                        setCurrentQuestion((prev) => prev - 1)
                                                                                                                }
                                                                                                                className="w-fit"
                                                                                                        >
                                                                                                                Previous Question
                                                                                                        </Button>
                                                                                                )}
                                                                                                {currentQuestion < questions.length - 1 ? (
                                                                                                        <Button
                                                                                                                onClick={() =>
                                                                                                                        setCurrentQuestion((prev) => prev + 1)
                                                                                                                }
                                                                                                                className="w-fit"
                                                                                                        >
                                                                                                                Next Question
                                                                                                        </Button>
                                                                                                ) : (
                                                                                                        <Button
                                                                                                                onClick={submitQuiz}
                                                                                                                className="w-fit"
                                                                                                                disabled={isSubmitting}
                                                                                                        >
                                                                                                                {isSubmitting ? (
                                                                                                                        <Loader2 className="animate-spin text-primary" />
                                                                                                                ) : (
                                                                                                                        "Submit Quiz"
                                                                                                                )}
                                                                                                        </Button>
                                                                                                )}
                                                                                        </div>
                                                                                </div>
                                                                        ) : (
                                                                                <h3>
                                                                                        <Loader2 className="animate-spin text-primary" />{" "}
                                                                                        Loading Questions
                                                                                </h3>
                                                                        )}
                                                                </div>
                                                        </SheetContent>
                                                </Sheet>
                                                {results.length > 0 && (
                                                        <div className="mt-5">
                                                                <h3 className="font-bold text-lg">Results</h3>
                                                                <Accordion type="single" collapsible>
                                                                        {results.map((result: any, index: number) => (
                                                                                <AccordionItem key={index} value={`result-${index}`}>
                                                                                        <AccordionTrigger>
                                                                                                Question {index + 1}: {questions[index].question}
                                                                                        </AccordionTrigger>
                                                                                        <AccordionContent>
                                                                                                <p>
                                                                                                        <span className="font-bold">Grade:</span>{" "}
                                                                                                        {result.grade}/10
                                                                                                </p>
                                                                                                <p>
                                                                                                        <span className="font-bold">Analysis:</span>{" "}
                                                                                                        {result.analysis}
                                                                                                </p>
                                                                                        </AccordionContent>
                                                                                </AccordionItem>
                                                                        ))}
                                                                </Accordion>
                                                        </div>
                                                )}
                                        </div>
                                </div>
                                <Dialog>
                                        <DialogTrigger>
                                                <Button className="bg-red-500 font-bold hover:bg-red-500">
                                                        <Trash /> Delete
                                                </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                                <DialogHeader>
                                                        <h3 className="font-bold text-xl">Are you sure?</h3>
                                                        <p>
                                                                Are you sure you want to delete the{" "}
                                                                <span className="font-bold">{data.skill_name}</span> roadmap?
                                                        </p>
                                                </DialogHeader>
                                                <DialogFooter>
                                                        <Button variant={"ghost"} className="font-bold" onClick={() => { }}>
                                                                Cancel
                                                        </Button>
                                                        <Button
                                                                className="bg-red-500 font-bold hover:bg-red-500"
                                                                onClick={() => handleDelete(data.id)}
                                                        >
                                                                Delete
                                                        </Button>
                                                </DialogFooter>
                                        </DialogContent>
                                </Dialog>
                                                */}
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
                                                <Button className="font-bold" onClick={() => {
                                                        if (questions.length == 0) {
                                                                getQuestions()
                                                        }
                                                }
                                                } disabled={variant == "completed"}>{variant == "completed" ? (<>
                                                        <Check />
                                                        <h3>Completed</h3>
                                                </>) : (
                                                        <Sheet>
                                                                <SheetTrigger asChild>
                                                                        <h3>Mark as Completed</h3>
                                                                </SheetTrigger>
                                                                <SheetContent>
                                                                        <SheetHeader>
                                                                                <div className="flex flex-col gap-2">
                                                                                        <h3 className="font-extrabold text-xl">Day {day} Quiz</h3>
                                                                                        <p className="text-neutral-400">{task.slice(0, 40) + '...'}</p>
                                                                                        <Separator className="mt-1" />
                                                                                </div>
                                                                        </SheetHeader>
                                                                        <div className="flex flex-col gap-3">
                                                                                {questions.length > 0 ? (
                                                                                        <>
                                                                                                <h3 className="font-bold text-md">{questions[currentQuestion].question}</h3>
                                                                                                <FloatingLabelTextarea label="Answer" onChange={(e) => console.log(e.target.value)} />
                                                                                                <div className="flex gap-2 w-full">
                                                                                                        <Button className="" disabled={currentQuestion == 0} size={"icon"} onClick={() => setCurrentQuestion(currentQuestion - 1)}><ChevronLeft /></Button>
                                                                                                        <Button className={`${(currentQuestion == questions.length - 1) && 'hidden'}`} size={"icon"} onClick={() => setCurrentQuestion(currentQuestion + 1)}><ChevronRight /></Button>
                                                                                                </div>
                                                                                        </>
                                                                                ) : (
                                                                                        <h3>Loading Questions</h3>
                                                                                )}

                                                                        </div>

                                                                        <SheetFooter className="relative">
                                                                                {(currentQuestion == questions.length - 1) && (
                                                                                        <Button className="w-full" onClick={() => { }}>
                                                                                                Submit Quiz
                                                                                        </Button>
                                                                                )}
                                                                        </SheetFooter>
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
                        <div className="button w-full bg-accent/40 p-5">
                                <div className="flex justify-between items-center">
                                        <div>
                                                <div className="font-bold">{name}</div>
                                                <p className="text-neutral-400">{link.slice(0, 30) + '...'}</p>
                                        </div>
                                        <Button variant={"ghost"} size={"icon"}><ChevronRight /></Button>
                                </div>
                        </div>
                </Link>
        )
}
