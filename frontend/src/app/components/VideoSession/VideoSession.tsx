"use client";

import React, { useState } from "react";
import { Button, Input } from "@material-tailwind/react";
import toast from "react-hot-toast";
import { axios } from "@/app/lib/axios";
import { useAuth } from "@/app/hooks/auth";
import getVideoId from "get-video-id";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { useGlobalState } from "@/app/context/globalProvider";
import {
    initVideoSession,
    joinVideoSession,
} from "@/services/api/videoSession";

export default function VideoSession() {
    const [videoUrl, setVideoUrl] = useState<string>("");
    const [sessionId, setSessionId] = useState<string>("");
    const { user } = useGlobalState();
    const router = useRouter();

    const handleCreateSession = async (e: any) => {
        e.preventDefault();

        const { id, service } = getVideoId(videoUrl);

        if (service !== "youtube") {
            toast.error("Only youtube videos are allowed");
            return;
        }

        if (!id) {
            toast.error("Video Url is required");
            return;
        }

        try {
            const { token, session_id } = await initVideoSession({
                host_id: user?.id,
                video_id: id,
            });

            router.push(`watch/${token}?sessionId=${session_id}`);
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleJoinSession = async (e: any) => {
        e.preventDefault();

        if (!sessionId) {
            toast.error("Session Id is required");
            return;
        }

        try {
            const { token } = await joinVideoSession({
                session_id: sessionId,
            });

            router.push(`watch/${token}?sessionId=${sessionId}`);
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <VideoSessionStyled className="container">
            <div className="container">
                <div className="action">
                    <div className="action-header">
                        <h3>Create a video session</h3>
                    </div>
                    <div className="action-content">
                        <Input
                            label="Video URL"
                            className="action-input"
                            placeholder="Youtube Video Link"
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            id="video-url"
                            type="text"
                            crossOrigin={"anonymous"}
                            minLength={5}
                        />
                        <button
                            className="btn-primary"
                            onClick={handleCreateSession}
                        >
                            Start
                        </button>
                    </div>
                </div>
                <div className="action">
                    <div className="action-header">
                        <h3>Or join existing with an ID</h3>
                    </div>
                    <div className="action-content">
                        <Input
                            label="Session ID"
                            className="action-input"
                            placeholder="Enter Session ID"
                            value={sessionId}
                            onChange={(e) => setSessionId(e.target.value)}
                            id="session-id"
                            type="text"
                            crossOrigin={"anonymous"}
                            minLength={5}
                        />
                        <button
                            className="btn-primary"
                            onClick={handleJoinSession}
                        >
                            Join
                        </button>
                    </div>
                </div>
            </div>
        </VideoSessionStyled>
    );
}

const VideoSessionStyled = styled.div`
  .action {
    display: flex;
    flex-direction: column;
  }

  .action-header {
    display: flex;
    margin-top: 1rem;
    margin-bottom: .5rem;
    justify-content: center;
  }

  .action-content {
    display: flex;
    flex-direction: row;

    button {
      width: 100%;
      padding: 0 0.75rem;
      border-radius: 0 14px 14px 0;
      background-color: #5c16c5;
    }

    .action-input {
      border-radius: 14px 0 0 14px;
    }

    button:hover {
      background-color: #772ce8;
    }
  }
`;
