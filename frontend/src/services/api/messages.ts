import { axios } from "@/app/lib/axios"

/**
 * Marks a direct message as read.
 *
 * @param {number} message_id
 * @param {number} sender_id
 */
export const sendReadMessageRequest = async (message_id: number, sender_id: number) => {
    try {
        const response = await axios.post("api/read-direct-message", {
            message_id: message_id,
            sender_id: sender_id,
        });

        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to mark message as read");
    }
}