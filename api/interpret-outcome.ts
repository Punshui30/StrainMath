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
                    content: "You are a cannabis terpene expert. Interpret the user's desired outcome into structured intensity levels (0.0 to 1.0) for common medicinal and recreational targets. Return ONLY structured JSON. Values should be numeric. Keys: [relaxation, focus, energy, creativity, pain_relief, anti_anxiety].",
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
