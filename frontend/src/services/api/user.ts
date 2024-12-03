import { axios } from "@/app/lib/axios";
import { UserInterface } from "@/types/User/User";

export const fetchUserData = async (userId: number): Promise<UserInterface> => {
    try {
        const response = await axios.get(`/api/user/${userId}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch user data");
    }
}