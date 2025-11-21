import { GoogleGenAI, Type } from "@google/genai";
import { StoryResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateStoryScript = async (): Promise<StoryResponse> => {
  const prompt = `
    You are a master storyteller and artist of traditional Chinese Lianhuanhua (picture books).
    Create a storyboard for the story "Daiyu Burying Flowers" (黛玉葬花) from Dream of the Red Chamber.
    
    Break the story into exactly 6 distinct scenes.
    For each scene, provide:
    1. A short poetic title (4-6 Chinese characters).
    2. Narrative text in simplified Chinese. The style should be lyrical, classical yet accessible, fitting for a picture book.
    3. A detailed visual description for an AI image generator. Describe the scene in English. Include details about the composition, Lin Daiyu's appearance (traditional Hanfu, frail, elegant), the setting (garden, fallen blossoms, flower hoe, silk bag), and the artistic style (Studio Ghibli style, Miyazaki Hayao art, lush greenery, beautiful clouds, vibrant colors, hand-drawn animation texture, emotional atmosphere).

    Return the response in JSON format.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          scenes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                narrative_text: { type: Type.STRING },
                visual_description: { type: Type.STRING },
              },
              required: ['title', 'narrative_text', 'visual_description'],
            },
          },
        },
        required: ['title', 'scenes'],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response text from Gemini");
  return JSON.parse(text) as StoryResponse;
};

export const generateSceneImage = async (visualDescription: string): Promise<string> => {
  // Enhancing the prompt for style consistency - Miyazaki/Ghibli Style
  const fullPrompt = `Studio Ghibli style, Miyazaki Hayao art style, anime style, hand-drawn aesthetic, lush detailed background, soft natural lighting, vibrant colors, picturesque, emotive. ${visualDescription}. Masterpiece, 8k resolution, highly detailed, cel shaded.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
        parts: [
            { text: fullPrompt }
        ]
    },
  });

  // Check for candidates and parts
  const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
  
  if (part && part.inlineData && part.inlineData.data) {
    return `data:image/png;base64,${part.inlineData.data}`;
  }

  throw new Error("Failed to generate image");
};