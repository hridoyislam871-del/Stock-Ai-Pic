import { GoogleGenAI } from "@google/genai";

// Fix: Initialize GoogleGenAI directly with process.env.API_KEY and remove unnecessary checks.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4";

export async function generateImage(prompt: string, aspectRatio: string): Promise<string> {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: aspectRatio as AspectRatio,
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
      throw new Error("No image was generated. The response might have been blocked due to safety policies.");
    }
  } catch (error) {
    console.error("Error generating image:", error);
    if (error instanceof Error) {
        return Promise.reject(new Error(`Failed to generate image: ${error.message}`));
    }
    return Promise.reject(new Error("An unknown error occurred while generating the image."));
  }
}
