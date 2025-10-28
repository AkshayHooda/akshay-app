import { GoogleGenAI, Modality } from "@google/genai";

export const generateAvatarFromLocation = async (region: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API key not found. Please set the API_KEY environment variable.");
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `Create a vibrant, artistic AI avatar representing the unique culture, landmarks, and natural beauty of ${region}. The style should be a modern digital illustration, suitable for a profile picture. Avoid realistic human depictions; focus on abstract and symbolic elements.`;

  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '1:1',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
      throw new Error("Image generation failed, no images were returned.");
    }
  } catch (error) {
    console.error("Error generating image with Gemini:", error);
    throw new Error("Failed to generate avatar. The AI model might be unavailable.");
  }
};

export const generateAvatarFromImage = async (base64ImageData: string, mimeType: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API key not found.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = "Transform the person in this image into a vibrant, artistic AI avatar. The style should be a modern digital illustration, suitable for a profile picture, reflecting a creative and abstract interpretation rather than a realistic one.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes = part.inlineData.data;
        return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
      }
    }
    
    throw new Error("Image generation failed, no image part was returned in the response.");

  } catch (error) {
    console.error("Error generating image with Gemini:", error);
    throw new Error("Failed to generate avatar from image. The AI model might be unavailable or the image could not be processed.");
  }
};