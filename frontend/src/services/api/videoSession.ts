import { axios } from "@/app/lib/axios"
import {
    DeleteVideoSessionParams,
    GetActiveVideoSessionParams,
    InitVideoSessionParams,
    VideoSessionInterface
} from "@/types/VideoSession/VideoSession";

export const initVideoSession = async (params: InitVideoSessionParams): Promise<VideoSessionInterface> => {
    try {
        const response = await axios.post("/api/init-video-session", params);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to initialize video session");
    }
}

export const joinVideoSession = async (params: { session_id: string }): Promise<VideoSessionInterface> => {
    try {
        const response = await axios.post("/api/join-video-session", params);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to initialize video session");
    }
}


export const deleteVideoSession = async (params: DeleteVideoSessionParams): Promise<{ message: string, status: number }> => {
    try {
        const response = await axios.post("/api/delete-video-session", params);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to initialize video session");
    }
}

export const getActiveVideoSessions = async (params: GetActiveVideoSessionParams): Promise<VideoSessionInterface[]> => {
    try {
        const response = await axios.get("/api/get-active-sessions", { params });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to initialize video session");
    }
}

export const getVideoSessionChatMessages = async (params: { sessionId: string }) => {
    try {
        const response = await axios.post("api/get-chat-messages", params);
    } catch (error) {

    }
}