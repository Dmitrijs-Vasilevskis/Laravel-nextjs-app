import { UserInterface } from "./User";

export interface FriendInterface {
    data: UserInterface
    chat?: FriendChatPreviewInterface
}

export interface FriendChatPreviewInterface {
    id: number;
    chatType: string;
    latestMessage: string;
    sentTime: string;
    unreadCount: number;
}

export interface FriendPendingInterface {
    id: number;
    sender_id: number;
    receiver_id: number;
    status: string;
    created_at: string;
    updated_at: string;
    sender: UserInterface
}