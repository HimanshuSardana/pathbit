"use server"
import { createClient } from "@/utils/supabase/server"
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai'

if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
        throw new Error("NEXT_PUBLIC_GEMINI_API_KEY is not defined")
}
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY)

type RoadmapInfo = {
        email: string
        skillName: string,
        startDate: string,
        endDate: string,
        prereqKnowledge: string,
}

export async function generateRoadmap(formData: RoadmapInfo) {
        const { email, skillName, startDate, endDate, prereqKnowledge } = formData
        const client = await createClient()

        const schema = {
                description: `A roadmap to learn ${skillName}`,
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
                        responseSchema: schema
                }
        })

        const prompt = `Create a roadmap for learning ${skillName} starting on ${startDate} and ending on ${endDate}. The learner has the following prerequisite knowledge: ${prereqKnowledge}.`

        const result = await model.generateContent(prompt)

        const { data, error } = await client.from('roadmaps').insert([
                {
                        created_by: email,
                        roadmap: JSON.stringify(JSON.parse(result.response.text())),
                        completed: 0,
                        start_date: startDate,
                        end_date: endDate,
                        skill_name: skillName,
                }
        ])

        console.log(JSON.parse(result.response.text()))

        if (error) {
                return { success: false, message: error.message }
        }

        return { success: true, message: "Roadmap created successfully" }
}
