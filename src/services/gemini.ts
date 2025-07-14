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
    Based on the text shared bellow as context, answer the question clearly and precisily in English.

    CONTEXT:
    ${context}

    QUESTION:
    ${question}

    INSTRUCTIONS:
    - Use only the information contained inside the context sent.
    - If the response is not in the context, just answer that there is not enough information to give a correct and precise answer.
    - Be objective.
    - Keep an educative and professional tone.
    - Refer, if appropriated, to relevant parts of the context.
    - If a context reference is needed, use the sentence "content from the class".
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
