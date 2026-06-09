// @vitest-environment happy-dom
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { DeleteAllData } from "./DeleteAllData.js";

describe("DeleteAllData (SEC-001 DSR セルフ削除)", () => {
  it("ゲスト特定不能の正直な文言がある (O54)", () => {
    render(<DeleteAllData onConfirmDelete={() => {}} />);
    expect(screen.getByText(/運営側ではあなたを特定できない/)).toBeInTheDocument();
  });
  it("二段階確認: 初回クリックでは削除しない", () => {
    const onDelete = vi.fn();
    render(<DeleteAllData onConfirmDelete={onDelete} />);
    fireEvent.click(screen.getByRole("button", { name: "すべてのデータを削除" }));
    expect(onDelete).not.toHaveBeenCalled();
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
  });
  it("二段階確認後に onConfirmDelete", () => {
    const onDelete = vi.fn();
    render(<DeleteAllData onConfirmDelete={onDelete} />);
    fireEvent.click(screen.getByRole("button", { name: "すべてのデータを削除" }));
    fireEvent.click(screen.getByRole("button", { name: "削除する" }));
    expect(onDelete).toHaveBeenCalledOnce();
  });
});
