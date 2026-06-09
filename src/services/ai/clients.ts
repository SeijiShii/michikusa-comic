import OpenAI from "openai";
import type { PhotoUnderstanding } from "./plan.js";

let _oa: OpenAI | null = null;
function openai(): OpenAI {
  if (_oa) return _oa;
  const k = process.env.OPENAI_API_KEY;
  if (!k) throw new Error("OPENAI_API_KEY 未設定 (release で FILL)");
  _oa = new OpenAI({ apiKey: k });
  return _oa;
}

// 写真理解 (Vision, store=false で学習拒否)
export async function understandPhoto(imageUrl: string): Promise<PhotoUnderstanding> {
  const r = await openai().chat.completions.create({
    model: "gpt-4o-mini", store: false,
    messages: [{
      role: "user",
      content: [
        { type: "text", text: "この写真の被写体(配列)と状況を JSON {subjects:string[], situation:string} で。" },
        { type: "image_url", image_url: { url: imageUrl } },
      ],
    }],
    response_format: { type: "json_object" },
  });
  const j = JSON.parse(r.choices[0].message.content || "{}");
  return { subjects: j.subjects ?? [], situation: j.situation ?? "" };
}

// 4 コマ画像生成 (Gemini 2.5 Flash Image, fetch)。セリフは含めない (アプリ側合成)
export async function generatePanelImages(prompts: string[]): Promise<string[]> {
  const k = process.env.GEMINI_API_KEY;
  if (!k) throw new Error("GEMINI_API_KEY 未設定 (release で FILL)");
  // 実 Gemini image API 呼び出し (release で実キー検証)。構造のみ。
  const results: string[] = [];
  for (const p of prompts) {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${k}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: p }] }] }),
    });
    if (!res.ok) throw new Error(`Gemini ${res.status}`);
    const j: any = await res.json();
    const b64 = j?.candidates?.[0]?.content?.parts?.find((x: any) => x.inlineData)?.inlineData?.data;
    results.push(b64 ?? "");
  }
  return results;
}
