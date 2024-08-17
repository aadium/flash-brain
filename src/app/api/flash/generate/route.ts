import { NextRequest, NextResponse } from 'next/server';
import FlashSet from '@/app/api/models/FlashSet';

export async function GET(req: NextRequest) {
    try {
        const topic = req.nextUrl.searchParams.get('topic');
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
                        "role": "user", "content": "Generate a flash card set about " + topic + " in the following JSON format: [{\"question\": \"What is the capital of France?\", \"answer\": \"Paris\"}]"
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
        const jsonMatch = message.match(/\[([\s\S]*?)\]/);
        if (!jsonMatch) {
            console.error('Error extracting JSON from message:', message);
            return NextResponse.json({ error: 'Error extracting JSON from message' }, { status: 500 });
        }

        const jsonString = jsonMatch[0].trim();
        const cleanedJsonString = jsonString.replace(/[^\x20-\x7E]/g, '');

        // Add error handling for JSON parsing
        let flashcards;
        try {
            flashcards = JSON.parse(cleanedJsonString);
        } catch (parseError) {
            console.log('Error parsing JSON:', cleanedJsonString);
            console.error('Error parsing JSON:', parseError);
            return NextResponse.json({ error: 'Error parsing JSON' }, { status: 500 });
        }

        return NextResponse.json(flashcards);
    } catch (error) {
        console.error('Internal Server Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}