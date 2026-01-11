// LLM INTERPRETATION LAYER
// This route converts natural language intent into structured targets.
// Deterministic blend math runs separately.

import { OpenAI } from "openai";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { outcomeText } = req.body;

    if (!outcomeText) {
        return res.status(400).json({ error: "Missing outcomeText" });
    }

    if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({
            error: "OPENAI_API_KEY is not configured on the server."
        });
    }

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `You are a cannabis formulation assistant.

Given the user's input, return:
1. Normalized intent vectors (0–1)
2. A concise, human explanation (2–4 sentences) explaining WHY this blend direction fits the user's stated goal.

Respond ONLY in valid JSON.

Schema:
{
  "intent": {
    "relaxation": number,
    "focus": number,
    "energy": number,
    "creativity": number,
    "pain_relief": number,
    "anti_anxiety": number
  },
  "explanation": string
}`,
                },
                {
                    role: "user",
                    content: outcomeText,
                },
            ],
            response_format: { type: "json_object" },
        });

        const result = response.choices[0].message.content;
        return res.status(200).json(JSON.parse(result || "{}"));
    } catch (error: any) {
        console.error("LLM Interpretation Error:", error);
        return res.status(500).json({ error: "Failed to interpret intent" });
    }
}

/**
 * EXAMPLE FRONTEND CALL:
 * 
 * const interpretIntent = async (text: string) => {
 *   const response = await fetch('/api/interpret-outcome', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ outcomeText: text })
 *   });
 *   const structuredIntent = await response.json();
 *   console.log(structuredIntent);
 * };
 */
