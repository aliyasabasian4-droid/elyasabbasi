
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Basic text generation for descriptions
 */
export const generateListingDescription = async (title: string, category: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `اكتب وصفاً جذاباً واحترافياً باللغة العربية لمنتج بعنوان "${title}" في قسم "${category}". اجعل الوصف يشجع على الشراء ويوضح المميزات المحتملة.`,
      config: {
        systemInstruction: "أنت مساعد مبيعات خبير في تطبيق توفير تايم. هدفك مساعدة المستخدمين على كتابة أفضل وصف لإعلاناتهم.",
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "";
  }
};

/**
 * Suggest price based on general knowledge
 */
export const suggestPrice = async (title: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `اقترح سعراً تقريبياً بالريال السعودي لـ "${title}" مستخدماً خبرتك في السوق السعودي. اعطِ رقماً واحداً فقط أو نطاقاً سعرياً.`,
    });
    return response.text;
  } catch (error) {
    return "غير متاح";
  }
};

/**
 * Nano Banana Image Editing (Gemini 2.5 Flash Image)
 */
export const editListingImage = async (base64Image: string, prompt: string, mimeType: string = 'image/jpeg') => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(',')[1] || base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: `Edit this product image based on this request: ${prompt}. Return the modified image.`,
          },
        ],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Edit Error:", error);
    return null;
  }
};

/**
 * Maps Grounding for nearby location highlights
 */
export const searchNearbyPlaces = async (lat: number, lng: number, query: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `ما هي أهم الأماكن أو الخدمات المتعلقة بـ "${query}" القريبة من هذا الموقع؟`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng,
            }
          }
        }
      },
    });

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const links = chunks.map((chunk: any) => ({
      uri: chunk.maps?.uri,
      title: chunk.maps?.title
    })).filter((l: any) => l.uri);

    return {
      text: response.text,
      links: links
    };
  } catch (error) {
    console.error("Maps Search Error:", error);
    return null;
  }
};

/**
 * Search Grounding for Market Insights (Complex Task -> gemini-3-pro-preview)
 */
export const getMarketInsight = async (title: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `ابحث عن أسعار وحالة السوق الحالية لـ "${title}" في المملكة العربية السعودية. هل السعر عادل؟ ما هي النصائح للمشتري؟`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const links = chunks.map((chunk: any) => ({
      uri: chunk.web?.uri,
      title: chunk.web?.title
    })).filter((l: any) => l.uri);

    return {
      text: response.text,
      links: links
    };
  } catch (error) {
    console.error("Market Insight Error:", error);
    return null;
  }
};
