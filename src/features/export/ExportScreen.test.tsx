// @vitest-environment happy-dom
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { ExportScreen } from "./ExportScreen.js";
describe("ExportScreen (O43 価格透明性)", () => {
  it("金額+対価を CTA より前に明示", () => {
    render(<ExportScreen priceJpy={200} onCheckout={() => {}} />);
    const price = screen.getByTestId("price");
    const cta = screen.getByRole("button", { name: "購入して書き出す" });
    expect(price).toHaveTextContent("200円で 1 作品");
    // DOM 順序: 価格が CTA より前
    expect(price.compareDocumentPosition(cta) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
  it("購入で onCheckout", () => {
    const cb = vi.fn();
    render(<ExportScreen priceJpy={200} onCheckout={cb} />);
    fireEvent.click(screen.getByRole("button", { name: "購入して書き出す" }));
    expect(cb).toHaveBeenCalledOnce();
  });
});
