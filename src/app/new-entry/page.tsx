"use client";
import { useState } from 'react';

export default function NewEntry() {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<string | null | object>(null); 
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

        setLoading(true); // Set loading to true immediately

        // Convert image to base64
        const reader = new FileReader();
        reader.readAsDataURL(selectedImage);

        reader.onloadend = async () => {
            try {
                // extract the base64 encoding
                let base64Image = (reader.result as string).split(',')[1]; 

                // remove newlines and spaces from the encoding
                base64Image = base64Image.replace(/\s/g, '');

                // this creates the (formatted!) JSON payload to send to Ollama
                const payload = {
                    model: "llava-phi3",
                    prompt: "Analyze the image and identify only the food items present. Exclude any mention of background details, table settings, or non-food items. Provide a detailed description of the type, count, and any notable characteristics of each food item, including sauces or condiments. The focus should be solely on the edible items. At the top, list the number of different food items analyzed (e.g. If given an image with eggs and apples: \"Food items analyzed: 10\"). Underneath this the food items and descriptions should be listed. Ensure there are no duplicate food items listed.",
                    stream: false,
                    images: [base64Image],
                };

                // sending image to Ollama...
                const response = await fetch('/api/analyze-image', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    throw new Error('Failed to analyze image');
                }

                const result = await response.json();

                // this makes sure that the result ONLY shows the response (not the other stuff)
                setAnalysisResult(result.analysis.response);
            } catch (fetchError : Error | any) {
                console.error('Error analyzing image:', fetchError);
                setAnalysisResult({ error: fetchError.message });
            } finally {
                setLoading(false);
            }
        };

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
                    <p className="whitespace-pre-line">{analysisResult.toString()}</p>
                </div>
            )}
        </div>
    );
}
