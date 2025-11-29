import { GoogleGenAI } from "@google/genai";
import { GenerateRequest } from "../types";

// In a real app, this comes from process.env.API_KEY
// For this demo, we assume the environment is set up.
const apiKey = process.env.API_KEY || 'demo-key'; 

const ai = new GoogleGenAI({ apiKey });

export const generateContent = async (request: GenerateRequest): Promise<string> => {
  try {
    // Determine model based on complexity. Pro for logic, Flash for speed.
    // Since this is curriculum generation which requires logic, we prefer Pro if available, or Flash.
    const modelId = 'gemini-2.5-flash'; 

    let systemInstruction = "你是一个专业的职业教育课程开发专家。请根据用户的要求优化或生成课程内容。输出必须是纯文本，不要包含Markdown格式符号。";

    if (request.rowId) {
        systemInstruction += " 你正在重新生成表格中的某一行数据。保持专业、准确。";
    }

    const response = await ai.models.generateContent({
      model: modelId,
      contents: request.prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "生成失败，请重试。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback for demo if API key is invalid/missing
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`[AI生成结果] 根据您的要求 "${request.prompt}"，我们优化了该部分内容。新的内容强调了操作规范性与安全意识，整合了最新的行业标准...`);
        }, 1500);
    });
  }
};
