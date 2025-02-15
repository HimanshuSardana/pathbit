"use server"
import { createClient } from "@/utils/supabase/server"
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai'

if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
        throw new Error("NEXT_PUBLIC_GEMINI_API_KEY is not defined")
}
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY)

type RoadmapInfo = {
        id: number
        email: string
        currentRoadmap: any,
        edits: string,
}

export async function editRoadmap(formData: RoadmapInfo) {
        const { id, email, currentRoadmap, edits } = formData
        const client = await createClient()

        const schema = {
                type: SchemaType.ARRAY,
                items: {
                        type: SchemaType.OBJECT,
                        properties: {
                                day: {
                                        type: SchemaType.STRING,
                                        description: 'The day of the roadmap'
                                },
                                task: {
                                        type: SchemaType.STRING,
                                        description: 'The task to be completed on the day'
                                },
                                resources: {
                                        type: SchemaType.ARRAY,
                                        description: 'Resources to help complete the task (must contain links to blogs, videos, etc.)',
                                        items: {
                                                type: SchemaType.OBJECT,
                                                properties: {
                                                        name: {
                                                                type: SchemaType.STRING,
                                                                description: 'The name of the resource'
                                                        },
                                                        link: {
                                                                type: SchemaType.STRING,
                                                                description: 'The link to the resource'
                                                        }
                                                },
                                                required: ['name', 'link'] // Ensures that each resource object must have 'name' and 'link'
                                        }
                                },
                                points: {
                                        type: SchemaType.NUMBER,
                                        description: 'The number of points awarded for completing the task'
                                }
                        },
                        required: ['day', 'task', 'resources', 'points']
                }
        }


        const model = genAI.getGenerativeModel({
                model: 'gemini-2.0-flash-exp',
                generationConfig: {
                        responseMimeType: 'application/json',
                        responseSchema: schema, // Use the corrected schema here
                },
        });

        const prompt = `The user has been following a roadmap ${JSON.stringify(currentRoadmap)} and wants to make the following edits: ${edits}. Please generate a new roadmap based on these edits.`;

        try {
                const result = await model.generateContent(prompt);

                // upsert the new roadmap
                const { data, error } = await client.from('roadmaps').upsert({
                        id,
                        email,
                        roadmap: JSON.parse(result.response.text()),
                });

                console.log(JSON.parse(result.response.text()));

                return {
                        success: true,
                        message: "Roadmap created successfully",
                        data: JSON.parse(result.response.text()),
                };
        } catch (error: any) {
                console.error("Error generating content:", error.message);
                return { success: false, message: error.message };
        }
}



