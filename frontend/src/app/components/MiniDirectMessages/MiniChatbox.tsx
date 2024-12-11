"use client";

import styled from "styled-components";
import { useGlobalState } from "@/app/context/globalProvider";
import Chatbox from "../DirectMessages/Chatbox";
import { useChat } from "@/app/hooks/chat";

export default function MiniChatbox() {
    const { user, friendList, theme, handleUnreadCount } = useGlobalState();

    if (!user) return;

    const {
        selectedChat,
        messages,
        chatBoxRef,
        setSelectedChat,
        handleSendDirectMessage,
        handleReadMessageRequest,
        handleCloseChatBox,
    } = useChat();

    return (
        <MiniChatBoxStyled theme={theme} className="flex flex-row h-full">
            <ul className="border-r scroll">
                {friendList.map((friend, index) => (
                    <li
                        onClick={() => setSelectedChat(friend)}
                        key={index}
                        className={`friend-list-item list-item ${
                            friend.data.id === selectedChat?.data.id &&
                            "selected"
                        }`}
                    >
                        <div className="user-avatar-container">
                            <img
                                className="user-avatar"
                                src={friend.data.profile_picture_url}
                                alt={`${friend.data.name} profile pic`}
                            />
                        </div>
                    </li>
                ))}
            </ul>
            <div className="flex-1 flex">
                <Chatbox
                    selectedChat={selectedChat}
                    messages={messages}
                    handleReadMessageRequest={handleReadMessageRequest}
                    handleSendDirectMessage={handleSendDirectMessage}
                    chatBoxRef={chatBoxRef}
                    handleCloseChatBox={handleCloseChatBox}
                />
            </div>
        </MiniChatBoxStyled>
    );
}

const MiniChatBoxStyled = styled.div`
    .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }

    .user-avatar-container {
        max-width: 40px;
        max-height: 40px;
        width: 100%;
        height: 100%;
        background-color: #ddd;
        border-radius: 50%;
        margin: 0 10px;
    }

    .friend-list {
        flex: 1 1 0;
    }

    .list-item:hover,
    .selected {
        background-color: ${(props) => props.theme.colorBg};
        transition: all 0.55s ease-in-out;
        box-shadow: inset 0 0 10px ${(props) => props.theme.colorButtonPrimary};
    }

    .friend-list-item {
        padding: 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #eee;

        .user-chat-info {
            font-size: 14px;
            font-weight: 600;

            .chat-latest-message {
                color: #999;
                font-size: 12px;
                font-weight: 400;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                overflow: hidden;
                -webkit-line-clamp: 1;
            }
        }

        .user-chat-notifications {
            margin-left: auto;
            text-align: right;
            justify-items: center;
        }

        .chat-latest-message-time {
            font-size: 12px;
            color: #999;
        }

        .chat-user-unread {
            background-color: #f00;
            color: #fff;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 12px;
        }
    }

    .slide-out-bl {
        -webkit-animation: slide-out-bl 0.5s
            cubic-bezier(0.55, 0.085, 0.68, 0.53) both;
        animation: slide-out-bl 0.5s cubic-bezier(0.55, 0.085, 0.68, 0.53) both;
    }

    @-webkit-keyframes slide-out-bl {
        0% {
            -webkit-transform: translateY(0) translateX(0);
            transform: translateY(0) translateX(0);
            opacity: 1;
        }
        100% {
            -webkit-transform: translateY(1000px) translateX(-1000px);
            transform: translateY(1000px) translateX(-1000px);
            opacity: 0;
        }
    }
    @keyframes slide-out-bl {
        0% {
            -webkit-transform: translateY(0) translateX(0);
            transform: translateY(0) translateX(0);
            opacity: 1;
        }
        100% {
            -webkit-transform: translateY(1000px) translateX(-1000px);
            transform: translateY(1000px) translateX(-1000px);
            opacity: 0;
        }
    }
`;
