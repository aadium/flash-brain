import { NextRequest, NextResponse } from 'next/server';
import FlashSet from '@/app/api/models/FlashSet';

export async function POST(req: NextRequest) {
    try {
        const { content, flashCardCount } = await req.json();
        const maxRetries = 5;
        let retries = 0;
        let flashcards = null;

        while (retries < maxRetries && !flashcards) {
            const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "model": "meta-llama/llama-3.1-8b-instruct:free",
                    "messages": [
                        {
                            "role": "user", "content": "Generate a flash card set containing " + flashCardCount + " cards in the" +
                                " following JSON format (Return the answer only in JSON format):" +
                                " [{\"question\": \"What is the" +
                                " capital of" +
                                " France?\"," +
                                " \"answer\": \"Paris\"}]. Use the following content for reference: " + content
                        },
                    ],
                })
            });

            if (!res.ok) {
                console.error('Error fetching from external API:', res.statusText);
                return NextResponse.json({ error: 'Error fetching from external API' }, { status: res.status });
            }

            const data = await res.json();
            const message = data.choices[0].message.content;

            // Add error handling for JSON extraction
            const jsonMatch = message.match(/\[([\s\S]*?)]/);
            if (!jsonMatch) {
                console.error('Error extracting JSON from message:', message);
                retries++;
                continue;
            }

            const jsonString = jsonMatch[0].trim();
            const cleanedJsonString = jsonString.replace(/[^\x20-\x7E]/g, '');

            // Add error handling for JSON parsing
            try {
                flashcards = JSON.parse(cleanedJsonString);
            } catch (parseError) {
                console.log('Error parsing JSON:', cleanedJsonString);
                console.error('Error parsing JSON:', parseError);
                retries++;
            }
        }

        if (!flashcards) {
            return NextResponse.json({ error: 'Error extracting or parsing JSON after multiple attempts' }, { status: 500 });
        }

        return NextResponse.json(flashcards);
    } catch (error) {
        console.error('Internal Server Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}