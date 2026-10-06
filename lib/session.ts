const encoder = new TextEncoder();

function getSecret() {
  const secret = process.env.QALBYLOVE_SESSION_SECRET;
  if (!secret || secret.length < 32) return null;
  return secret;
}

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, char => char.charCodeAt(0));
}

async function importKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function createSessionSignature(memberId: string) {
  const secret = getSecret();
  if (!secret) throw new Error("QALBYLOVE_SESSION_SECRET must be at least 32 characters");
  const key = await importKey(secret);
  const signature = new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(memberId)));
  return bytesToBase64Url(signature);
}

export async function verifySession(memberId: string | null | undefined, signature: string | null | undefined) {
  if (!memberId || !signature || !/^[0-9a-fA-F-]{20,64}$/.test(memberId)) return false;
  const secret = getSecret();
  if (!secret) return false;
  try {
    const key = await importKey(secret);
    return await crypto.subtle.verify("HMAC", key, base64UrlToBytes(signature), encoder.encode(memberId));
  } catch {
    return false;
  }
}
