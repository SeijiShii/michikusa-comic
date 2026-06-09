import { FOUR_PANEL_STRUCTURE } from "./prompts.js";

export interface PhotoUnderstanding {
  subjects: string[];   // 被写体
  situation: string;    // 状況
}
export interface PanelPlan { order: number; role: string; caption: string; speechDraft: string; }
export interface ComicPlan { panels: PanelPlan[]; }

// 写真理解 + ひとこと → 4 コマ構成案 (コマ割り + セリフ案)。型を内包 (差別化)
export function buildComicPlan(u: PhotoUnderstanding, caption?: string): ComicPlan {
  const base = caption?.trim() || u.situation || u.subjects[0] || "道草";
  const panels = FOUR_PANEL_STRUCTURE.map((s, i) => ({
    order: i + 1,
    role: s.role,
    caption: s.hint,
    speechDraft: defaultSpeech(s.role, base, u),
  }));
  return { panels };
}

function defaultSpeech(role: string, base: string, u: PhotoUnderstanding): string {
  const subj = u.subjects[0] ?? base;
  switch (role) {
    case "起": return `あ、${subj}だ`;
    case "承": return `よく見ると…`;
    case "転": return `なんか面白いな`;
    default: return `道草、いいね`;
  }
}
