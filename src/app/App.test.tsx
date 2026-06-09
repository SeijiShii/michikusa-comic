// @vitest-environment happy-dom
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { App } from "./App.js";

describe("App 合成レイヤ (O57, 実コンポーネント配線)", () => {
  it("起動: トップに実 CaptureScreen + 入口リード文(O41)", () => {
    render(<App />);
    expect(screen.getByText(/4 コマにして残すアプリ/)).toBeInTheDocument();
    expect(screen.getByLabelText("写真をえらぶ")).toBeInTheDocument();
  });
  it("ギャラリーに遷移→実 GalleryScreen (空状態)", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "ギャラリー" }));
    expect(screen.getByText(/まだ道草がありません/)).toBeInTheDocument();
  });
  it("設定に遷移→実 DeleteAllData (SEC-001 DSR)", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "設定" }));
    expect(screen.getByText(/運営側ではあなたを特定できない/)).toBeInTheDocument();
  });
  it("O55: フッタから法務ページ到達 (実 PrivacyPolicy)", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "プライバシーポリシー" }));
    expect(screen.getByText(/AI に送信/)).toBeInTheDocument();
  });
  it("FeedbackWidget が常設 (O40)", () => {
    render(<App />);
    expect(screen.getByRole("button", { name: "フィードバック" })).toBeInTheDocument();
  });
});
