import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        // extract payload (the JSON) from incoming request
        const payload = await req.json();

        // test payload
        // console.log('Payload to Ollama:', JSON.stringify(payload, null, 2));

        // send request to Ollama API running in Docker container
        const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        // get the response from Ollama!
        const result = await ollamaResponse.json();

        // send back analysis result to the client
        return NextResponse.json({ analysis: result });
    } catch (error) {
        console.error('Error communicating with Ollama:', error);
        return new NextResponse('Error analyzing image', { status: 500 });
    }
}
