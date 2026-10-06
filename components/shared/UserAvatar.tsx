import { fallbackAvatar } from "@/lib/avatar-fallback";

interface UserAvatarProps {
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  avatarUrl?: string;
  gender?: "male" | "female" | string | null;
  userId?: string | number | null;
  age?: number | string | null;
}

const sizes = {
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-16 w-16",
  xl: "h-32 w-32",
};

export default function UserAvatar({ name, size = "md", avatarUrl, gender, userId, age }: UserAvatarProps) {
  const fallbackSrc = fallbackAvatar(gender, age);
  return (
    <img
      src={avatarUrl || fallbackSrc}
      alt={name || "صورة المستخدم"}
      className={`${sizes[size]} rounded-full border-2 border-white bg-transparent object-cover shadow-sm ring-1 ring-rose-100`}
      onError={(event) => { event.currentTarget.src = fallbackSrc; }}
    />
  );
}
