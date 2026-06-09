// @vitest-environment happy-dom
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { App } from "./App.js";

describe("App 合成レイヤ (O57 smoke)", () => {
  it("起動: トップに入口リード文(O41)", () => {
    render(<App />);
    expect(screen.getByText(/4 コマにして残すアプリ/)).toBeInTheDocument();
  });
  it("主要画面に遷移できる", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "ギャラリー" }));
    expect(screen.getByRole("heading", { name: "ギャラリー" })).toBeInTheDocument();
  });
  it("O55: フッタから全法務ページに到達できる", () => {
    render(<App />);
    for (const name of ["プライバシーポリシー", "利用規約", "特定商取引法に基づく表記"]) {
      expect(screen.getByRole("button", { name })).toBeInTheDocument();
    }
    fireEvent.click(screen.getByRole("button", { name: "プライバシーポリシー" }));
    expect(screen.getByRole("heading", { name: "法務" })).toBeInTheDocument();
  });
});
