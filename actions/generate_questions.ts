"use server"
import { createClient } from "@/utils/supabase/server"
import { GoogleGenerativeAI, SchemaType, DynamicRetrievalMode } from '@google/generative-ai'

if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
        throw new Error("NEXT_PUBLIC_GEMINI_API_KEY is not defined")
}
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY)

export async function generateQuestions(topic: string) {
        const client = await createClient()

        const schema = {
                type: SchemaType.ARRAY,
                items: {
                        type: SchemaType.OBJECT,
                        properties: {
                                question: {
                                        type: SchemaType.STRING,
                                        description: 'The question to be asked'
                                }
                        },
                        required: ['question']
                }
        }


        const model = genAI.getGenerativeModel({
                model: 'gemini-2.0-flash-exp',
                generationConfig: {
                        responseMimeType: 'application/json',
                        responseSchema: schema
                },
        })

        const prompt = `The user has recently studied ${topic}. Generate 5 subjective questions to test their knowledge.`

        const result = await model.generateContent(prompt)

        //const { data, error } = await client.from('roadmaps').insert([
        //        {
        //        }
        //])

        console.log(JSON.parse(result.response.text()))

        //if (error) {
        //        return { success: false, message: error.message }
        //}

        return { success: true, message: "Roadmap created successfully", data: JSON.parse(result.response.text()) }
}

