// @vitest-environment happy-dom
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { CaptureScreen } from "./CaptureScreen.js";

function makeFile(type: string, size: number, name = "p.jpg"): File {
  const f = new File(["x"], name, { type });
  Object.defineProperty(f, "size", { value: size });
  return f;
}

describe("CaptureScreen", () => {
  it("入口の『これは何？』リード文がある (O41)", () => {
    render(<CaptureScreen onSubmit={() => {}} />);
    expect(screen.getByText(/4 コマにして残すアプリ/)).toBeInTheDocument();
  });
  it("写真未選択ではボタン無効", () => {
    render(<CaptureScreen onSubmit={() => {}} />);
    expect(screen.getByRole("button", { name: "4 コマにする" })).toBeDisabled();
  });
  it("有効な写真を選ぶとボタン有効 + onSubmit", () => {
    const onSubmit = vi.fn();
    render(<CaptureScreen onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText("写真をえらぶ"), { target: { files: [makeFile("image/jpeg", 1000)] } });
    const btn = screen.getByRole("button", { name: "4 コマにする" });
    expect(btn).toBeEnabled();
    fireEvent.click(btn);
    expect(onSubmit).toHaveBeenCalledOnce();
  });
  it("不正ファイルでやさしいエラー (SEC-005, O38)", () => {
    render(<CaptureScreen onSubmit={() => {}} />);
    fireEvent.change(screen.getByLabelText("写真をえらぶ"), { target: { files: [makeFile("application/pdf", 1000, "x.pdf")] } });
    expect(screen.getByRole("alert")).toHaveTextContent(/対応していない/);
  });
});
