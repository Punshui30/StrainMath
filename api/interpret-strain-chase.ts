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

INPUT WEIGHTING (CRITICAL):
1. PRIMARY DRIVER: The "Strain I remember" (+ Brand if provided) is the absolute reference point. Use its known chemical pedigree, public terpene data, and lineage as the base.
2. SECONDARY MODIFIER: The "What I loved about it" field should only be used to nudge or refine the profile, NOT replace it.
3. TRANSLATION: Map the resulting profile into our 6 normalized effect vectors (0-1).

RULES:
- If you recognize the strain: Base the intent on its known genetics + user's refinements.
- If you DO NOT recognize the strain: Use the user's "loved effects" but label the Similarity Score as "Low".
- If the strain is known but the user's effects conflict (e.g., they say a heavy Indica made them energized): Nudge towards the user's experience but keep the core strain identity as the base.
- NEVER ignore the strain name.

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
  "explanation": "Briefly explain the lookup logic (e.g., 'Identified as a high-myrcene profile with user-requested focus refinements')",
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
