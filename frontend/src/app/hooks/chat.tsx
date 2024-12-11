import { useEffect, useRef, useState } from "react";
import { FriendInterface } from "@/types/User/Firendship";
import { DirectMessageInterface } from "@/types/DirectMessage/DirectMessage";
import { axios } from "../lib/axios";
import { sendReadMessageRequest } from "@/services/api/messages";

export const useChat = () => {
    const [messages, setMessages] = useState<DirectMessageInterface[]>([]);
    const [selectedChat, setSelectedChat] = useState<FriendInterface | null>(
        null
    );
    const chatBoxRef = useRef<HTMLDivElement>(null);
    const [page, setPage] = useState<number>(1);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const handleCloseChatBox = () => {
        setSelectedChat(null);
        setMessages([]);
        setPage(1);
    };

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

    const handleScroll = () => {
        if (
            chatBoxRef.current &&
            chatBoxRef.current.scrollTop === 0 &&
            hasMore &&
            !loadingMore
        ) {
            setPage((prevPage) => prevPage + 1);
        }
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
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (selectedChat) {
            setMessages([]);
            setPage(1);
            fetchMessages();
        }
    }, [selectedChat]);

    useEffect(() => {
        fetchMessages();
    }, [page]);

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.addEventListener("scroll", handleScroll);
        }
        return () => {
            if (chatBoxRef.current) {
                chatBoxRef.current.removeEventListener("scroll", handleScroll);
            }
        };
    }, [hasMore, loadingMore]);

    return {
        selectedChat,
        messages,
        chatBoxRef,
        setSelectedChat,
        handleSendDirectMessage,
        handleReadMessageRequest,
        handleCloseChatBox,
        setMessages
    };
};
