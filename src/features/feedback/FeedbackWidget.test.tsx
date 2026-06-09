// @vitest-environment happy-dom
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { FeedbackWidget } from "./FeedbackWidget.js";

const base = { route: "/gallery", appVersion: "0.1.0" };

describe("FeedbackWidget (O40 / SEC-002)", () => {
  it("👍 リアクション送信", () => {
    const onSend = vi.fn();
    render(<FeedbackWidget {...base} onSend={onSend} />);
    fireEvent.click(screen.getByRole("button", { name: "フィードバック" }));
    fireEvent.click(screen.getByRole("button", { name: "いいね" }));
    expect(onSend).toHaveBeenCalledWith(expect.objectContaining({ kind: "reaction", reaction: "like", route: "/gallery" }));
  });
  it("バグ報告は送信前に PII scrub (SEC-002)", () => {
    const onSend = vi.fn();
    render(<FeedbackWidget {...base} onSend={onSend} />);
    fireEvent.click(screen.getByRole("button", { name: "フィードバック" }));
    fireEvent.change(screen.getByLabelText("気づいたこと"), { target: { value: "連絡は a@b.com まで" } });
    fireEvent.click(screen.getByRole("button", { name: "送る" }));
    expect(onSend).toHaveBeenCalledWith(expect.objectContaining({ body: expect.stringContaining("[メール]") }));
  });
});
