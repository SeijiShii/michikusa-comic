import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AccountAuth } from "./AccountAuth.js";

describe("AccountAuth (O22(B)/(E) 動線)", () => {
  it("ゲスト: Google でログインボタンを表示、サインアウトは出さない", () => {
    render(<AccountAuth isAuthed={false} onGoogleLogin={() => {}} onSignOut={() => {}} />);
    expect(screen.getByRole("button", { name: /Google でログイン/ })).toBeTruthy();
    expect(screen.queryByRole("button", { name: /サインアウト/ })).toBeNull();
  });

  it("連携済: サインアウト動線を表示 (両輪、行き止まり防止)", () => {
    render(<AccountAuth isAuthed displayEmail="me@example.com" onGoogleLogin={() => {}} onSignOut={() => {}} />);
    expect(screen.getByRole("button", { name: /サインアウト/ })).toBeTruthy();
    expect(screen.getByText(/me@example.com/)).toBeTruthy();
  });

  it("Google ログイン onClick で onGoogleLogin 呼び出し", async () => {
    const onGoogleLogin = vi.fn();
    render(<AccountAuth isAuthed={false} onGoogleLogin={onGoogleLogin} onSignOut={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: /Google でログイン/ }));
    expect(onGoogleLogin).toHaveBeenCalled();
  });

  it("サインアウト onClick で onSignOut 呼び出し", async () => {
    const onSignOut = vi.fn();
    render(<AccountAuth isAuthed onGoogleLogin={() => {}} onSignOut={onSignOut} />);
    fireEvent.click(screen.getByRole("button", { name: /サインアウト/ }));
    expect(onSignOut).toHaveBeenCalled();
  });
});
