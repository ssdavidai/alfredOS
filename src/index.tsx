import * as gensx from "@gensx/core";
import { ChatCompletion, OpenAIProvider } from "@gensx/openai";
import * as readline from "readline";
import { config } from "dotenv";

// Load environment variables
config();

// Types for chat messages
interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// Interface for the chat component props
interface ChatProps {
  messages: ChatMessage[];
  stream?: boolean;
}

// Output type for the chat component
type ChatOutput = string;

// The chat component that uses GPT-4o to generate responses
const Chat = gensx.StreamComponent<ChatProps>(
  "Chat",
  ({ messages, stream }) => (
    <ChatCompletion
      model="gpt-4o"
      messages={messages}
      stream={stream || false}
    />
  )
);

// The main workflow component
const AlfredChat = gensx.Component<{ messages: ChatMessage[] }, string>(
  "AlfredChat",
  ({ messages }) => (
    <OpenAIProvider apiKey={process.env.OPENAI_API_KEY}>
      <Chat messages={messages} stream={true} />
    </OpenAIProvider>
  )
);

// Create the workflow
const workflow = gensx.Workflow("AlfredChatWorkflow", AlfredChat);

// Create the interface for terminal input/output
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Initial system message
const systemMessage: ChatMessage = {
  role: "system",
  content: "You are alfredOS, a helpful AI assistant. You provide thoughtful, accurate, and helpful responses to user queries."
};

// Initialize conversation history with the system message
const messageHistory: ChatMessage[] = [systemMessage];

// Function to clear terminal
function clearTerminal() {
  console.clear();
  console.log("🤖 alfredOS Terminal Chat");
  console.log("Type 'exit' to quit the chat.");
  console.log("---------------------------");
}

// Function to handle user input and get AI response
async function handleUserInput(input: string) {
  // Add user message to history
  messageHistory.push({
    role: "user",
    content: input
  });

  try {
    // Display typing indicator
    process.stdout.write("alfredOS is typing...");

    // Get stream from workflow
    const stream = await workflow.run({ messages: messageHistory });

    // Clear the typing indicator
    process.stdout.write("\r" + " ".repeat(25) + "\r");

    let fullResponse = "";

    // Process and display the streamed response
    for await (const chunk of stream) {
      process.stdout.write(chunk);
      fullResponse += chunk;
    }

    // Add assistant's response to message history
    messageHistory.push({
      role: "assistant",
      content: fullResponse
    });

    console.log("\n");
    promptUser();
  } catch (error) {
    console.error("Error:", error);
    promptUser();
  }
}

// Function to prompt the user for input
function promptUser() {
  rl.question("You: ", (input) => {
    if (input.toLowerCase() === "exit") {
      console.log("Goodbye!");
      rl.close();
      return;
    }
    
    handleUserInput(input);
  });
}

// Start the chat interface
clearTerminal();
promptUser();
