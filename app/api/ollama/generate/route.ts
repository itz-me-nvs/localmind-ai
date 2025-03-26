import {
  API_ERROR_CODE,
  API_ERROR_MESSAGES,
  OLLAMA_BASE_URL,
} from "@/lib/constants/common.constant";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const getAPIErrorMessage = <T extends  keyof typeof API_ERROR_MESSAGES>(key:T)=> API_ERROR_MESSAGES[key];

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
  } catch (error: any) {
    if(error?.status == API_ERROR_CODE.NOT_FOUND){
      return NextResponse.json({
        error: getAPIErrorMessage(API_ERROR_CODE.MODEL_NOT_FOUND),
        
      }, {status: API_ERROR_CODE.MODEL_NOT_FOUND})
    }
    
    return NextResponse.json(
      {
        error: getAPIErrorMessage(API_ERROR_CODE.SOMETHING_WENT_WRONG),
      },
      { status: API_ERROR_CODE.SOMETHING_WENT_WRONG }
    );
  }
}
