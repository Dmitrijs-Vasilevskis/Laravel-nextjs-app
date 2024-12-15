"use client";

import styled from "styled-components";
import MessageIconSvg from "@/assets/icons/message-icon.svg";
import { useEffect, useMemo, useState } from "react";
import MiniChatbox from "./MiniChatbox";
import { useGlobalState } from "@/app/context/globalProvider";
import { FriendInterface } from "@/types/User/Firendship";

export default function MiniChat() {
    const { friendList } = useGlobalState();
    const [isOpen, setIsOpen] = useState(false);

    const hasUnreadMessages = useMemo(() => {
        return friendList.some((friend: FriendInterface) => {
            return !!friend.chat?.unreadCount;
        });
    }, [friendList]);

    const handleIsOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <MiniChatStyled>
            <div className={`messenger-frame border ${isOpen ? "show" : ""}`}>
                {isOpen && <MiniChatbox />}
            </div>
            <div onClick={handleIsOpen} className="mini-chat-icon">
                {hasUnreadMessages && <span className="unread"></span>}
                <MessageIconSvg width={24} height={24} />
            </div>
        </MiniChatStyled>
    );
}

const MiniChatStyled = styled.div`
    width: 48px;
    height: 48px;
    z-index: 2147483000;
    position: fixed;
    bottom: 20px;
    right: 20px;

    .mini-chat-icon {
        cursor: pointer;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background-color: #5c16c5;
        display: flex;
        -webkit-box-align: center;
        align-items: center;
        -webkit-box-pack: center;
        justify-content: center;
    }

    .mini-chat-icon:hover {
        scale: 1.1;
    }

    .messenger-frame {
        z-index: 2147483000;
        position: fixed;
        bottom: 84px;
        right: 20px;
        transform-origin: right bottom;
        height: min(704px, 100% - 104px);
        min-height: 80px;
        width: 400px;
        height: 400px;
        background-color: #fff;
        max-height: 704px;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 5px 40px;
        transition: width 200ms, height 200ms, max-height 200ms,
            transform 300ms cubic-bezier(0, 1.2, 1, 1), opacity 83ms ease-out;
        transform: scale(0);
        opacity: 0;
        pointer-events: none;
        visibility: hidden;
    }

    .messenger-frame.show {
        visibility: visible;
        opacity: 1;
        pointer-events: all;
        transform: scale(1);
    }

    .unread {
        background-color: #f00;
        color: #fff;
        border-radius: 50%;
        width: 12px;
        height: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 12px;
        position: absolute;
        transform: translate3d(10px, -10px, 10px);
    }
`;
