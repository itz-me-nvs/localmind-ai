import { OLLAMA_BASE_URL } from "@/lib/constants/common.constant";
import axios from "axios";
import { exec } from "child_process";
import { NextResponse } from "next/server";
import util from "util";

const execPromise = util.promisify(exec);

export async function GET() {
  try {
    // Fetch installed models
    const {data, status} = await axios.get(`${OLLAMA_BASE_URL}/api/tags`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("data", data, status);


    return NextResponse.json(data, { status: 200 });
  } catch (error) {



    try {
      console.error("API request failed, checking Ollama status:", error);

      // Check if ollama is running
    // const { stdout, stderr } = await execPromise("ollama").catch((err) => ({
    //   stdout: "",
    //   stderr: err
    // }));

    // console.log("stdout", stdout);
    // console.log("stderr", stderr);


    if (true) {
      console.log("Ollama is starting...");
    // try {
      // const {stdout, stderr} =  await execPromise("node -v &");
      // exec("ollama serve &", (error, stdout, stderr) => {
      //   if (error) {
      //     console.error(`exec error: ${error}`);
      //     return;
      //   }
      //   console.log("stdout", stdout);
      //   console.log("stderr", stderr);
      // })

      // await execPromise("start /b ollama serve");


      // Wait for a few seconds to ensure Ollama is up
      await new Promise((resolve: any) => setTimeout(resolve, 8000));

      const {data, status} = await axios.get(`${OLLAMA_BASE_URL}/api/tags`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return NextResponse.json({message: "success"}, { status: 200 });
    }

    } catch (error) {
      return NextResponse.json(
        { message: "Failed to retrieve Ollama models." },
        { status: 500 }
      );
    }
  }
}
