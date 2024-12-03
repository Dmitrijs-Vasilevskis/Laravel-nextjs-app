
export interface LiveChatMessage {
    user_id: number;
    from: string;
    message: string;
    chat_name_color: string;
    created_at?: string;
}