import { OLLAMA_BASE_URL } from "@/lib/constants/common.constant";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return new Response("Welcome to Ollama API!");
}

export async function POST(request: NextRequest) {
  try {
    // Parse JSON body from request
    const body = await request.json();

    console.log(body);


    // Validate body parameters (optional)
    if (!body.model || !body.prompt) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Make API request using Axios
    const response = await axios.post(`${OLLAMA_BASE_URL}/api/generate`, {
      model: body.model, // Default model if not provided
      prompt: body.prompt,
      stream: body.stream ?? false, // Default to false if not provided
    });

    return NextResponse.json({ data: response.data });
  } catch (error: any) {
    console.log(error);

    // Handle Axios errors
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return NextResponse.json(
          {
            error: `API request failed with status ${error.response.status}`,
            details: error.response.data,
          },
          { status: error.response.status }
        );
      } else if (error.request) {
        return NextResponse.json(
          { error: "No response from API. Check server or network." },
          { status: 500 }
        );
      } else {
        return NextResponse.json(
          { error: `Request error: ${error.message}` },
          { status: 500 }
        );
      }
    }

    // Handle other unexpected errors
    return NextResponse.json(
      { error: "Unexpected error occurred." },
      { status: 500 }
    );
  }
}
