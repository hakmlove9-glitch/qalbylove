import { fallbackAvatar } from "./avatar-fallback";

export function fallbackAvatarForGender(gender: unknown, seed?: unknown) {
  return fallbackAvatar(gender, seed, { seed });
}

export function primaryMemberImage(
  image: unknown,
  avatarUrl: unknown,
  gender: unknown,
  seed?: unknown,
) {
  const direct = [String(image || "").trim(), String(avatarUrl || "").trim()].find(Boolean);
  return direct || fallbackAvatarForGender(gender, seed);
}
