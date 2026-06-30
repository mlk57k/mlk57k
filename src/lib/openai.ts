import OpenAI from "openai";

let _openai: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!_openai) {
    if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not set");
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _openai;
}

export class TranscriptionError extends Error {}

export async function transcribeAudio(file: File): Promise<string> {
  const client = getOpenAI();

  try {
    const transcription = await client.audio.transcriptions.create({
      file,
      model: "whisper-1",
      language: "fr",
    });
    return transcription.text.trim();
  } catch {
    throw new TranscriptionError("La transcription a échoué. Réessaie ou écris ton entrée directement.");
  }
}
