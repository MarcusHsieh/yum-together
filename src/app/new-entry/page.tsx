"use client";
import { useState } from 'react';

type FoodItemNutrition = {
    foodItem: string;
    nutritionData: any; 
};

type AnalysisResult = {
    foodItems: string[];
    nutritionDataResults: FoodItemNutrition[];
    error?: string; 
};


export default function NewEntry() {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

    const [loading, setLoading] = useState<boolean>(false); 

    // image uploading
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(file);

            // show preview of uploaded image to user
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // FORM SUBMISSION
    const handleUpload = async () => {
        if (!selectedImage) return;
    
        setLoading(true);
    
        // convert image to base64
        const reader = new FileReader();
        reader.readAsDataURL(selectedImage);
    
        reader.onloadend = async () => {
            try {
                // extract the base64 encoding
                let base64Image = (reader.result as string).split(',')[1]; 
    
                // remove newlines and spaces from the encoding
                base64Image = base64Image.replace(/\s/g, '');
    
                // **step 1: initial request to identify food items
                const initialPayload = {
                    model: "llava-phi3",
                    prompt: "Analyze the image and identify only the food items present. Only list the food items and void any additional descriptions. Exclude any mention of background details, table settings, or non-food items. The focus should be solely on the edible items. Only analyze the food items in the middle of the image. (i.e. Input: image of a burger. Output: 1. Burger (with contents inside))",
                    stream: false,
                    images: [base64Image],
                };
    
                // sending image to Ollama for initial analysis...
                const initialResponse = await fetch('/api/analyze-image', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(initialPayload),
                });
    
                if (!initialResponse.ok) {
                    throw new Error('Failed to analyze image');
                }
    
                const initialResult = await initialResponse.json();

                console.log('Initial response:', initialResult);
    
                // **step 2: send second request to reformat detected food items
                const reformattedPayload = {
                    model: "llava-phi3",
                    prompt: `Convert the following list of food items into a valid JSON array where each item is a string. The result should only return a plain JSON array with no additional characters, formatting, code blocks, or explanations. I will using these elements for a search in the FDA database, therefore elements should be concise (IMPORTANT: max 3 words), to the point, and not contain any additional information. For example: ["item1", "item2", "item3"]. Input: "${initialResult.analysis.response}"`,
                    stream: false,
                    images: [],
                };

                const reformattedResponse = await fetch('/api/analyze-image', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(reformattedPayload),
                });

                if (!reformattedResponse.ok) {
                    throw new Error('Failed to reformat food items');
                }

                const reformattedResult = await reformattedResponse.json();

                console.log('Reformatted response:', reformattedResult);

                // check if reformatted response has the correct structure
                if (!reformattedResult || !reformattedResult.analysis || !reformattedResult.analysis.response) {
                    console.error('Reformatted result does not contain expected response:', reformattedResult);
                    setAnalysisResult({
                        foodItems: [],
                        nutritionDataResults: [],
                        error: 'Unexpected format in reformatted response.',
                    });
                    setLoading(false);
                    return; // exit if format no good
                }

                // CLEAN RESPONSE!!
                let cleanedResponse = reformattedResult.analysis.response.trim();
                cleanedResponse = cleanedResponse.replace(/```json/g, '').replace(/```/g, '').trim();
                cleanedResponse = cleanedResponse.replace(/\n/g, '').replace(/\r/g, '').trim();

                // make sure it's a valid JSON array
                if (!cleanedResponse.startsWith('[') || !cleanedResponse.endsWith(']')) {
                    console.error('Cleaned response is not a valid JSON array:', cleanedResponse);
                    setAnalysisResult({
                        foodItems: [],
                        nutritionDataResults: [],
                        error: 'Cleaned response is not a valid JSON array.',
                    });
                    setLoading(false);
                    return;
                }

                console.log('Final cleaned response before parsing:', cleanedResponse);

                let foodItemsArray: string[] = [];
                try {
                    foodItemsArray = JSON.parse(cleanedResponse);
                } catch (parseError) {
                    console.error('Error parsing cleaned reformatted response:', parseError);
                    console.error('Cleaned response that failed to parse:', cleanedResponse);
                    setAnalysisResult({
                        foodItems: [],
                        nutritionDataResults: [],
                        error: 'Failed to parse cleaned reformatted response.',
                    });
                    setLoading(false);
                    return; // exit if parsing fail
                }


    
                // fetch nutrition data for each food item in array
                const nutritionDataPromises = foodItemsArray.map(async (foodItem: string) => {
                    const nutritionResponse = await fetch('/api/fda-nutrition', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ foodItem }),
                    });
    
                    if (!nutritionResponse.ok) {
                        throw new Error(`Failed to fetch nutrition data for ${foodItem}`);
                    }
    
                    const nutritionData = await nutritionResponse.json();
                    return { foodItem, nutritionData };
                });
    
                const nutritionDataResults = await Promise.all(nutritionDataPromises);
    
                // set analysis result with both image analysis and nutrition data (THIS IS WHAT'S OUTPUTTED TO THE USER)
                setAnalysisResult({
                    foodItems: foodItemsArray,
                    nutritionDataResults,
                });
            } catch (error: Error | any) {
                console.error('Error processing image or fetching nutrition data:', error);
                setAnalysisResult({
                    foodItems: [], 
                    nutritionDataResults: [], 
                    error: error.message,
                  });
            } finally {
                setLoading(false);
            }
        };
    
        // file read error catch
        reader.onerror = (error) => {
            console.error('Error reading file:', error);
            setLoading(false);
        };
    };
    


    return (
        <div className="flex flex-col items-center p-16 min-h-screen max-w-screen-lg mx-auto overflow-hidden">
            <h1 className="text-2xl mb-4">Upload a New Food Entry</h1>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && (
                <div className="mt-4">
                    <img src={imagePreview} alt="Selected" className="max-w-xs" />
                </div>
            )}
            <button
                className={`bg-blue-500 text-white hover:bg-blue-700 px-4 py-2 mt-4 rounded ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                onClick={handleUpload}
                disabled={loading} 
            >
                {loading ? 'Analyzing...' : 'Upload and Analyze'}
            </button>
    
            {loading && (
                <div className="mt-4 flex flex-col items-center">
                    <p>Loading, please wait...</p>
                    <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500 border-solid mt-2"></div>
                </div>
            )}
    
            {/* DISPLAY RESULTS */}
            {analysisResult && (
                <div className="mt-4 p-4 bg-gray-100 rounded w-full max-w-full overflow-x-auto">
                    <h2 className="text-xl mb-2">Analysis Result:</h2>
                    {analysisResult.error ? (
                        <p>{analysisResult.error}</p>
                    ) : (
                        Array.isArray(analysisResult.foodItems) && analysisResult.foodItems.length > 0 ? (
                            analysisResult.foodItems.map((food, index) => (
                                <div key={index} className="mb-4">
                                    <h3 className="text-lg font-bold">Food Item: {food}</h3>
                                    <pre className="whitespace-pre-wrap">
                                        {JSON.stringify(analysisResult.nutritionDataResults[index]?.nutritionData.foods, null, 2)}
                                    </pre>
                                </div>
                            ))
                        ) : (
                            <p>No food items found.</p>
                        )
                    )}
                </div>
            )}


        </div>
    );
}
