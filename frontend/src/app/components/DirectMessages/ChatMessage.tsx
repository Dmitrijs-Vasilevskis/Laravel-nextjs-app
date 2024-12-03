"use client";

import { formatTimeHourMinutes } from "@/app/utils/formatTime";
import { DirectMessageInterface } from "@/types/DirectMessage/DirectMessage";
import { FriendInterface } from "@/types/User/Firendship";
import React from "react";
import { checkIcon, doubleCheckIcon } from "@/app/utils/icons";
import styled from "styled-components";

interface chatMessageInterface {
    message: DirectMessageInterface;
    selectedChat: FriendInterface;
    messageRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
    index: number;
}

export default function ChatMessage({
    message,
    selectedChat,
    messageRefs,
    index,
}: chatMessageInterface) {
    return (
        <ChatMessageStyled
            className="chat-message-container"
            data-index={index}
            ref={(el) => {
                messageRefs.current[index] = el;
            }}
        >
            <div
                className={`chat-message ${
                    message.sender_id === selectedChat.data.id
                        ? "left"
                        : "right"
                }`}
            >
                <div className="message-content">
                    <p className="message">{message.message}</p>
                    <div className="time-inner">
                        <span className="time">
                            {formatTimeHourMinutes(message.created_at)}
                        </span>
                        {message.sender_id !== selectedChat.data.id && (
                            <span className="check">
                                {message.is_read ? doubleCheckIcon : checkIcon}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </ChatMessageStyled>
    );
}

const ChatMessageStyled = styled.div`
    width: 100%;

    .chat-message {
        display: flex;
    }

    .message-content {
        padding: 0.5rem 1rem;
        max-width: 60%;
        display: flex;
        justify-content: space-between;
        gap: 12px;

        .time-inner {
            gap: 4px;
            display: flex;
            flex-direction: row;
            align-items: flex-end;
            font-size: 12px;
        }

        .message {
            line-break: anywhere;
        }
    }

    .left {
        justify-content: left;

        .message-content {
            border-radius: 14px 14px 14px 0;
            background-color: #e7e7e7;
        }
    }

    .right {
        justify-content: right;

        .message-content {
            border-radius: 14px 14px 0 14px;
            background-color: #6e00ff;
        }
    }
`;
