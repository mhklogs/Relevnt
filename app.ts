import express from "express";
import { GoogleGenAI, Type } from "@google/genai";

function hasApiKey() {
  const apiKey = process.env.GEMINI_API_KEY;
  return !!(apiKey && apiKey.trim() !== "" && apiKey !== "MY_GEMINI_API_KEY");
}

export function createApp() {
  const app = express();
  app.use(express.json());

  // Health endpoint: lets the client degrade gracefully when no API key is configured
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      aiConfigured: hasApiKey(),
    });
  });

  app.post("/api/generate-search-filters", async (req, res) => {
    try {
      const { targetDescription } = req.body;

      if (!targetDescription) {
        return res.status(400).json({ error: "Target description is required." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!hasApiKey()) {
        return res.status(401).json({ error: "Gemini API Key is missing on the server. Please add GEMINI_API_KEY to your environment variables." });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const systemInstruction = `You are an elite B2B Data Strategist and Lead Generation Architect specializing in advanced outbound sourcing techniques. Your objective is to translate an informal, messy target description from a user into structured, hyper-optimized search parameters for LinkedIn Standard and LinkedIn Sales Navigator.

Your output must be structurally sound, eliminating all guesswork for the salesperson by mapping out exactly what fields to manipulate.

### CORE OPERATIONAL DIRECTIVES:
1. MAXIMIZE PRECISION: Analyze the user's intent to extract ideal job titles, targeted industries, geographic clusters, and company scales.
2. SYNTAX EXCELLENCE: Generate advanced Boolean search strings using strict logical formatting:
   - Enclose exact multi-word phrases in straight double quotes: "VP of Sales"
   - Group title clusters with parentheses: ("CTO" OR "Chief Technology Officer")
   - Use uppercase operators: AND, OR, NOT
3. COMPRESSION & ACCURACY: Ensure the Boolean string is clean and copy-paste ready, avoiding redundant parameters or terms that broaden results into irrelevant territory.
4. ZERO CHATTY PROSE: Do not explain your thought process or say "Here is your search strategy." Focus entirely on delivering high-fidelity parameter maps.

### STRUCTURAL JSON OUTPUT SCHEMATIC:
You must process the user inputs and return a single structured object adhering to these exact keys:

1. "targetPersona": A bulleted or comma-separated summary of the primary human targets.
2. "industryFilters": The specific industry classifications the user should select in the LinkedIn filter sidebar.
3. "locationFilters": The precise geographic locations or workplace types (e.g., Remote, On-site) to apply.
4. "companySize": The optimal headcount tiers (e.g., 11-50, 51-200) based on the user's criteria.
5. "booleanSearchString": The raw, advanced text string to be copied directly into the LinkedIn search engine field.
6. "proTip": A concise, high-leverage tactical piece of hunting advice tailored specifically to outmaneuvering competitors within this niche.`;

      const prompt = `User messy target description:
${targetDescription}

Generate the structured LinkedIn search parameters and Boolean search string based on this target description.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              targetPersona: { type: Type.STRING },
              industryFilters: { type: Type.STRING },
              locationFilters: { type: Type.STRING },
              companySize: { type: Type.STRING },
              booleanSearchString: { type: Type.STRING },
              proTip: { type: Type.STRING }
            },
            required: ["targetPersona", "industryFilters", "locationFilters", "companySize", "booleanSearchString", "proTip"]
          }
        }
      });

      const resultText = response.text;
      if (!resultText) {
        throw new Error("Empty response received from Gemini API.");
      }

      const data = JSON.parse(resultText);
      res.json(data);
    } catch (error: any) {
      console.error("Error generating LinkedIn search parameters:", {
        message: error?.message,
        status: error?.status,
        stack: error?.stack?.split("\n")[0]
      });
      res.status(500).json({
        error: error?.message || "Failed to generate search parameters.",
        details: error?.toString() || "Unknown error"
      });
    }
  });

  app.post("/api/generate-outreach-email", async (req, res) => {
    try {
      const {
        prospectName,
        prospectTitle,
        companyName,
        companyValueProp,
        senderName,
        senderCompany,
        senderValueProp,
        rawLinkedInActivity,
        outreachGoal
      } = req.body;

      if (!prospectName || !prospectTitle || !companyName || !companyValueProp || !senderName || !senderCompany || !senderValueProp || !rawLinkedInActivity || !outreachGoal) {
        return res.status(400).json({ error: "All input fields are required." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!hasApiKey()) {
        return res.status(401).json({ error: "Gemini API Key is missing on the server. Please add GEMINI_API_KEY to your environment variables." });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const systemInstruction = `You are an elite B2B Growth Marketer and Senior SDR specializing in hyper-personalized, ultra-short cold outreach. Your sole purpose is to analyze a prospect's recent LinkedIn activity and company profile to write an outbound email that achieves an exceptionally high response rate.

Strict Core Directives (The "Anti-AI" Rules):
1. NO FLUFF OR FLATTERY: Do not say "I hope this email finds you well," "Congrats on the impressive background," or "I love your insights." Start directly with the hook.
2. 90/10 RULE: 90% of the email must be about the prospect's world, problems, or thoughts. Only 10% is about the sender's offering.
3. CONVERSATIONAL TONE: Write exactly how a professional speaks to a peer. Avoid heavy marketing buzzwords (e.g., leverage, streamline, paradigm shift, holistic).
4. LENGTH CONSTRAINT: The entire email body must be under 100 words. Shorter emails get read; long pitches get deleted.

The 4-Part Copywriting Framework:
You must structure the email using this exact flow:
1. THE TRIGGER HOOK (Line 1): A 1-sentence, highly specific observation regarding their recent LinkedIn activity. Reference a specific point, data, or unique phrase they used. Do not just summarize their post; react to a specific takeaway from it.
2. THE EMPATHY/LINK BRIDGE (Line 2): Connect their post or thought to a broader operational challenge that someone in their role (Prospect Title: "${prospectTitle}") faces daily.
3. THE VALUE ASSET / PROOF (Line 3): State how Sender Company ("${senderCompany}") solves that specific challenge. Use a concrete, data-backed outcome. (e.g., "We help [similar target market] reduce AWS compute bills by 30%").
4. THE LOW-FRICTION CTA (Line 4): End with a soft, open-ended question. NEVER ask for a 15-minute call or a calendar link in the first email. Use soft interest CTAs like "Worth a quick look?" or "Open to seeing how we do it?"

HTML Formatting Instructions:
You must generate a matching HTML-formatted version in the "emailBodyHtml" property.
- Use standard '<br/>' tags for all line breaks.
- Bold key statistics, metrics, or proof outcomes using standard '<strong>' tags.
- Hyperlink the sender company name and any relevant links using standard HTML anchor tags (e.g., '<a href="https://example.com" style="color: #ef4444; font-weight: 600; text-decoration: underline;">${senderCompany}</a>').

Output requirements:
You must generate exactly 2 distinct variations.
For each variation:
- Subject Line: Under 5 words, lowercase, sounding internal and non-salesy (e.g., "quick question re: [topic of post]").
- Email Body: Follow the 4-part framework under 100 words total. Let the text flow naturally. Do not add any greeting labels or footer labels inside the email body (do not include "Dear [Prospect]," or "Best, [Sender]"). Start the email directly with the Trigger Hook.
- Email Body HTML: A exact HTML representation of the Email Body following the HTML Formatting Instructions above.
- Also break down the exact parts (the actual sentences) that represent each of the 4 parts of the framework.`;

      const prompt = `Prospect Information:
Name: ${prospectName}
Title: ${prospectTitle}
Company: ${companyName}
Company Value Proposition: ${companyValueProp}

Sender Information:
Name: ${senderName}
Company: ${senderCompany}
Company Value Proposition / Outcome: ${senderValueProp}

Prospect LinkedIn Activity:
${rawLinkedInActivity}

Target Outreach Goal / Message Type:
${outreachGoal}

Instruction:
Generate exactly 2 distinct, highly creative, and highly personalized email variations based on the prompt constraints, system instruction, and the target outreach goal specified above. If the goal specifies a format other than email (e.g. a LinkedIn connection invite), adapt the length and styling to match the goal exactly, while keeping the personalization hook intact.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              variations: {
                type: Type.ARRAY,
                description: "List of exactly 2 different personalized cold email variations.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    subjectLine: {
                      type: Type.STRING,
                      description: "Subject line of the email. Under 5 words, lowercase."
                    },
                    emailBody: {
                      type: Type.STRING,
                      description: "The complete outbound email body under 100 words total."
                    },
                    emailBodyHtml: {
                      type: Type.STRING,
                      description: "The HTML formatted email body with bold tags and anchor links."
                    },
                    frameworkBreakdown: {
                      type: Type.OBJECT,
                      properties: {
                        triggerHook: { type: Type.STRING },
                        empathyBridge: { type: Type.STRING },
                        valueProof: { type: Type.STRING },
                        lowFrictionCta: { type: Type.STRING }
                      },
                      required: ["triggerHook", "empathyBridge", "valueProof", "lowFrictionCta"]
                    }
                  },
                  required: ["subjectLine", "emailBody", "emailBodyHtml", "frameworkBreakdown"]
                }
              }
            },
            required: ["variations"]
          }
        }
      });

      const resultText = response.text;
      if (!resultText) {
        throw new Error("Empty response received from Gemini API.");
      }

      const cleanJson = resultText.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
      const data = JSON.parse(cleanJson);
      res.json(data);
    } catch (error: any) {
      console.error("Error generating outreach emails:", {
        message: error?.message,
        status: error?.status,
        stack: error?.stack?.split("\n")[0]
      });
      res.status(500).json({
        error: error?.message || "Failed to generate personalized outreach emails.",
        details: error?.toString() || "Unknown error"
      });
    }
  });

  app.use((err: any, req: any, res: any, next: any) => {
    console.error("Unhandled error:", err);
    res.status(500).json({
      error: "An internal server error occurred.",
      details: err?.message || String(err)
    });
  });

  return app;
}
