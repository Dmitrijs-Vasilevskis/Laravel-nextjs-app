"use client";

import { axios } from "@/app/lib/axios";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { xmarkIcon } from "@/app/utils/icons";
import { useGlobalState } from "@/app/context/globalProvider";
import toast from "react-hot-toast";
import { sendFriendRequest } from "@/services/api/firendship";
import { UserInterface } from "@/types/User/User";
import { fetchUserData } from "@/services/api/user";

interface Props {
    userId: number;
    relativePosition: number | null;
    handleOpenMiniProfile: () => void;
}

export default function ChatBoxMiniUserProfile({
    userId,
    relativePosition,
    handleOpenMiniProfile,
}: Props) {
    const [selectedUser, setSelectedUser] = useState<UserInterface>();
    const { user } = useGlobalState();

    const sendFriendInivite = async () => {
        if (!selectedUser) return;
        try {
            const { message } = await sendFriendRequest(selectedUser?.id);
            toast.success(message);
        } catch (error) {
            toast.error("Failed to send friend request");
        }
    };

    const getSelectedUserData = async (userId: number) => {
        try {
            const userData = await fetchUserData(userId);
            setSelectedUser(userData);
        } catch (error) {
            toast.error("Failed to fetch user data.");
        }
    };

    useMemo(() => {
        if (userId) getSelectedUserData(userId);
    }, [userId]);

    return (
        <ChatBoxMiniUserProfileStyled top={relativePosition}>
            {selectedUser ? (
                <>
                    <div className="mini-profile-header">
                        <div className="mini-profile-image">
                            <img
                                className="h-12 w-12 rounded-full object-cover object-center"
                                src={selectedUser?.profile_picture_url}
                                alt="profile picture preview"
                                width={50}
                                height={50}
                            />
                        </div>
                        <div>
                            <div className="mini-profile-name">
                                <span>{selectedUser?.name}</span>
                            </div>
                        </div>
                        <div
                            onClick={handleOpenMiniProfile}
                            className="action-close"
                        >
                            {xmarkIcon}
                        </div>
                    </div>
                    <div className="mini-profile-actions">
                        {selectedUser.id !== user.id && (
                            <div className="mini-profile-action">
                                <button onClick={sendFriendInivite}>
                                    <span>Add Friend</span>
                                </button>
                            </div>
                        )}
                    </div>
                </>
            ) : null}
        </ChatBoxMiniUserProfileStyled>
    );
}

const ChatBoxMiniUserProfileStyled = styled.div<{ top: number | null }>`
    position: absolute;
    top: ${(props) => props.top}px;
    padding-top: 0.5rem;
    width: 100%;
    background: #f9f9f9;

    .mini-profile-header {
        display: flex;
        flex-direction: row;
        position: relative;
        margin: 0 1rem;
    }

    .action-close {
        position: absolute;
        cursor: pointer;
        top: 0;
        right: 0;
    }
`;
