// @vitest-environment happy-dom
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { GalleryScreen } from "./GalleryScreen.js";

describe("GalleryScreen", () => {
  it("空状態のやさしい誘導", () => {
    render(<GalleryScreen comics={[]} onOpen={() => {}} />);
    expect(screen.getByText(/まだ道草がありません/)).toBeInTheDocument();
  });
  it("作品一覧 + タップで開く", () => {
    const onOpen = vi.fn();
    render(<GalleryScreen comics={[{ id: "c1", title: "塀の上の猫", area: "関東・甲信越", createdAt: "" }]} onOpen={onOpen} />);
    fireEvent.click(screen.getByRole("button", { name: /塀の上の猫/ }));
    expect(onOpen).toHaveBeenCalledWith("c1");
  });
});
