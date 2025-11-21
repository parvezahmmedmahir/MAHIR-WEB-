
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Using gemini-3-pro-preview for complex coding and reasoning tasks.
const GEMINI_MODEL = 'gemini-3-pro-preview';

// Initialize the Google GenAI client.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `You are an expert AI Engineer and Product Designer.
Your goal is to take user input and generate functional HTML/JS/CSS applications.
Directives:
1. NO external images (use emojis/SVG/CSS).
2. Single file output.
3. Interactive and robust.
`;

export async function bringToLife(prompt: string, fileBase64?: string, mimeType?: string): Promise<string> {
  const parts: any[] = [];
  
  const finalPrompt = fileBase64 
    ? "Analyze this image/document. Detect implied functionality. Gamify real-world objects. Build a fully interactive web app. NO external image URLs. Use CSS/SVGs." 
    : prompt || "Create a demo app showing capabilities.";

  parts.push({ text: finalPrompt });

  if (fileBase64 && mimeType) {
    parts.push({
      inlineData: {
        data: fileBase64,
        mimeType: mimeType,
      },
    });
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: { parts: parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.5,
      },
    });

    let text = response.text || "<!-- Failed to generate content -->";
    text = text.replace(/^```html\s*/, '').replace(/^```\s*/, '').replace(/```$/, '');
    return text;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
}

/**
 * Generates a high-impact project description with Version Highlighting.
 */
export async function generateSmartDescription(
  name: string, 
  description: string, 
  languages: string[], 
  topics: string[], 
  readmeContent?: string
): Promise<string> {
  
  // VERSION DETECTION LOGIC
  // Regex to find v1, v2.0, V3, etc.
  const versionMatch = name.match(/v(\d+(\.\d+)?)/i);
  const hasVersion = !!versionMatch;
  const versionTag = hasVersion ? `[NEW ${versionMatch[0].toUpperCase()}]` : '';

  // Enhanced Prompt for "Max Power" marketing copy and Version Detection
  let prompt = `
  TASK: Generate a compelling, high-impact portfolio description for a sophisticated tech project.
  
  INPUT DATA:
  - Name: ${name}
  - Description: ${description}
  - Tech Stack: ${languages.join(', ')}
  - Topics: ${topics.join(', ')}
  - DETECTED VERSION: ${hasVersion ? versionMatch[0] : 'None'}
  
  OBJECTIVE:
  Craft a detailed description that emphasizes **key features**, **technical challenges overcome**, and **real-world impact**. 
  It should sound authoritative, sophisticated, and engineering-focused.

  CRITICAL RULES:
  1. **VERSION**: The name contains "${hasVersion ? versionMatch[0] : 'no version'}". If a version exists, you MUST mention it immediately (e.g., "The new V4 release introduces...").
  2. **TONE**: Use professional, high-impact terminology (e.g., "High-Frequency Trading", "Enterprise Grade", "AI-Driven", "Real-time latency optimization").
  3. **CONTENT**: Focus on the *technical solution* and *performance metrics* if available. What makes this system unique?
  4. **LENGTH**: Approximately 250-280 characters. Dense with information, no fluff.
  5. Do NOT simply repeat the project name literally at the start. Start with the capability (e.g. "An autonomous trading system...").
  `;
  
  if (readmeContent) {
    prompt += `\n\nREADME CONTEXT (Use this for specific technical details & feature extraction):\n${readmeContent.slice(0, 4000)}`;
  }

  try {
    // Using gemini-2.5-flash for fast text generation.
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [{ text: prompt }] }
    });

    let result = response.text || description;
    
    // Manually inject version tag if Gemini missed it, for maximum visibility
    if (hasVersion && !result.toLowerCase().includes('v' + versionMatch[1])) {
       result = `${versionTag} ${result}`;
    }

    return result;
  } catch (error) {
    console.error("Gemini Description Generation Error:", error);
    return description; // Fallback
  }
}
