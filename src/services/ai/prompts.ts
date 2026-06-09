// 4 コマ構成の型 (ドメイン知識 = 汎用 AI 直叩きとの差別化、concept §1.1)
export const FOUR_PANEL_STRUCTURE = [
  { role: "起", hint: "情景・発見の導入（何を見つけたか）" },
  { role: "承", hint: "近づく・観察（ディテール）" },
  { role: "転", hint: "ちょっとした気づき・意外（道草の面白さ）" },
  { role: "結", hint: "ひとことオチ・余韻（やわらかく）" },
] as const;

export const STYLE_GUIDE =
  "やわらかい線画・温かみ・落書き感。プロ漫画でなく気軽な4コマ。セリフは含めない（アプリ側で合成）。";
