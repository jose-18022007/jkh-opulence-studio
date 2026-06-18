import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { analyzeRoomWithGemini } from "../lib/gemini";

describe("analyzeRoomWithGemini", () => {
  const originalEnvKey = import.meta.env.VITE_GEMINI_API_KEY;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    // Restore environment variables
    if (originalEnvKey) {
      import.meta.env.VITE_GEMINI_API_KEY = originalEnvKey;
    } else {
      delete (import.meta.env as Record<string, any>).VITE_GEMINI_API_KEY;
    }
  });

  it("should throw an error if VITE_GEMINI_API_KEY is missing", async () => {
    delete (import.meta.env as Record<string, any>).VITE_GEMINI_API_KEY;

    await expect(
      analyzeRoomWithGemini("data:image/jpeg;base64,aaaa", "Living Room", "Modern")
    ).rejects.toThrow("VITE_GEMINI_API_KEY is not defined in the environment.");
  });

  it("should make a successful API request and return parsed JSON when the key is provided", async () => {
    import.meta.env.VITE_GEMINI_API_KEY = "dummy-api-key";

    const mockResponse = {
      candidates: [
        {
          content: {
            parts: [
              {
                text: JSON.stringify({
                  success: true,
                  roomAnalysis: {
                    detectedRoomType: "Living Room",
                    lightingQuality: "Good natural lighting",
                    spaceSize: "Medium",
                    existingFurniture: ["Sofa", "Coffee Table"],
                    issuesFound: ["Cluttered spatial layout", "Lack of accent colors"]
                  },
                  enhancedPrompt: "Transform this room into a premium modern luxury space with customized elements."
                })
              }
            ]
          }
        }
      ]
    };

    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    } as Response);

    const result = await analyzeRoomWithGemini(
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "Living Room",
      "Modern"
    );

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [calledUrl, options] = fetchSpy.mock.calls[0];
    expect(calledUrl).toContain("key=dummy-api-key");
    expect(calledUrl).toContain("gemini-2.5-flash:generateContent");
    
    // Verify request payload details
    const parsedBody = JSON.parse(options?.body as string);
    expect(parsedBody.contents[0].parts[0].text).toContain("Living Room");
    expect(parsedBody.contents[0].parts[0].text).toContain("Modern");
    expect(parsedBody.contents[0].parts[1].inlineData.mimeType).toBe("image/png");
    expect(parsedBody.generationConfig.responseMimeType).toBe("application/json");

    // Verify response return value
    expect(result.success).toBe(true);
    expect(result.roomAnalysis.detectedRoomType).toBe("Living Room");
    expect(result.enhancedPrompt).toContain("premium modern luxury space");
  });

  it("should throw an error if Gemini REST API returns a non-200 response", async () => {
    import.meta.env.VITE_GEMINI_API_KEY = "dummy-api-key";

    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 400,
    } as Response);

    await expect(
      analyzeRoomWithGemini("data:image/jpeg;base64,aaaa", "Bedroom", "Minimalist")
    ).rejects.toThrow("Gemini API responded with status: 400");
  });

  it("should throw an error if the response text content is missing or empty", async () => {
    import.meta.env.VITE_GEMINI_API_KEY = "dummy-api-key";

    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ candidates: [] }),
    } as Response);

    await expect(
      analyzeRoomWithGemini("data:image/jpeg;base64,aaaa", "Bedroom", "Minimalist")
    ).rejects.toThrow("No output generated from Gemini Vision API.");
  });
});
