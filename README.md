# alfredOS

alfredOS is a dual MCP client with a workflow engine built using GenSX.

## Features

- Terminal-based chat interface with GPT-4o
- Conversation context preservation
- Streaming responses for a better user experience

## Stage 1: GenSX Chat Interface

The current implementation is Stage 1 of alfredOS, which provides a terminal-based chat interface using GenSX and OpenAI's GPT-4o model.

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

## Usage

Run the application with:

```
npm run dev
```

- Type your messages and press Enter to chat with alfredOS
- Type 'exit' to quit the application

## Future Development

- Stage 2: Additional MCP clients
- Stage 3: Workflow engine for automating tasks
