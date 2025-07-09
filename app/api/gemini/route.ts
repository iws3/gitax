// app/api/gemini/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from 'next/server';

// Ensure your API key is correctly loaded from environment variables
const apiKey = process.env.GEMINI_API_KEY;
console.log("GEMINI_API_KEY from env (route.ts):", apiKey ? "Loaded" : "NOT LOADED OR EMPTY");

// Initialize genAI
let genAI: GoogleGenerativeAI | null = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
} else {
  console.error("GEMINI_API_KEY is not set. Gemini API will not be available.");
}

interface RequestBody {
  prompt: string;
}

export async function POST(req: NextRequest) {
  console.log(`API /api/gemini (App Router) hit. Method: POST`);

  if (!apiKey || !genAI) {
    console.error("GEMINI_API_KEY is not configured or genAI failed to initialize.");
    return NextResponse.json(
      { error: 'API key not configured or Gemini service not initialized on server.' },
      { status: 500 }
    );
  }

  try {
    const body = await req.json() as RequestBody;
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Use a known valid model name. Check Google AI documentation for the latest.
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); 
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return NextResponse.json({ text }, { status: 200 });

  } catch (error: any) {
    console.error("Error in POST /api/gemini (App Router):", error);
    let errorMessage = 'Failed to get response from Gemini API';
    let errorDetails = error.message || String(error);

    if (error instanceof SyntaxError && error.message.includes("JSON")) {
        errorMessage = "Invalid JSON in request body.";
        errorDetails = error.message;
    }

    return NextResponse.json(
      { error: errorMessage, details: errorDetails },
      { status: 500 }
    );
  }
}

// Optional: Add a GET handler for basic testing or to disallow GET
export async function GET(req: NextRequest) {
  return NextResponse.json(
    { error: 'Method Not Allowed. Please use POST.' },
    { status: 405, headers: { 'Allow': 'POST' } }
  );
}