
export interface DirectMessageInterface {
    id: number;
    message: string;
    is_read: boolean;
    receiver_id: number;
    sender_id: number;
    created_at: string;
    chat_id: number;
}