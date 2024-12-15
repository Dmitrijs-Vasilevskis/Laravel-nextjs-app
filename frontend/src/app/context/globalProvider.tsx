"use client";

import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    ReactNode,
} from "react";
import { useEcho } from "@/app/hooks/echo";
import { useAuth } from "@/app/hooks/auth";
import themes from "@/app/context/themes";
import { UserInterface } from "@/types/User/User";
import { DirectMessageInterface } from "@/types/DirectMessage/DirectMessage";
import {
    FriendInterface,
    FriendPendingInterface,
} from "@/types/User/Firendship";
import {
    fetchFriends,
    fetchPendingFriendRequests,
} from "@/services/api/firendship";
import toast from "react-hot-toast";
import Echo from "laravel-echo";

interface GlobalContextInterface {
    user: UserInterface;
    openAuthModal: boolean;
    handleOpenAuthModal: () => void;
    echo: Echo | null;
    theme: Record<string, unknown>;
    pendingFriendRequests: FriendPendingInterface[];
    setPendingFriendRequests: (requests: FriendPendingInterface[]) => void;
    friendList: FriendInterface[];
    setFriendList: (friendList: FriendInterface[]) => void;
    handleUnreadCount: (messageId: number, senderId: number) => void;
    handleFetchFriends: () => void;
    handleFetchPending: () => void;
}

export const GlobalContext = createContext<GlobalContextInterface | undefined>(
    undefined
);
export const GlobalUpdateContext = createContext<undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
    const echo = useEcho();
    const { user, isLoggedIn } = useAuth();

    const [selectedTheme, setSelectedTheme] = useState(0);
    const theme = themes[selectedTheme];

    const [pendingFriendRequests, setPendingFriendRequests] = useState<
        FriendPendingInterface[]
    >([]);
    const [friendList, setFriendList] = useState<FriendInterface[]>([]);

    const [openAuthModal, setOpenAuthModal] = useState(false);
    const handleOpenAuthModal = () => setOpenAuthModal((cur) => !cur);

    const handleFetchFriends = () => fetchFriendList(setFriendList);
    const handleFetchPending = () => fetchPendingRequests(setPendingFriendRequests);

    const fetchFriendList = async (setFriendList: Function) => {
        const { friendList } = await fetchFriends();
        setFriendList(friendList || []);
    };

    const fetchPendingRequests = async (setPendingFriendRequests: Function) => {
        try {
            const data = await fetchPendingFriendRequests();
            setPendingFriendRequests(data);
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleFriendshipEvent = (type: string, message: string) => {
        handleFetchPending();
        handleFetchFriends();
        type === "declined" ? toast.error(message) : toast.success(message);
    };

    const handleFriendshipNotifications = (type: string, message: string) => {
        switch (type) {
            case "pending":
                handleFriendshipEvent(type, message);
                break;
            case "accepted":
                handleFriendshipEvent(type, message);
                break;
            case "declined":
                handleFriendshipEvent(type, message);
                break;
            default:
                break;
        }
    };

    const updateUnreadCount = (
        friendId: number,
        increment: boolean,
        latestMessage?: string
    ) => {
        setFriendList((prev) =>
            prev.map((friend) => {
                if (friend.data.id === friendId && friend.chat) {
                    return {
                        ...friend,
                        chat: {
                            ...friend.chat,
                            unreadCount: increment
                                ? friend.chat.unreadCount + 1
                                : Math.max(friend.chat.unreadCount - 1, 0),
                            latestMessage: latestMessage || friend.chat.latestMessage,
                        },
                    };
                }
                return friend;
            })
        );
    };

    const handleDirectMessageReceiveEvent = (
        message: DirectMessageInterface,
        senderId: number
    ) => {
        updateUnreadCount(senderId, true, message.message);
    };

    const handleUnreadCount = (messageId: number, senderId: number) => {
        updateUnreadCount(senderId, false);
    };

    useEffect(() => {
        if (user) {
            handleFetchFriends();
            handleFetchPending();
        }
    }, [user]);

    useEffect(() => {
        if (echo && user) {
            echo.private(`notifications.${user?.id}`).listen(
                ".friendship.request",
                (data: { notificationType: string; message: string }) => {
                    data.notificationType &&
                        handleFriendshipNotifications(
                            data.notificationType,
                            data.message
                        );
                }
            );
        }

        return () => {
            echo?.leave(`notifications.${user?.id}`);
        };
    }, [echo, user]);

    useEffect(() => {
        if (echo && friendList) {
            echo.private(`direct-message.${user?.id}`).listen(
                ".direct-message.message",
                (data: {
                    message: DirectMessageInterface;
                    sender_id: number;
                }) => {
                    data.message &&
                        handleDirectMessageReceiveEvent(
                            data.message,
                            data.sender_id
                        );
                }
            );
        }

        return () => {
            echo?.leave(`direct-message.${user?.id}`);
        };
    }, [echo, friendList]);

    return (
        <GlobalContext.Provider
            value={{
                user,
                openAuthModal,
                handleOpenAuthModal,
                echo,
                theme,
                pendingFriendRequests,
                setPendingFriendRequests,
                friendList,
                setFriendList,
                handleUnreadCount,
                handleFetchFriends,
                handleFetchPending,
            }}
        >
            <GlobalUpdateContext.Provider value={undefined}>
                {children}
            </GlobalUpdateContext.Provider>
        </GlobalContext.Provider>
    );
};

export const useGlobalState = () => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error(
            "useGlobalContext must be used within a GlobalProvider"
        );
    }
    return context;
};

export const useGlobalUpdateState = () => useContext(GlobalUpdateContext);
