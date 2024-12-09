"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { axios } from "@/app/lib/axios";
import { useSearchParams } from "next/navigation";
import { Button, Input, Typography } from "@material-tailwind/react";
import { arrowLeft, arrowRight, plus } from "../../utils/icons";
import styled from "styled-components";
import getVideoId from "get-video-id";
import toast from "react-hot-toast";
import ChatBox from "@/app/components/Chat/ChatBox";
import { useGlobalState } from "@/app/context/globalProvider";
import { useEcho } from "@/app/hooks/echo";
import { LiveChatMessage } from "@/types/VideoSession/LiveChat";

export default function page() {
    const searchParams = useSearchParams();
    const sessionId = useMemo(
        () => searchParams.get("sessionId"),
        [searchParams]
    );

    const [videoId, setVideoId] = useState();
    const [videoIds, setVideoIds] = useState<string[]>([]);

    const [message, setMessage] = useState<string>("");
    const [messages, setMessages] = useState<LiveChatMessage[]>([]);

    const echo = useEcho();
    const { user } = useGlobalState();

    const chatBoxRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<any>(null);
    const prevPlaylistIndex = useRef<number>(0);
    const delayRef = useRef<NodeJS.Timeout | null>(null);

    const [currentState, setCurrentState] = useState<number | null>(null); // Tracks actual player state
    const [finalState, setFinalState] = useState<number | null>(null); // Tracks final player state
    const [addToQueueUrl, setAddToQueueUrl] = useState("");

    const handleVideoIds = (newVideoId: string) => {
        setVideoIds((prevVideoIds) => {
            if (!prevVideoIds.includes(newVideoId)) {
                return [...prevVideoIds, newVideoId];
            }
            return prevVideoIds;
        });
    };

    const handleSendMessage = () => {
        if (message) {
            axios
                .post("api/send-chat-message", {
                    session_id: sessionId,
                    message: message,
                    user_id: user?.id,
                    from: user?.name,
                    chat_name_color: user?.chat_name_color,
                })
                .then(() => {
                    setMessage("");
                });
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key == "Enter") {
            handleSendMessage();
        }
    };

    const fetchMessages = async () => {
        try {
            axios
                .post("api/get-chat-messages", {
                    session_id: sessionId,
                })
                .then((response: any) => {
                    setMessages(response.data.slice(response.data.length - 50));
                });
        } catch (error) {
            console.log(error);
        }
    };

    const joinVideoSession = async () => {
        try {
            const response = await axios.post("api/join-video-session", {
                session_id: sessionId,
            });
            if (response) {
                setVideoId(response.data.video_id);
                handleVideoIds(response.data.video_id);
            }
        } catch (error: any) {
            console.error("Error:", error.message);
        }
    };

    const handlePlayerEvents = (
        state: string,
        seekTo: { seconds: string; allowSeekAhead: boolean }
    ) => {
        switch (state) {
            case "1":
            case "5":
                return playVideo(seekTo.seconds, seekTo.allowSeekAhead);
            case "2":
                return pauseVideo();
            default:
                return;
        }
    };

    const playVideo = (seconds: string, allowSeekAhead: boolean) => {
        const player = playerRef.current;
        const currTime = playerRef.current.getCurrentTime();
        const sec = parseFloat(seconds);

        // Calulate difference to avoid unnesesary updates in player state
        if (Math.abs(sec - currTime) > 3) {
            player.seekTo(sec, true);
        }

        player.playVideo();
    };

    const pauseVideo = () => {
        playerRef.current.pauseVideo();
    };

    const handleAddToQueue = () => {
        const { id, service } = getVideoId(addToQueueUrl);

        if (!id || service !== "youtube") {
            return toast.error("Plase enter valid youtube url");
        }

        axios.post("api/video-sync-add-to-queue", {
            session_id: sessionId,
            video_id: id,
        });
    };

    const handlePlaylistSyncRequest = (currentIndex: number) => {
        const seconds = playerRef.current.getCurrentTime();

        axios.post("api/video-sync-playlist-state", {
            session_id: sessionId,
            current_index: currentIndex,
            seconds: seconds,
        });
    };

    const handlePlaylistSyncEvent = (data: {
        currentIndex: number;
        seconds: number;
        state: string;
    }) => {
        const player = playerRef.current;
        const { currentIndex } = data;

        if (currentIndex > player.getPlaylistIndex()) {
            player.nextVideo();
            prevPlaylistIndex.current = currentIndex;
        } else if (currentIndex < player.getPlaylistIndex()) {
            player.previousVideo();
            prevPlaylistIndex.current = currentIndex;
        }
    };

    const handlePlaylistSwitch = (data: {
        action: string;
        currentIndex: number;
    }) => {
        const player = playerRef.current;
        const playlistIndex = player.getPlaylistIndex();
        const { action, currentIndex } = data;

        if (action == "next" && currentIndex > playlistIndex) {
            player.nextVideo();
            prevPlaylistIndex.current = currentIndex;
        } else if (action == "prev" && currentIndex < playlistIndex) {
            player.previousVideo();
            prevPlaylistIndex.current = currentIndex;
        }
    };

    const handleSaveToClipBoard = () => {
        if (sessionId) navigator.clipboard.writeText(sessionId);
        toast.success("Copied to clipboard");
    };

    const handlePlayerVideoSwitchRequest = (action: string) => {
        const playlistIndex: number = playerRef.current.getPlaylistIndex();

        const currentIndex =
            action === "next" ? playlistIndex + 1 : playlistIndex - 1;

        axios.post("api/video-sync-player-video-switch", {
            session_id: sessionId,
            action: action,
            current_video_index: currentIndex,
        });
    };

    const handlePlayerStateChange = (event: { target: any; data: number }) => {
        const newState = event.data;
        const currentIndex = playerRef.current.getPlaylistIndex(); // Get current index

        if (currentIndex !== prevPlaylistIndex.current) {
            if (currentIndex > prevPlaylistIndex.current) {
                handlePlaylistSyncRequest(currentIndex);
            } else if (currentIndex < prevPlaylistIndex.current) {
                handlePlaylistSyncRequest(currentIndex);
            }

            prevPlaylistIndex.current = currentIndex;
        }

        // Set the real-time state
        setCurrentState(newState);

        // Clear the previous timeout if any
        if (delayRef.current) {
            clearTimeout(delayRef.current);
        }

        // Set a timeout to update the final state if no further updates
        delayRef.current = setTimeout(() => {
            setFinalState(newState);
        }, 500);
        // Delay of 500ms to confirm the final state
    };

    const handleNewMessage = (messageData: LiveChatMessage) => {
        setMessages((prevMessages) => {
            const newMessage = {
                message: messageData.message,
                from: messageData.from,
                chat_name_color: messageData.chat_name_color,
                user_id: messageData.user_id,
            };

            const updatedMessages = [...prevMessages, newMessage];

            // Limit to the last 50 messages
            return updatedMessages.length > 50
                ? updatedMessages.slice(-50)
                : updatedMessages;
        });
    };

    useEffect(() => {
        const initEchoListerners = () => {
            echo.private(`session.${sessionId}`)
                .listen(".chat.message", (data: LiveChatMessage) => {
                    data.message && handleNewMessage(data);
                })
                .listen(
                    ".video.sync",
                    (data: {
                        state: string;
                        seekTo: { seconds: string; allowSeekAhead: boolean };
                    }) => {
                        data && handlePlayerEvents(data.state, data.seekTo);
                    }
                )
                .listen(
                    ".video.sync.add.to.queue",
                    (data: { videoId: string }) => {
                        data.videoId && handleVideoIds(data.videoId);
                    }
                )
                .listen(
                    ".video.sync.playlist.state",
                    (data: {
                        currentIndex: number;
                        seconds: number;
                        state: string;
                    }) => {
                        data.currentIndex && handlePlaylistSyncEvent(data);
                    }
                )
                .listen(
                    ".video.sync.playlist.switch",
                    (data: { action: string; currentIndex: number }) => {
                        data.action && handlePlaylistSwitch(data);
                    }
                )
                .listen(".session.join", (data: { userName: string }) => {
                    data.userName &&
                        toast.success(`${data.userName} joined the session`);
                });
        };

        if (sessionId && echo) {
            joinVideoSession();
            initEchoListerners();
            fetchMessages();
        }

        return () => {
            echo?.leave(`session.${sessionId}`);
        };
    }, [sessionId, echo]);

    useEffect(() => {
        if (echo && sessionId && videoId) {
            const onYouTubeIframeAPIReady = () => {
                /* @ts-ignore */
                playerRef.current = new YT.Player("player", {
                    height: "390",
                    width: "640",
                    videoId: videoIds[0],
                    playerVars: {
                        playlist: videoIds.join(","), // initialize player as a playlist by pass array of ids
                    },
                    events: {
                        onStateChange: handlePlayerStateChange,
                    },
                });
            };

            /* @ts-ignore */
            if (!window.YT) {
                const script = document.createElement("script");
                script.src = "https://www.youtube.com/iframe_api";

                /* @ts-ignore */
                window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
                document.body.appendChild(script);
            } else {
                onYouTubeIframeAPIReady();
            }
        }
    }, [echo, sessionId, videoId]);

    useEffect(() => {
        if (finalState !== null) {
            const time = playerRef.current.getCurrentTime();

            axios.post("api/video-sync-player-state", {
                session_id: sessionId,
                state: finalState,
                time: time,
            });

            setFinalState(null);
        }
    }, [finalState]);

    useEffect(() => {
        if (playerRef.current && videoIds.length > 0) {
            const currentIndex = playerRef.current.getPlaylistIndex();
            const currentTime = playerRef.current.getCurrentTime();

            playerRef.current.cuePlaylist({
                playlist: videoIds,
                index: currentIndex !== -1 ? currentIndex : 0,
                startSeconds: currentTime,
            });

            toast.success("Playlist updated");
        }
    }, [videoIds]);

    return (
        <Styled className="mx-5 main-container">
            <div className="container-header">
                <div className="container-hedaer-actions">
                    {sessionId && (
                        <div className="header-utils">
                            <div className="header-utils-item">
                                <div>
                                    <button
                                        className="utils-btn"
                                        value={"prev"}
                                        onClick={() =>
                                            handlePlayerVideoSwitchRequest(
                                                "prev"
                                            )
                                        }
                                    >
                                        {arrowLeft}
                                        <Typography>Previous Video</Typography>
                                    </button>
                                </div>
                            </div>
                            <div className="header-utils-item">
                                <Typography>
                                    Click and share with friends:
                                </Typography>
                                <Input
                                    readOnly
                                    label="Session ID"
                                    type="text"
                                    name="session-clipboard"
                                    id="session-clipboard"
                                    value={sessionId}
                                    crossOrigin={"anonymous"}
                                    className="!cursor-pointer"
                                    onClick={handleSaveToClipBoard}
                                />
                            </div>
                            <div className="header-utils-item">
                                <button
                                    className="utils-btn"
                                    value={"next"}
                                    onClick={() =>
                                        handlePlayerVideoSwitchRequest("next")
                                    }
                                >
                                    <Typography>Next Video</Typography>
                                    {arrowRight}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="main-content">
                <div className="player-container">
                    <div id="player"></div>
                </div>
                <div className="chat-box-container">
                    <ChatBox
                        message={message}
                        setMessage={setMessage}
                        messages={messages}
                        handleSendMessage={handleSendMessage}
                        handleKeyDown={handleKeyDown}
                        chatBoxRef={chatBoxRef}
                    />
                </div>
            </div>
            <div className="actions">
                <div className="video-action">
                    <Input
                        placeholder="Enter youtube video link"
                        id="addToQueue"
                        value={addToQueueUrl}
                        onChange={(e) => setAddToQueueUrl(e.target.value)}
                        label="Add to queue"
                        type="text"
                        crossOrigin={"anonymous"}
                    />
                    <button
                        onClick={() => handleAddToQueue()}
                        className="bg-colorBgButtonPrimary hover:bg-colorBgButtonPrimaryHover control"
                    >
                        {plus}
                    </button>
                </div>
            </div>
        </Styled>
    );
}

const Styled = styled.div`
    flex-direction: column;

    @media (max-width: 1023px) {
        .main-content {
            flex-direction: column;
        }
    }

    @media (min-width: 1023px) {
        .main-content {
            flex-direction: row;
        }
    }

    .main-content {
        display: flex;
        justify-content: center;
        margin-bottom: 1rem;
        width: 100%;
    }

    .container-header {
        margin: 1rem 0;
        display: flex;
        justify-content: center;
        flex-direction: row;
        align-items: center;
        padding: 10px;
        width: 100%;
    }

    .container-hedaer-actions {
        width: 70%;
    }

    .header-utils {
        display: flex;
        flex-direction: row;
        gap: 4px;
        align-items: flex-end;
        width: 100%;
        justify-content: space-between;
    }

    .utils-btn {
        padding: 0.5rem 1.5rem;
        border: 1px solid;
        border-radius: 14px;
        background: #202225;

        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .player-container {
        border: 1px solid #202225;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        max-width: 860px;
    }

    .video-action {
        display: flex;
        flex-direction: row;
    }

    .actions {
        display: flex;
        flex-direction: row;
        justify-content: center;

        input {
            background-color: #2f3136;
            border: 2px solid rgb(239, 239, 241);
            border-radius: 14px 0 0 14px;
            padding-left: 0.75rem;
        }

        .control {
            padding: 0 0.75rem;
            height: 100%;
            border-radius: 0 14px 14px 0;
        }
    }
`;
