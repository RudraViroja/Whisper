
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const openai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const runtime = "nodejs";

export async function POST() {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const response = await openai.models.generateContentStream({
      model: "gemini-3.5-flash-lite",
      config: {
        maxOutputTokens: 400,
      },
      contents: prompt,
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        try {
          for await (const chunk of response) {
            if (chunk.text) {
              controller.enqueue(encoder.encode(chunk.text));
            }
          }

          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    const providerStatus =
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      typeof error.status === "number"
        ? error.status
        : undefined;

    if (providerStatus === 503 || providerStatus === 429) {
      return NextResponse.json(
        { error: "Gemini is temporarily unavailable. Please try again later." },
        { status: providerStatus }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate message suggestions." },
      { status: 500 }
    );
  }
}
