// LLM STRAIN CHASE INTERPRETATION LAYER
// This route converts remembered strain + effects into structured targets.

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

    const { strainName, lovedEffects } = req.body;

    if (!strainName) {
        return res.status(400).json({ error: "Missing strainName" });
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
                    content: `You are a cannabis strain analysis and effects translator.
                    
Goal: Create a "Reference Shadow Profile" for a remembered strain to approximate its experience.

Constraint: 
1. Treat this as PROBABILISTIC and DIRECTIONAL.
2. Translate the strain's known public profile + user's remembered effects into normalized target vectors (0-1).
3. Provide a Similarity Score (High, Medium, or Low) based on how well-defined the strain is.
4. Provide a Match Explanation explaining the translation (e.g., "Matched based on terpene dominance", "Adjusted for effect arc").

Axes: relaxation, focus, energy, creativity, pain_relief, anti_anxiety.

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
  "explanation": string,
  "similarityScore": "High" | "Medium" | "Low"
}`,
                },
                {
                    role: "user",
                    content: `Strain I remember: "${strainName}". ${lovedEffects ? `What I loved about it: "${lovedEffects}"` : ''}`,
                },
            ],
            response_format: { type: "json_object" },
        });

        const result = response.choices[0].message.content;
        return res.status(200).json(JSON.parse(result || "{}"));
    } catch (error: any) {
        console.error("LLM Strain Chase Error:", error);
        return res.status(500).json({ error: "Failed to approximate strain profile" });
    }
}
