// import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import { } from "@langchain/core/agents";
import { AIMessage } from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableConfig } from "@langchain/core/runnables";
import { tool } from "@langchain/core/tools";
import { ChatGroq } from "@langchain/groq";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";


// const client = new Exa(process.env.NEXT_PUBLIC_EXA_API_KEY);

// const exaTool = new ExaSearchResults({
//   client,
//   searchArgs: {
//     numResults: 1, 
//   },
// });

const calculatorSchema = z.object({
  operation: z.enum(["add", "subtract", "multiply", "divide"]).describe("The type of operation to execute."),
  number1: z.number().describe("The first number to operate on."),
  number2: z.number().describe("The second number to operate on."),
})

const llm = new ChatGroq({
   apiKey: "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",
    model: "llama-3.3-70b-versatile",
    temperature: 0
})

export async function POST(req: NextRequest) {
  if (req.method != "POST") {
    return NextResponse.json(
      { error: "Method not allowed, Use POST." },
      { status: 405 }
    );
  }

  const { url, selector } = await req.json();

  if (!url || !selector) {
    return NextResponse.json(
      { error: "Missing required fields: url and selector." },
      { status: 400 }
    );
  }

  try {
    // const loader = new PuppeteerWebBaseLoader(url, {
    //     evaluate: async(page,)=> {
    //         const content = await page.$eval(selector, (element)=> element.textContent?.trim() || '');
    //         return content;
    //     },
    //   launchOptions: {
    //     headless: true,
    //   },
    //   gotoOptions: {
    //     waitUntil: "domcontentloaded",
    //   },
    // });
    // const docs = await loader.load();

    // const content = docs.map((doc) => doc.pageContent).join("\n");


    // const result = await exaTool.invoke("what is the weather in wailea?");
    // console.log("exa: result", result);


    const calculatorTool = tool(
      async({number1, number2, operation})=> {
      if(operation == "add") {
        return `${number1 + number2}`;
      }
      else if(operation == "subtract") {
        return `${number1 - number2}`;
      }
      else if(operation == "multiply") {
        return `${number1 * number2}`;
      }
      else if(operation == "divide") {
        return `${number1 / number2}`;
      }
      else {
       throw new Error("Invalid operation.");
      }
    },
    {
      name: "Calculator",
     description: "Can perform mathematical operations.",
     schema: calculatorSchema
    }
  )


  //  const llmWithTools = llm.bindTools([calculatorTool]);

  //  const res = await llmWithTools.invoke("What is 2 + 2?");
  //  console.log("llm: result", res);


   const prompt = ChatPromptTemplate.fromMessages([
    ["system", "You are a helpful assistant."],
    ["human", "{user_input}"],
    ["placeholder", "{messages}"]
   ])


// specifying tool_choice will force the model to call this tool.
   const llmWithTools = llm.bindTools([calculatorTool], {
    // tool_choice: {type: "function", function: {name: exaTool.name}}
    tool_choice: {type: "function", function: {name: calculatorTool.name}}
    // tool_choice: exaTool.name as any
   })


   const llmChain = prompt.pipe(llmWithTools);


const toolChain = async (
  userInput: string,
  config?: RunnableConfig
): Promise<AIMessage> => {
  const input_ = { user_input: userInput };
  const aiMsg = await llmChain.invoke(input_, config);


  console.log("aiMsg", aiMsg);
  

  if (aiMsg.tool_calls !== undefined && aiMsg.tool_calls.length > 0) {
    const toolResult = await calculatorTool.invoke(aiMsg.tool_calls[0], config);

    // Injecting the tool result back into the prompt
    // const finalAiMsg = await llmChain.invoke(
    //   {
    //     ...input_,
    //     messages: [aiMsg, toolResult],
    //   },
    //   config
    // );



    const finalAiMsg = await llmChain.invoke(
      {
        ...input_,
        messages: [aiMsg, toolResult],
      },
      config
    )

    console.log("finalAiMsg", finalAiMsg);
    
    return finalAiMsg; // ✅ This is the final message containing the answer
  }

  return aiMsg;
};

  //  llmChain.invoke({user_input: "What is 2 + 2?"});
  const toolChainResult = await toolChain(
  "what is 2 + 2?",
);

  console.log("toolChainResult", toolChainResult.content);

  const { tool_calls, content, text, } = toolChainResult;

// console.log(
//   "AIMessage",
//   JSON.stringify(
//     {
//       tool_calls,
//       content,
//       text
//     },
//     null,
//     2
//   )
// );


    return NextResponse.json({});
  } catch (error) {
    console.error("Scraping error:", error);
    return NextResponse.json(
      { error: "Failed to extract content from the specified selector." },
      { status: 500 }
    );
  }
}
