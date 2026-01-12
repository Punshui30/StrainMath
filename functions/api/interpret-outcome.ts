interface Env {
    OPENAI_API_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
    // CORS Headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    try {
        const { outcomeText } = await request.json() as { outcomeText: string };

        if (!outcomeText) {
            return new Response(JSON.stringify({ error: "Missing outcomeText" }), {
                status: 400,
                headers: corsHeaders
            });
        }

        if (!env || !env.OPENAI_API_KEY) {
            console.error("Missing OPENAI_API_KEY env var");
            return new Response(JSON.stringify({ error: "OPENAI_API_KEY is not configured" }), {
                status: 500,
                headers: corsHeaders
            });
        }

        // Call OpenAI directly to avoid dependency issues in Edge runtime
        const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: `You are a cannabis formulation assistant.\n\nGiven the user's input, return:\n1. Normalized intent vectors (0–1)\n2. A concise, human explanation (2–4 sentences) explaining WHY this blend direction fits the user's stated goal.\n\nRespond ONLY in valid JSON.\n\nSchema:\n{\n  "intent": {\n    "relaxation": number,\n    "focus": number,\n    "energy": number,\n    "creativity": number,\n    "pain_relief": number,\n    "anti_anxiety": number\n  },\n  "explanation": string\n}`
                    },
                    {
                        role: "user",
                        content: outcomeText
                    }
                ],
                response_format: { type: "json_object" }
            })
        });

        if (!openAiResponse.ok) {
            const errorText = await openAiResponse.text();
            console.error("OpenAI API Error:", errorText);
            return new Response(JSON.stringify({ error: "Failed to call OpenAI", details: errorText }), {
                status: 500,
                headers: corsHeaders
            });
        }

        const data: any = await openAiResponse.json();
        const result = data.choices[0].message.content;

        // Return result directly (it is already JSON string)
        return new Response(result, {
            status: 200,
            headers: corsHeaders
        });

    } catch (err: any) {
        console.error("Worker Error:", err);
        return new Response(JSON.stringify({ error: "Internal Server Error", details: err.message }), {
            status: 500,
            headers: corsHeaders
        });
    }
};

export const onRequestOptions: PagesFunction = async () => {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        }
    });
};
