"use client";

import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Picker, { EmojiClickData } from "emoji-picker-react";
import { emoji } from "@/app/utils/icons";
import { FriendInterface } from "@/types/User/Firendship";
import { DirectMessageInterface } from "@/types/DirectMessage/DirectMessage";
import { useGlobalState } from "@/app/context/globalProvider";
import ChatMessage from "./ChatMessage";

interface Props {
    selectedChat: FriendInterface | null;
    messages: DirectMessageInterface[];
    setMessages: React.Dispatch<React.SetStateAction<DirectMessageInterface[]>>;
    handleReadMessageRequest: (message_id: number, sender_id: number) => void;
    chatBoxRef: React.RefObject<HTMLDivElement>;
    handleSendDirectMessage: (message: string) => void;
}

export default function Chatbox({
    selectedChat,
    messages,
    handleReadMessageRequest,
    setMessages,
    chatBoxRef,
    handleSendDirectMessage,
}: Props) {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [message, setMessage] = useState<string>("");
    const [readSenderMessages, setReadSenderMessages] = useState<
        Set<DirectMessageInterface>
    >(new Set());
    const messageRefs = useRef<(HTMLDivElement | null)[]>([]);
    const hasScrolledToUnread = useRef(false);

    const { user } = useGlobalState();

    const handleEmojiClick = (emojiObject: EmojiClickData) => {
        setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    };

    const scrollToFirstUnreadMessage = () => {
        if (hasScrolledToUnread.current) return;

        const firstUnreadIndex = messages.findIndex(
            (message) => !message.is_read && message.sender_id !== user.id
        );

        if (firstUnreadIndex !== -1 && messageRefs.current[firstUnreadIndex]) {
            messageRefs.current[firstUnreadIndex]?.scrollIntoView({
                behavior: "auto",
                block: "end",
            });
            hasScrolledToUnread.current = true;
        } else {
            scrollToBottom();
        }
    };

    const onSendMessage = () => {
        if (message) {
            handleSendDirectMessage(message);
            setMessage("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key == "Enter") {
            onSendMessage();
        }
    };

    const scrollToBottom = () => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        if (messages) {
            const observer = new IntersectionObserver(
                (entries) => {
                    // Detect visible messages on a chatbox viewport and add to a set,
                    // further action, send request and update message is_read state for a sender
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            const visible = new Set<DirectMessageInterface>();
                            const index = Number(
                                entry.target.getAttribute("data-index")
                            );
                            const visibleMessage = messages[index];

                            if (
                                visibleMessage &&
                                !visibleMessage.is_read &&
                                visibleMessage.sender_id !== user?.id
                            ) {
                                visible.add(visibleMessage);
                                setReadSenderMessages(visible);
                            }
                        }
                    });
                },
                {
                    root: null,
                    threshold: 0.8,
                }
            );

            messageRefs.current.forEach((ref) => {
                if (ref) observer.observe(ref);
            });

            return () => {
                observer.disconnect();
            };
        }
    }, [messages]);

    useEffect(() => {
        if (readSenderMessages.size > 0) {
            const { id: message_id, sender_id } = readSenderMessages
                .values()
                .next().value;
            handleReadMessageRequest(message_id, sender_id);
        }
    }, [readSenderMessages]);

    useEffect(() => {
        if (!hasScrolledToUnread.current && messages) {
            // Scroll to the first unread message sent by another user
            scrollToFirstUnreadMessage();
        }
    }, [selectedChat]);

    return (
        <ChatboxStyled>
            {selectedChat ? (
                <div className="chat-container">
                    <div className="chat-header-container">
                        <img
                            className="user-avatar"
                            src={selectedChat.data.profile_picture_url}
                            alt={`${selectedChat.data.name} profile pic`}
                        />
                        <h2 style={{ margin: 0 }}>{selectedChat.data.name}</h2>
                    </div>

                    <div className="messages-wrapper" ref={chatBoxRef}>
                        {messages.map(
                            (message: DirectMessageInterface, index) => (
                                <ChatMessage
                                    key={index}
                                    index={index}
                                    messageRefs={messageRefs}
                                    selectedChat={selectedChat}
                                    message={message}
                                />
                            )
                        )}
                    </div>

                    <div className="chat-actions-wrapper">
                        <div className="chat-input-container">
                            {showEmojiPicker && (
                                <Picker
                                    onEmojiClick={handleEmojiClick}
                                    previewConfig={{
                                        showPreview: false,
                                        defaultCaption: "",
                                    }}
                                    className="emoji-picker"
                                />
                            )}
                            <input
                                className="chat-input"
                                type="text"
                                placeholder="Write a message..."
                                value={message}
                                onKeyDown={(e) => handleKeyDown(e)}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <a
                                className="chat-input-emoji-picker"
                                onClick={(e) =>
                                    setShowEmojiPicker(!showEmojiPicker)
                                }
                            >
                                {emoji}
                            </a>
                        </div>

                        <button
                            onClick={onSendMessage}
                            className="btn-primary input-btn"
                        >
                            <span>Send</span>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="chat-empty">
                    <span className="chat-empty-text">
                        Select a chat to start messaging
                    </span>
                </div>
            )}
        </ChatboxStyled>
    );
}

const ChatboxStyled = styled.section`
    flex: 1 1 0%;
    display: flex;
    flex-direction: column;

    .chat-container {
        flex: 1 1 0%;
        display: flex;
        flex-direction: column;

        .chat-header-container {
            padding: 20px;
            border-bottom: 1px solid #ddd;
            background-color: #ffffff;
            display: flex;
            align-items: center;
            gap: 1rem;

            .user-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
            }
        }

        .messages-wrapper {
            padding: 20px;
            overflow-y: auto;
            display: flex;
            flex: 1;
            flex-direction: column;
            flex-basis: 0;
            gap: 10px;
        }

        .chat-actions-wrapper {
            padding: 20px;
            border-top: 1px solid #ddd;
            background-color: #ffffff;
            display: flex;
            gap: 10px;
            align-items: center;

            .chat-input-container {
                position: relative;
                display: flex;
                flex: 1;
            }

            .chat-input-emoji-picker {
                cursor: pointer;
                position: absolute;
                right: 0;
                transform: translateY(50%);
                margin-right: 1rem;
            }

            .chat-input {
                flex: 1;
                padding: 10px;
                border-radius: 14px;
                border: 1px solid #ddd;
            }

            .input-btn {
                padding: 0.5rem 1rem;
                border-radius: 14px;
                border: none;
                color: #fff;
                cursor: pointer;
            }
        }

        .emoji-picker {
            position: absolute;
            padding-bottom: 1rem;
            transform: translateY(-100%);
            right: 0;
        }
    }

    .chat-empty {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;

        .chat-empty-text {
            background-color: #e7e7e7;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
        }
    }
`;
