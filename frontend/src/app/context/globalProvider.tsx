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
import {
    FriendInterface,
    FriendPendingInterface,
} from "@/types/User/Firendship";
import {
    fetchFriends,
    fetchPendingFriendRequests,
} from "@/services/api/firendship";
import toast from "react-hot-toast";

interface GlobalContextInterface {
    user: UserInterface;
    openAuthModal: boolean;
    handleOpenAuthModal: () => void;
    echo: any;
    theme: any;
    pendingFriendRequests: FriendPendingInterface[];
    setPendingFriendRequests: (requests: FriendPendingInterface[]) => void;
    friendList: FriendInterface[];
    setFriendList: (friendList: FriendInterface[]) => void;
    handleUnreadCount: (messageId: number, senderId: number) => void;
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

    const handleFetchFriends = async () => {
        const { friendList } = await fetchFriends();

        if (friendList) {
            setFriendList(friendList);
        }
    };

    const handleFriendshipNotifications = (type: string, message: string) => {
        switch (type) {
            case "pending":
                toast.success(message);
                break;
            case "accepted":
                toast.success(message);
                break;
            case "declined":
                toast.error(message);
                break;
            default:
                break;
        }
    };

    const handleFetchPending = async () => {
        try {
            const data = await fetchPendingFriendRequests();
            setPendingFriendRequests(data);
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleUnreadCount = (messageId: number, senderId: number) => {
        if (!friendList.length) return;
        setFriendList((prev: FriendInterface[]) =>
            prev.map((friend) => {
                if (friend.data.id === senderId && friend.chatPreview) {
                    return {
                        ...friend,
                        chatPreview: {
                            ...friend.chatPreview,
                            unread:
                                friend.chatPreview.unread > 0
                                    ? friend.chatPreview.unread - 1
                                    : 0,
                        },
                    };
                }
                return friend;
            })
        );
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
                (data: any) => {
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
