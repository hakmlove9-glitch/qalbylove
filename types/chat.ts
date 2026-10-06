export type MessageType =
  | "text"
  | "voice"
  | "image"
  | "file";

export interface ChatMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string | null;
  type?: MessageType;
  voice_url?: string | null;
  file_url?: string | null;
  is_read: boolean;
  created_at: string;
}

export interface ConversationMember {
  id: string;
  username: string;
  avatar_url: string | null;
  is_online: boolean;
  is_premium: boolean;
}

export interface Conversation {
  memberId: string;
  member: ConversationMember;
  lastMessage: string | null;
  lastMessageType?: MessageType;
  created_at: string;
  unread: number;
}

export interface OpenChatDetail {
  memberId: string;
  memberName?: string;
  avatarUrl?: string | null;
}
