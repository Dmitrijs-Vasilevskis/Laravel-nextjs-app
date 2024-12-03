"use client";

import { useGlobalState } from "@/app/context/globalProvider";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { axios } from "@/app/lib/axios";
import {
    acceptFriendRequest,
    declineFriendRequest,
    fetchFriends,
} from "@/services/api/firendship";
import Chatbox from "@/app/components/DirectMessages/Chatbox";
import FriendBar from "@/app/components/DirectMessages/FriendBar";
import { useEcho } from "@/app/hooks/echo";
import {
    FriendInterface,
    FriendPendingInterface,
} from "@/types/User/Firendship";
import { DirectMessageInterface } from "@/types/DirectMessage/DirectMessage";
import { sendReadMessageRequest } from "@/services/api/messages";

export default function MyFriends() {
    const {
        user,
        pendingFriendRequests,
        friendList,
        setFriendList,
        handleUnreadCount,
    } = useGlobalState();
    const echo = useEcho();

    const [selectedChat, setSelectedChat] = useState<FriendInterface | null>(
        null
    );
    const [messages, setMessages] = useState<DirectMessageInterface[]>([]);
    const chatBoxRef = useRef<HTMLDivElement>(null);
    const [page, setPage] = useState<number>(1);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const fetchMessages = () => {
        if (!selectedChat || !chatBoxRef.current) return;

        setLoadingMore(true);

        // Save the current scroll height before loading new messages
        const chatBox = chatBoxRef.current;
        const previousScrollHeight = chatBox.scrollHeight;
        const previousScrollTop = chatBox.scrollTop;

        axios
            .post("api/get-direct-messages", {
                friend_id: selectedChat.data.id,
                page: page,
                limit: 40,
            })
            .then((response: { data: DirectMessageInterface[] }) => {
                if (response.data.length < 40) {
                    setHasMore(false); // No more messages to load
                }

                const newMessages = response.data.reverse();
                setMessages((prev) => [...newMessages, ...prev]);

                setLoadingMore(false);

                // Calculate the new scroll height after appending new messages
                const newScrollHeight = chatBox.scrollHeight;
                
                requestAnimationFrame(() => {
                    const newScrollHeight = chatBox.scrollHeight;
                    chatBox.scrollTop =
                        previousScrollTop +
                        (newScrollHeight - previousScrollHeight);
                });
            })
            .catch((error) => {
                console.error("Error fetching messages:", error);
            });
    };

    /**
     * Handle scroll event of chat box to load older messages.
     *
     * This function is called when the user scrolls in the chat box.
     * It checks if the user is at the top of the chat box and if there are more messages to load.
     * If both conditions are true, it increments the page number by 1.
     */
    const handleScroll = () => {
        if (
            chatBoxRef.current &&
            chatBoxRef.current.scrollTop === 0 &&
            hasMore &&
            !loadingMore
        ) {
            setPage((prevPage) => prevPage + 1); // Increment page to load older messages
        }
    };

    const handleSelectedChat = (friend: FriendInterface) => {
        if (!friend) return;
        setSelectedChat(friend);
    };

    const handleSendDirectMessage = (message: string) => {
        if (!selectedChat || !message) return;

        axios
            .post("api/send-direct-message", {
                receiver_id: selectedChat.data.id,
                message: message,
            })
            .then((response: { data: DirectMessageInterface }) => {
                if (response.data) {
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        response.data,
                    ]);
                }
            });
    };

    const handlePendingAccept = async (sender_id: number) => {
        const response = await acceptFriendRequest(sender_id);
    };

    const handlePendingDecline = async (sender_id: number) => {
        const response = await declineFriendRequest(sender_id);
    };

    const handleAddNewMessages = (message: DirectMessageInterface) => {
        setMessages((prev) => [...prev, message]);
    };

    const handleIsMessageRead = (message_id: number) => {
        setMessages((prev) =>
            prev.map((message) => {
                if (message.id === message_id) {
                    return {
                        ...message,
                        is_read: true,
                    };
                }
                return message;
            })
        );
    };

    const handleReadMessageRequest = async (
        messageId: number,
        senderId: number
    ) => {
        if (!messageId && !senderId) return;

        try {
            const { message_id, sender_id } = await sendReadMessageRequest(
                messageId,
                senderId
            );

            if (message_id && sender_id) {
                handleIsMessageRead(message_id);
                handleUnreadCount(message_id, sender_id);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleReadMessage = (messageId: number, senderId: number) => {
        handleIsMessageRead(messageId);
    };

    useEffect(() => {
        if (selectedChat) {
            fetchMessages();
        }
    }, [page]);

    useEffect(() => {
        if (selectedChat) {
            setPage(1);
            setMessages([]);
            fetchMessages();
        }
    }, [selectedChat]);

    useEffect(() => {
        if (echo && selectedChat) {
            echo.private(`direct-message.${user?.id}`)
                .listen(
                    ".direct-message.message",
                    (data: { message: DirectMessageInterface }) => {
                        data.message && handleAddNewMessages(data.message);
                    }
                )
                .listen(
                    ".direct-message.read",
                    (data: { messageId: number; receiverId: number }) => {
                        data.messageId &&
                            handleReadMessage(data.messageId, data.receiverId);
                    }
                );
        }

        return () => {
            echo?.leave(`direct-message.${user?.id}`);
        };
    }, [echo, selectedChat]);

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (chatBoxRef.current) {
                chatBoxRef.current.removeEventListener("scroll", handleScroll);
            }
        };
    }, [chatBoxRef, hasMore, loadingMore]);

    return (
        <MyFriendsStyled className="main-content">
            {/* Sidebar */}
            <FriendBar
                friends={friendList}
                pending={pendingFriendRequests}
                handleSelectedChat={handleSelectedChat}
                handlePendingAccept={handlePendingAccept}
                handlePendingDecline={handlePendingDecline}
                selectedChat={selectedChat}
            />
            {/* Chat Content */}
            <Chatbox
                selectedChat={selectedChat}
                messages={messages}
                setMessages={setMessages}
                handleReadMessageRequest={handleReadMessageRequest}
                handleSendDirectMessage={handleSendDirectMessage}
                chatBoxRef={chatBoxRef}
            />
        </MyFriendsStyled>
    );
}

const MyFriendsStyled = styled.div`
    display: flex;
    height: 100%;
    background-color: #f5f5f5;
    border: 1px solid;
`;
