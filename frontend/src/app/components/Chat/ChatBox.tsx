"use client";

import { Input, Typography } from "@material-tailwind/react";
import ChatMessage from "./ChatMessage";
import Picker from "emoji-picker-react";
import { useEffect, useState } from "react";
import { emoji } from "@/app/utils/icons";
import styled from "styled-components";

interface Props {
  messages: { message: string; from: string, chat_name_color: string }[];
  handleSendMessage: (message: string) => void;
  handleKeyDown: (e: any) => void;
  chatBoxRef: React.RefObject<HTMLDivElement>;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
}

export default function ChatBox({
  messages,
  handleSendMessage,
  handleKeyDown,
  chatBoxRef,
  message,
  setMessage,
}: Props) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiClick = (emojiObject: any) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const styles: React.CSSProperties = { maxHeight: "350px" };

  return (
    <ChatBoxStyled className="chat-container">
      <div className="chat-header">
        <Typography variant="h4" className="uppercase text-base">Live Chat</Typography>
      </div>
      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((data, index) => (
          <ChatMessage
            key={index + data.from}
            message={data.message}
            name={data.from}
            chatNameColor={data.chat_name_color}
            
          />
        ))}
      </div>
      <div className="chat-input-container flex flex-row pb-4 pr-4 pl-4 gap-3">
        {showEmojiPicker && (
          <Picker
            onEmojiClick={handleEmojiClick}
            previewConfig={{ showPreview: false, defaultCaption: "" }}
            className="emoji-picker"
            width={"90%"}
            style={styles}
          />
        )}
        <div className="chat-input-box">
          <Input
            type="text"
            id="chat-input"
            label="Send a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            crossOrigin={"anonymous"}
            onKeyDown={handleKeyDown}
          />
          <a
            className="chat-input-emoji-picker"
            onClick={(e) => setShowEmojiPicker(!showEmojiPicker)}
          >
            {emoji}
          </a>
        </div>
        <button
          className="bg-colorBgButtonPrimary rounded hover:bg-colorBgButtonPrimaryHover"
          onClick={() => {
            handleSendMessage(message), setShowEmojiPicker(false);
          }}
        >
          <span className="text-sm font-semibold leading-5 flex px-3">
            Chat
          </span>
        </button>
      </div>
    </ChatBoxStyled>
  );
}

const ChatBoxStyled = styled.section`
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 500px;
  background-color: rgb(24, 24, 27);
  border-radius: 0 14px 14px 0;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);

  .chat-header {
    background-color: #18181b;
    height: 3rem;
    padding-left: 10px;
    padding-right: 10px;
    border-bottom: 1px solid #53535f7a;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .chat-box {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }

  .chat-input-container {
    position: relative;
  }

  .emoji-picker {
    position: absolute;
    padding-bottom: 1rem;
    bottom: 60px;
  }

  .message {
    margin-bottom: 10px;
    color: #fff;
    display: flex;
    flex-direction: row;
    overflow-wrap: anywhere;
  }

  .username {
    font-weight: bold;
    color: #3ba55d;
    margin-right: 5px;
  }

  .text {
    word-break: break-word;
    color: #fff;
  }

  .chat-input {
    display: flex;
    background-color: #18181b;
    padding: 10px;
    border-top: 1px solid #2f3136;
  }

  .chat-input input {
    flex: 1;
    background-color: #40444b;
    border: none;
    padding: 10px;
    border-radius: 5px;
    color: #fff;
    margin-right: 10px;
    outline: none;
  }

  .chat-input-box {
    position: relative;
  }

  .chat-input-emoji-picker {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    cursor: pointer;
  }

  .chat-input input::placeholder {
    color: #b9bbbe;
  }

  .chat-input button {
    background-color: #3ba55d;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    color: #fff;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .chat-input button:hover {
    background-color: #2d8649;
  }

  /* Add custom scrollbar for chat-box */
  .chat-box::-webkit-scrollbar {
    width: 8px;
  }

  .chat-box::-webkit-scrollbar-thumb {
    background-color: #40444b;
    border-radius: 5px;
  }
`;
