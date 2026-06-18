import { Capacitor } from '@capacitor/core';

export interface GeminiAnalysisResult {
  success: boolean;
  roomAnalysis: {
    detectedRoomType: string;
    lightingQuality: string;
    spaceSize: string;
    existingFurniture: string[];
    issuesFound: string[];
  };
  enhancedPrompt: string;
}

/**
 * Analyzes a room image using Google Gemini Vision to extract features
 * and create an enhanced, personalized interior design prompt.
 * 
 * @param imageBase64 Full base64 Data URL or raw base64 content of the room photo
 * @param roomType User's selected target room type (e.g. Living Room, Bedroom)
 * @param style User's selected target design style (e.g. Modern, Luxury)
 */
export const analyzeRoomWithGemini = async (
  imageBase64: string,
  roomType: string,
  style: string
): Promise<GeminiAnalysisResult> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY is not defined in the environment.");
  }

  // Parse image MIME type and raw base64 content
  let mimeType = "image/jpeg";
  let rawBase64 = imageBase64;

  if (imageBase64.startsWith("data:")) {
    const match = imageBase64.match(/data:([^;]+);base64,(.*)/);
    if (match) {
      mimeType = match[1];
      rawBase64 = match[2];
    }
  }

  const systemPrompt = `You are a professional luxury interior designer and architectural visualization expert.

The user has uploaded a room image.

The user selected:
Room Type: ${roomType}
Design Style: ${style}

Analyze the image carefully.

Tasks:
1. Identify furniture and layout.
2. Evaluate lighting quality.
3. Evaluate wall, flooring, and ceiling conditions.
4. Identify design weaknesses.
5. Suggest realistic improvements.
6. Preserve room dimensions.
7. Preserve room structure.
8. Preserve camera perspective.
9. Respect the selected room type.
10. Respect the selected design style.

Generate a highly detailed image-editing prompt suitable for AI interior redesign.

The redesign must:
* look realistic
* look luxurious
* improve furniture arrangement
* improve lighting
* improve materials
* improve visual appeal
* remain practical

Return JSON only.`;

  // Gemini REST API Endpoint for gemini-2.5-flash
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        parts: [
          {
            text: systemPrompt
          },
          {
            inlineData: {
              mimeType: mimeType,
              data: rawBase64
            }
          }
        ]
      }
    ],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          success: { type: "BOOLEAN" },
          roomAnalysis: {
            type: "OBJECT",
            properties: {
              detectedRoomType: { type: "STRING" },
              lightingQuality: { type: "STRING" },
              spaceSize: { type: "STRING" },
              existingFurniture: {
                type: "ARRAY",
                items: { type: "STRING" }
              },
              issuesFound: {
                type: "ARRAY",
                items: { type: "STRING" }
              }
            },
            required: ["detectedRoomType", "lightingQuality", "spaceSize", "existingFurniture", "issuesFound"]
          },
          enhancedPrompt: { type: "STRING" }
        },
        required: ["success", "roomAnalysis", "enhancedPrompt"]
      }
    }
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Gemini API responded with status: ${response.status}`);
  }

  const result = await response.json();
  const textContent = result.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textContent) {
    throw new Error("No output generated from Gemini Vision API.");
  }

  // Parse the structured JSON response
  const parsed: GeminiAnalysisResult = JSON.parse(textContent);

  if (import.meta.env.DEV) {
    console.log("🌟 Gemini Vision Analysis Output:", parsed);
  }

  return parsed;
};
