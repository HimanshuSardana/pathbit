"use server"
import { createClient } from "@/utils/supabase/server"
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai'

if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
        throw new Error("NEXT_PUBLIC_GEMINI_API_KEY is not defined")
}
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY)

export async function checkAnswers(topic: string, questions: object) {
        const client = await createClient()

        const schema = {
                type: SchemaType.ARRAY,
                items: {
                        type: SchemaType.OBJECT,
                        properties: {
                                analysis: {
                                        type: SchemaType.STRING,
                                        description: `Your analysis of the user's answer and the justification behind the grade`,
                                },
                                grade: {
                                        type: SchemaType.NUMBER,
                                        description: 'The grade given to the user\'s answer, should be a number between 1-10',
                                },
                        },
                        required: ['analysis', 'grade'], // Ensure these fields are mandatory
                },
        };

        const model = genAI.getGenerativeModel({
                model: 'gemini-2.0-flash-exp',
                generationConfig: {
                        responseMimeType: 'application/json',
                        responseSchema: schema, // Use the corrected schema here
                },
        });

        const prompt = `The user was recently given a quiz on ${topic}, the questions along with the answers were ${JSON.stringify(
                questions
        )}. Grade each question on a scale of 1-10 based on the user's understanding of the topic along with its analysis.`;

        try {
                const result = await model.generateContent(prompt);

                console.log(questions);
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


