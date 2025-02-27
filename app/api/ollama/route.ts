import { OLLAMA_BASE_URL } from "@/lib/constants/common.constant";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {

  const response = await axios.get(`${OLLAMA_BASE_URL}/api/tags`, {
    headers: {
      "Content-Type": "application/json"
    }
  })

  return NextResponse.json(response.data)
}
