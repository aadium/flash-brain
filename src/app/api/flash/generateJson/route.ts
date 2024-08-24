import { NextRequest, NextResponse } from 'next/server';
import Instructor from "@instructor-ai/instructor";
import Groq from "groq-sdk";
import { z } from "zod";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY ?? undefined,
});

const client = Instructor({
    client: groq,
    mode: "TOOLS"
});

const FlashCardArraySchema = z.object(
    {
        flashcards: z.array(
            z.object(
                {
                    question: z.string(),
                    answer: z.string()
                }
            )
        )
    }
);

export async function POST(req: NextRequest) {
    try {
        const { content, flashCardCount } = await req.json();

        const response = await client.chat.completions.create({
            messages: [{ role: "user", content: "Generate a flash card set containing " + flashCardCount + " cards in" +
                    " JSON" +
                    " format." +
                    " Use the following content for reference: " + content }],
            model: "llama-3.1-70b-versatile",
            response_model: {
                schema: FlashCardArraySchema,
                name: "FlashCards"
            },
        });

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error fetching or parsing JSON:', error);
        return NextResponse.json({ error: 'Error extracting or parsing JSON' }, { status: 500 });
    }
}