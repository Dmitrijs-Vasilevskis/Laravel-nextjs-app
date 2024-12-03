import { axios } from "@/app/lib/axios"
import { FriendInterface, FriendPendingInterface } from "@/types/User/Firendship";

export const fetchFriends = async () => {
    try {
        const response = await axios.get("/api/fetch-friends");

        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch friend list");
    }
};

export const sendFriendRequest = async (receiver_id: number): Promise<{message: string}> => {
    try {
        const response = await axios.post("/api/friend-request/send", {
            receiver_id: receiver_id
        });

        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to send friend request");
    }
};

export const acceptFriendRequest = async (sender_id: number): Promise<FriendPendingInterface> => {
    try {
        const response = await axios.post("/api/friend-requests/accept", {
            sender_id: sender_id,
        });

        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to accept friend request");
    }
};

export const declineFriendRequest = async (sender_id: number): Promise<FriendPendingInterface> => {
    try {
        const response = await axios.post("/api/friend-requests/decline", {
            sender_id: sender_id,
        });

        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to decline friend request");
    }
};

export const fetchPendingFriendRequests = async (): Promise<FriendPendingInterface[]> => {
    try {
        const response = await axios.get("/api/friend-requests/pending");

        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch pending friend requests");
    }
};
