"use server"
import { createClient } from "@/utils/supabase/server"
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { generateObject } from 'ai'
import { z } from "zod"

type RoadmapDescription = {
        skillName: string
        startDate: string
        endDate: string
        prereqKnowledge: string
}

const google = createGoogleGenerativeAI({
        apiKey: "AIzaSyACJmEUuOUzeaKK7F_CgNGO8Wk2gnCAe34"
});

const model = google('gemini-1.5-flash', {
        structuredOutputs: true,
})

const resourceSchema = z
        .record(z.string(), z.string())
        .describe("**REQUIRED** (can never be empty) A hashmap of resource names and their corresponding links. Make sure to include as many resources as possible to help the learner. Resources may be links to blogs or youtube videos etc.");

const daySchema = z
        .object({
                day: z
                        .string()
                        .describe("The identifier for the day (e.g., 'Day 1')."),
                task: z
                        .string()
                        .describe("The task to complete on this specific day."),
                resources: resourceSchema
                        .default({})
                        .describe("A record of resources for the task, defaulting to an empty object if not provided."),
                points: z
                        .number()
                        .default(0)
                        .describe("The number of points awarded for completing the task, defaulting to 0."),
        })
        .describe("Details of a single day in the roadmap, including day identifier, task, resources, and points.");

const roadmapSchema = z
        .object({
                roadmapDescription: z
                        .string()
                        .describe("A description outlining the purpose and goals of the roadmap."),
                feasibility: z
                        .enum(["true", "false", "partially"])
                        .describe("Indicates the feasibility of the roadmap (true, false, or partially)."),
                days: z
                        .array(daySchema)
                        .describe("An array containing details of each day in the roadmap."),
        })
        .describe("Schema for an entire roadmap, including its description, feasibility, and day-by-day breakdown.");

export async function generateRoadmap(data: RoadmapDescription) {
        const { skillName, startDate, endDate, prereqKnowledge } = data;
        //const client = createClient();
        try {
                const result = await generateObject({
                        model,
                        prompt: `Create a roadmap for learning ${skillName} starting on ${startDate} and ending on ${endDate}. The learner has the following prerequisite knowledge: ${prereqKnowledge}. DO NOT MAKE Week-wise timetables, make a DAY-wise timetable. Each day should include:
        - A task
        - Resources as a list of names and links (can be empty if no resources are needed)
        - Points assigned for completing the task.`,
                        schema: roadmapSchema,
                });
                console.log(`Generated roadmap for ${skillName}`, (result.object));
                return result.object
        } catch (error) {
                console.error("Error generating roadmap:", error);
                throw new Error("Failed to generate roadmap. Please check the input and try again.");
        }
}
