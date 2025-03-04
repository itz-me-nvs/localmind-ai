import {
  API_ERROR_CODE,
  OLLAMA_BASE_URL,
} from "@/lib/constants/common.constant";
import axios from "axios";
import { exec } from "child_process";
import { NextResponse } from "next/server";
import util from "util";

const execPromise = util.promisify(exec);

export async function GET() {
  try {
    // Fetch installed models
    const { data, status } = await axios.get(`${OLLAMA_BASE_URL}/api/tags`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return NextResponse.json(data, { status: API_ERROR_CODE.SUCCESS });
  } catch (error) {
    // Check if ollama is running
    const { stdout, stderr } = await execPromise("ollama").catch((err) => ({
      stdout: "",
      stderr: err,
    }));

    if (!stdout.trim() || stderr) {
      return NextResponse.json(
        { message: "Ollama is not running." },
        { status: API_ERROR_CODE.MODEL_NOT_FOUND }
      );
    }

    return NextResponse.json(
      { message: "Failed to retrieve Ollama models." },
      { status: API_ERROR_CODE.SOMETHING_WENT_WRONG }
    );
  }
}
