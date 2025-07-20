// export const getCurrentTimeTool = {
//   name: "get-current-time",
//   description: "Returns the current system time",
//   func: async () => {
//     const now = new Date();
//     return `The current time is: ${now.toISOString()}`;
//   },
// };

import { tool } from "@langchain/core/tools";

export const getCurrentTimeTool = tool(
  ()=> {
    const now = new Date();
    return `The current time is: ${now.toISOString()}`

  },
  {
    name: "get_current_time",
    description: "Returns the current system time",
  }
)