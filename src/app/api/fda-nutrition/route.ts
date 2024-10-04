import { NextResponse } from 'next/server';

// FDA API endpoint
const FDA_API_BASE_URL = 'https://api.nal.usda.gov/fdc/v1/foods/search';

export async function POST(req: Request) {
    const { foodItem } = await req.json();

    // normal check for missing API key
    if (!process.env.FDA_API_KEY) {
        return NextResponse.json({ message: 'Missing FDA API key' }, { status: 500 });
    }

    try {
        // query the FDA API
        const response = await fetch(`${FDA_API_BASE_URL}?query=${encodeURIComponent(foodItem)}&pageSize=1&dataType=Branded&sortBy=dataType.keyword&api_key=${process.env.FDA_API_KEY}`);

        if (!response.ok) {
            throw new Error('Failed to fetch nutrition data from FDA API');
        }

        const data = await response.json();

        // return the nutrition data!!
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching FDA nutrition data:', error);
        return NextResponse.json({ message: 'Error fetching nutrition data' }, { status: 500 });
    }
}
