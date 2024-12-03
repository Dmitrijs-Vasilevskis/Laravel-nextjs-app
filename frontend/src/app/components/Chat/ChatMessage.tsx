import { user } from "@/app/utils/icons";
import React, { createRef, useRef } from "react";
import styled from "styled-components";

interface Props {
    message: string;
    name: string;
    chatNameColor: string;
    userId: number;
    handleMiniProfileClick: (e:any, userId: number) => void;
}

export default function ChatMessage({
    message,
    name,
    chatNameColor,
    userId,
    handleMiniProfileClick,
}: Props) {
    const ref = useRef(null);

    return (
        <ChatLineStyled ref={ref}>
            <div className="chat-line chat-line-highlight">
                <div
                    className="chat-message-author"
                    style={{ color: chatNameColor }}
                    onClick={(e) => handleMiniProfileClick(e, userId)}
                >
                    <span>{name}</span>
                </div>
                <span aria-hidden="true">:</span>
                <span className="chat-line-message-body">
                    <span className="text-fragment">{message}</span>
                </span>
            </div>
        </ChatLineStyled>
    );
}

const ChatLineStyled = styled.div`
    padding: 0 0.5rem;

    .text-fragment {
        word-wrap: break-word;
    }

    .chat-message-author {
        display: inline;
        cursor: pointer;
    }

    .chat-message-author:hover {
        background-color: rgba(255, 255, 255, 0.16);
    }

    .chat-line {
        border-radius: 0.4rem;
        padding: 0.5rem 1rem;
    }

    .chat-line:hover {
        background-color: rgba(255, 255, 255, 0.16);
    }
`;
