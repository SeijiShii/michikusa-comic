// @vitest-environment happy-dom
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { PrivacyPolicy } from "./PrivacyPolicy.js";

describe("legal", () => {
  it("プラポリは AI 送信を明示", () => {
    render(<PrivacyPolicy />);
    expect(screen.getByText(/AI に送信/)).toBeInTheDocument();
  });
  it("SEC-001 ゲスト DSR 文言（窓口削除を約束しない）", () => {
    render(<PrivacyPolicy />);
    expect(screen.getByText(/特定できないため.*セルフサービス/)).toBeInTheDocument();
  });
});
