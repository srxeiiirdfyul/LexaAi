import { GoogleGenAI } from "@google/genai";
import { ChatMessage, ChatMessageRole, UserTier } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using a placeholder. The app will not function correctly without a valid API key.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "YOUR_API_KEY_HERE" });

const dataUrlToGenerativePart = async (dataUrl: string) => {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const base64EncodedData = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(blob);
    });
    return {
      inlineData: {
        data: base64EncodedData,
        mimeType: blob.type,
      },
    };
};

export const generateResponse = async (
  history: ChatMessage[],
  userTier: UserTier
): Promise<ReadableStream<string>> => {
  const modelName = userTier === UserTier.PRO ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
  
  const systemInstruction = `You are LexaAI, an advanced conversational assistant.
The application you are in provides the following context:
- A consultable conversation history is available to you to maintain context.
- The application has management features in a navigation menu, such as language settings and logout.
- Your capabilities and the model you use might differ based on the user's tier (Guest, Free, or PRO).
Your responses should be helpful, clear, and engaging.`;
  
  const contents = await Promise.all(
    history
      .filter(msg => msg.role !== ChatMessageRole.SYSTEM)
      .map(async (msg) => {
          const parts = [{ text: msg.text }];
          if (msg.images && msg.images.length > 0) {
              const imageParts = await Promise.all(msg.images.map(dataUrlToGenerativePart));
              return {
                  role: msg.role,
                  parts: [...imageParts, ...parts],
              };
          }
          return {
              role: msg.role,
              parts,
          };
      })
  );

  try {
    const result = await ai.models.generateContentStream({
        model: modelName,
        contents: contents,
        config: {
            systemInstruction: systemInstruction,
        }
    });

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result) {
          controller.enqueue(chunk.text);
        }
        controller.close();
      },
    });

    return stream;
  } catch (error) {
    console.error("Error generating content:", error);
    const errorStream = new ReadableStream({
      start(controller) {
        controller.enqueue("Sorry, I encountered an error. Please try again.");
        controller.close();
      }
    });
    return errorStream;
  }
};