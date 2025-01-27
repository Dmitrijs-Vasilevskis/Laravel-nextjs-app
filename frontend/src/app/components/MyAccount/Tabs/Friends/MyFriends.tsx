"use client";

import { useGlobalState } from "@/app/context/globalProvider";
import { useEffect } from "react";
import styled from "styled-components";
import {
    acceptFriendRequest,
    declineFriendRequest,
} from "@/services/api/firendship";
import Chatbox from "@/app/components/DirectMessages/Chatbox";
import FriendBar from "@/app/components/DirectMessages/FriendBar";
import { useEcho } from "@/app/hooks/echo";
import { DirectMessageInterface } from "@/types/DirectMessage/DirectMessage";
import { useChat } from "@/app/hooks/chat";
import toast from 'react-hot-toast';

export default function MyFriends() {
    const {
        user,
        pendingFriendRequests,
        friendList,
        setFriendList,
        handleUnreadCount,
        handleFetchPending,
        handleFetchFriends,
    } = useGlobalState();
    const echo = useEcho();

    const {
        selectedChat,
        messages,
        chatBoxRef,
        setSelectedChat,
        handleSendDirectMessage,
        handleReadMessageRequest,
        handleCloseChatBox,
        setMessages,
    } = useChat();

    const handlePendingAccept = async (sender_id: number) => {
        acceptFriendRequest(sender_id).then(() => {
            handleFetchPending();
            handleFetchFriends();
        }).catch((error: any) => {
            toast.error(error.message);
        });
    };

    const handlePendingDecline = async (sender_id: number) => {
        declineFriendRequest(sender_id).then(() => {
            handleFetchPending();
            handleFetchFriends();
        }).catch((error: any) => {
            toast.error(error.message);
        });
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

    const handleReadMessage = (messageId: number, senderId: number) => {
        handleIsMessageRead(messageId);
    };

    const handleReadMessageEvent = async (
        messageId: number,
        senderId: number
    ) => {
        handleReadMessageRequest(messageId, senderId).then(() => {
            handleUnreadCount(messageId, senderId);
        });
    };

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

    return (
        <MyFriendsStyled className="main-content">
            {/* Sidebar */}
            <FriendBar
                friends={friendList}
                pending={pendingFriendRequests}
                handleSelectedChat={setSelectedChat}
                handlePendingAccept={handlePendingAccept}
                handlePendingDecline={handlePendingDecline}
                selectedChat={selectedChat}
            />
            {/* Chat Content */}
            <Chatbox
                selectedChat={selectedChat}
                messages={messages}
                handleReadMessageRequest={handleReadMessageEvent}
                handleSendDirectMessage={handleSendDirectMessage}
                chatBoxRef={chatBoxRef}
                handleCloseChatBox={handleCloseChatBox}
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
