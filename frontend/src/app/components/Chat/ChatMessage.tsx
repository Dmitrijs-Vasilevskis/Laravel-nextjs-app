import React from "react";
import styled from "styled-components";

interface Props {
  message: string;
  name: string;
  chatNameColor: string;
}

export default function ChatMessage({ message, name, chatNameColor }: Props) {
  return (
    <ChatLineStyled chatNameColor={chatNameColor} className="chat-line ">
      <span className="chat-message-author">{name}</span>
      <span aria-hidden="true">:</span>
      <span className="chat-line-message-body">
        <span className="text-fragment">{message}</span>
      </span>
    </ChatLineStyled>
  );
}

const ChatLineStyled = styled.div<{ chatNameColor: string }>`
  padding: 0.5rem 1rem;

  .text-fragment {
    word-wrap: break-word;
  }

  .chat-message-author {
    color: ${(props) => props.chatNameColor};
  }
`;
