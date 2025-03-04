import {
  API_ERROR_CODE,
  OLLAMA_BASE_URL,
} from "@/lib/constants/common.constant";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
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
  } catch (error) {
    return NextResponse.json(
      {
        error: "Something went wrong",
      },
      { status: API_ERROR_CODE.SOMETHING_WENT_WRONG }
    );
  }
}
