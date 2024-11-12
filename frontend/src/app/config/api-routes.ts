export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:80"

export const WEB_SOCKET = {
    INIT_VIDEO_SESSION: `api/init-video-session`,
    JOIN_VIDEO_SESSION: `api/api/join-video-session`,
    VIDEO_SYNC_STATE: `api/video-sync-player-state`,
    VIDEO_SYNC_PLAYLIST_STATE: `api/video-sync-playlist-state`,
    VIDEO_SYNC_ADD_TO_QUEUE: `api/video-sync-add-to-queue`,
    VIDEO_SYNC_PLAYER_VIDEO_SWITCH: `api/video-sync-player-video-switch`,
    GET_CHAT_MESSAGES: `api/get-chat-messages`,
    SEND_CHAT_MESSAGE: `api/send-chat-message`,

}