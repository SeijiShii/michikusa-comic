// @vitest-environment happy-dom
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { SpeechEditor } from "./SpeechEditor.js";

describe("SpeechEditor", () => {
  it("4コマのセリフを編集して保存", () => {
    const onSave = vi.fn();
    render(<SpeechEditor initial={["あ", "む", "お", "ね"]} onSave={onSave} />);
    fireEvent.change(screen.getByLabelText("1コマめのセリフ"), { target: { value: "あ、猫だ" } });
    fireEvent.click(screen.getByRole("button", { name: "保存する" }));
    expect(onSave).toHaveBeenCalledWith(["あ、猫だ", "む", "お", "ね"]);
  });
});
