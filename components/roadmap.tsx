"use client";
import React, { useState } from "react";
import {
        Accordion,
        AccordionItem,
        AccordionContent,
        AccordionTrigger,
} from "./ui/accordion";
import Link from "next/link";
import { Button } from "./ui/button";
import { NewRoadmapSheet } from "./new-roadmap-dialog";
import { Trash, ArrowLeft, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
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
        const [currentDay, setCurrentDay] = useState<number>(data.completed);
        const [questions, setQuestions] = useState<any[]>([]);
        const [results, setResults] = useState<any[]>([]); // Store results after submission
        const [isSubmitting, setIsSubmitting] = useState(false); // Manage submission state

        const getQuestions = async () => {
                const result = await generateQuestions(roadmap[currentDay].task);
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

        return (
                <>
                        <div className="flex w-full justify-between items-start">
                                <div className="flex flex-col gap-1">
                                        <Button
                                                variant={"secondary"}
                                                className="bg-inherit text-primary font-bold w-fit"
                                                disabled={currentDay == 0}
                                        >
                                                <ArrowLeft /> Previous Days
                                        </Button>
                                        <div className="px-5">
                                                <h3 className="text-3xl font-extrabold">Day {currentDay + 1}</h3>
                                                <Separator className="my-3" />

                                                <div>
                                                        <h3 className="text-xl font-extrabold">Today's Task</h3>
                                                        <p>{roadmap[currentDay].task}</p>
                                                </div>

                                                <div className="flex flex-col my-2">
                                                        <h3 className="font-bold text-xl">Resources</h3>
                                                        <div className="flex gap-3 mt-2 xs:flex-col md:flex-row">
                                                                {roadmap[currentDay].resources.map(
                                                                        (resource: any, index: number) => {
                                                                                return (
                                                                                        <div
                                                                                                className="bg-card w-fit px-5 py-5 rounded-md"
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
                                                                                );
                                                                        }
                                                                )}
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
                        </div>
                </>
        );
}
