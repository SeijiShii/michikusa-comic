// ゲストセッション確立の本番経路 (P4.46 ハードゲート、Clerk scaffold パターン)
// 実 Clerk backend は ClerkBackend interface で注入 (release で実 SDK + 実キー)。
// stub ではなく「本番で実セッションが張れる経路の実コード」を表現する。

export interface ClerkBackend {
  // server: 匿名 user を発行
  createAnonymousUser(): Promise<{ id: string }>;
  // server: sign-in token (ticket) を発行 → フロントが signIn.create({strategy:'ticket'}) で確立
  createSignInToken(userId: string): Promise<{ token: string }>;
}

export interface GuestSessionTicket { userId: string; token: string; }

// establishGuestSession — 匿名 user 発行 + sign-in ticket 発行 (本番経路、O22/P4.46)
export async function establishGuestSession(clerk: ClerkBackend): Promise<GuestSessionTicket> {
  const user = await clerk.createAnonymousUser();
  const { token } = await clerk.createSignInToken(user.id);
  return { userId: user.id, token };
}

// フロント側は establishGuestSession の token で signIn.create({strategy:'ticket', ticket: token})
// を実行 → 実セッション確立 → 以降 withOwner 保護 API が authed owner で 200。
// ※ 実 Clerk + 実キーでの「匿名→authed 200」結合検証は /flow:release で実施 (P4.46 DoD)。
