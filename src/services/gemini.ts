import { GoogleGenAI } from '@google/genai';
import { env } from '../env.ts';

const gemini = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
});

const model = 'gemini-2.5-flash';

export async function transcribeAudio(audioAsbase64: string, mimeType: string) {
  const response = await gemini.models.generateContent({
    model,
    contents: [
      {
        text: 'Transcribe audio to english. Return a precise and natural trancription. Keep correct pontuation and divide the text in paragraphs.',
      },
      {
        inlineData: {
          mimeType,
          data: audioAsbase64,
        },
      },
    ],
  });

  if (!response.text) {
    throw new Error('Failed to convert audio.');
  }

  return response.text;
}

export async function generateEmbeddings(text: string) {
  const response = await gemini.models.embedContent({
    model: 'text-embedding-004',
    contents: [{ text }],
    config: {
      taskType: 'RETRIEVAL_DOCUMENT',
    },
  });

  if (!response.embeddings?.[0].values) {
    throw new Error('Failed to generate embeddings.');
  }

  return response.embeddings[0].values;
}

export async function generateAnswer(
  question: string,
  trancriptions: string[]
) {
  const context = trancriptions.join('\n\n');

  const prompt = `
    You are analyzing transcribed audio content about different topics. The text below contains multiple fragments from spoken explanations that may include:
    - Natural speech patterns (pauses, "uh", "um")
    - Incomplete sentences
    - Related concepts scattered across fragments
    - Technical explanations broken into pieces

    CONTEXT (Transcribed audio fragments):
    ${context}

    QUESTION:
    ${question}

    INSTRUCTIONS:
    - Analyze ALL fragments to understand the complete picture
    - Piece together related information from different fragments
    - Ignore speech fillers and focus on the technical content
    - If you can construct a meaningful answer from the fragments, provide it
    - Include practical examples and explanations found across the fragments
    - Be comprehensive but stick to information found in the context
    - If truly insufficient information exists across ALL fragments, then mention the limitation
    - Reference "content from the class" when appropriate

    Provide a clear, educational answer based on the available information.
  `.trim();
  const response = await gemini.models.generateContent({
    model,
    contents: [
      {
        text: prompt,
      },
    ],
  });

  if (!response.text) {
    throw new Error('Failed to generate response from Gemini.');
  }

  return response.text;
}
