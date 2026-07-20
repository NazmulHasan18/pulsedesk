// Minimal, Edge-safe JWT payload decoder. We only need `exp`, never verify
// the signature client-side — the backend already signed it, we just read
// the clock so we know when to refresh.
interface DecodedAccessToken {
  id: string;
  userType: "agent" | "superadmin";
  role?: string;
  companyId?: string;
  tokenVersion?: number;
  iat: number;
  exp: number;
}

export function decodeJwtExp(token: string): number | null {
  try {
    const payload = token.split(".")[1];
    const json = Buffer.from(payload, "base64").toString("utf8");
    const parsed = JSON.parse(json) as DecodedAccessToken;
    return parsed.exp * 1000; // ms
  } catch {
    return null;
  }
}
