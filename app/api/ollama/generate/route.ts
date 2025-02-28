import { OLLAMA_BASE_URL } from "@/lib/constants/common.constant";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const response = await axios.post(
    `${OLLAMA_BASE_URL}/api/generate`,
    {
      model: body.model,
      prompt: body.prompt,
      stream: body.stream || false,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return NextResponse.json(response.data);
}
