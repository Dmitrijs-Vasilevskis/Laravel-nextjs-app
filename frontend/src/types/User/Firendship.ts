import { UserInterface } from "./User";

export interface FriendInterface {
    data: UserInterface
    chatPreview?: FriendChatPreviewInterface
}

export interface FriendChatPreviewInterface {
    latestMessage: string;
    sentTime: string;
    unread: number;
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