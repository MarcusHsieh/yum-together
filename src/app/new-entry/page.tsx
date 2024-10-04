"use client";
import { useState } from 'react';

export default function NewEntry() {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<string | null | object>(null); 

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
    
        try {
            // convert image to base64
            const reader = new FileReader();
            reader.readAsDataURL(selectedImage);
            reader.onloadend = async () => {
                // extract the base64 encoding
                let base64Image = (reader.result as string).split(',')[1]; 
    
                // remove newlines and spaces from the encoding bc JSON doesn't like them
                base64Image = base64Image.replace(/\s/g, '');
    
                // this creates the (formatted!) JSON payload to send to Ollama
                const payload = {
                    model: "llava-phi3",
                    prompt: "Analyze the picture, carefully. Numerically list everything editable in this picture.",
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
            };
        } catch (error: Error | any) {
            console.error('Error uploading image:', error);
            setAnalysisResult({ error: error.message });
        }
    };
    
    
    

    return (
        <div className="flex flex-col items-center p-4 max-w-screen-lg mx-auto overflow-hidden">
            <h1 className="text-2xl mb-4">Upload a New Food Entry</h1>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && (
                <div className="mt-4">
                    <img src={imagePreview} alt="Selected" className="max-w-xs" />
                </div>
            )}
            <button
                className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
                onClick={handleUpload}
            >
                Upload and Analyze
            </button>
    
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
