"use client";

import {  useMemo, useState } from "react";
import { useGlobalState } from "@/app/context/globalProvider";
import styled from "styled-components";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Typography, Input, Dialog } from "@material-tailwind/react";
import { addIcon } from "@/app/utils/icons";
import getVideoId from "get-video-id";
import {
    deleteVideoSession,
    getActiveVideoSessions,
    initVideoSession,
    joinVideoSession,
} from "@/services/api/videoSession";
import { VideoSessionInterface } from "@/types/VideoSession/VideoSession";

export default function MySessions() {
    const { user } = useGlobalState();
    const router = useRouter();
    const [sessions, setSessions] = useState<VideoSessionInterface[]>();
    const [openModal, setOpenModal] = useState(false);
    const [videoUrl, setVideoUrl] = useState("");

    const handleOpenModal = () => {
        setOpenModal(!openModal);
    };

    const handleUserSessions = async () => {
        const response: VideoSessionInterface[] = await getActiveVideoSessions({
            host_id: user.id,
            status: "true",
        });

        if (response) {
            setSessions(response);
        }
    };

    const handleJoinSession = async (sessionId: string) => {
        try {
            const { token } = await joinVideoSession({
                session_id: sessionId,
            });

            router.push(`watch/${token}?sessionId=${sessionId}`);
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleCreateSession = async (e: any) => {
        const { id, service } = getVideoId(videoUrl);

        if (service !== "youtube" || !id) {
            toast.error("Please enter valid video link");
            return;
        }

        try {
            const { token, session_id } = await initVideoSession({
                host_id: user?.id,
                video_id: id,
            });

            if (token && session_id) {
                handleUserSessions();
                handleOpenModal();
                setVideoUrl("");
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleDeleteSession = async (sessionId: string) => {
        try {
          const { message, status } = await deleteVideoSession({
            session_id: sessionId,
            host_id: user.id,
          });
      
          if (status) {
            toast.success(message);
            handleUserSessions();
          }
        } catch (error: any) {
          toast.error(error.message);
        }
      };

    const handleSaveToClipBoard = (sessionId: string) => {
        navigator.clipboard.writeText(sessionId);
        toast.success("Copied to clipboard");
    };

    useMemo(() => {
        if (user) handleUserSessions();
    }, [user]);

    return (
        <MySessionStyled>
            <Dialog
                className="flex flex-row"
                id="create-session-modal"
                open={openModal}
                handler={handleOpenModal}
                size={"sm"}
            >
                <Input
                    label="Video URL"
                    className="rounded-[0px] rounded-l-lg"
                    placeholder="Youtube Video Link"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    id="video-url"
                    type="text"
                    crossOrigin={"anonymous"}
                    minLength={5}
                />
                <button
                    className="bg-colorBgButtonPrimary hover:bg-colorBgButtonPrimaryHover px-6 py-1 rounded-r-lg text-white"
                    onClick={handleCreateSession}
                >
                    <span className="">Create</span>
                </button>
            </Dialog>
            <div className="section-header">
                <Typography variant="h3">Active Sessions</Typography>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {sessions &&
                    sessions.map((session) => (
                        <div
                            key={session.id}
                            className="box-shadow border h-64 rounded-lg flex flex-col p-4 shadow-sm hover:shadow-lg transition-shadow"
                        >
                            <div
                                onClick={() =>
                                    handleSaveToClipBoard(session.session_id)
                                }
                                className="flex flex-col text-center justify-center flex-grow bg-blur leading-6 cursor-pointer"
                            >
                                <div className="w-full">
                                    <p className="text-lg">Session id:</p>
                                    <span className="text-xl font-semibold">
                                        {session.session_id}
                                    </span>
                                    <p className="text-sm">
                                        Click to save to a clipboard
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 flex flex-row justify-around">
                                <button
                                    onClick={() =>
                                        handleJoinSession(session.session_id)
                                    }
                                    className="btn-primary px-6 py-2"
                                >
                                    <span>Join Session</span>
                                </button>
                                <button
                                    onClick={() =>
                                        handleDeleteSession(session.session_id)
                                    }
                                    className="btn-primary delete px-6 py-2"
                                >
                                    <span>Delete Session</span>
                                </button>
                            </div>
                        </div>
                    ))}
                <button className="create-session" onClick={handleOpenModal}>
                    {addIcon}{" "}
                    <span className="font-normal">Create New Session</span>
                </button>
            </div>
        </MySessionStyled>
    );
}

const MySessionStyled = styled.div`
    .delete {
        background-color: rgba(83, 83, 95, 0.38);
    }

    .delete:hover {
        background-color: rgba(83, 83, 95, 0.9);
    }

    .bg-blur {
        background-color: #f9f9f96b;
        color: #f9f9f969;
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
    }

    .box-shadow {
        box-shadow: 3px -1px 10px 0px rgba(92, 22, 197, 0.3);
        transition: all 0.6s ease-in-out;
    }

    .box-shadow:hover {
        box-shadow: 3px -1px 10px 0px rgba(92, 22, 197, 0.7);
    }

    .create-session {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;

        height: 16rem;
        color: ${(props) => props.theme.colorGrey2};
        font-weight: 600;
        cursor: pointer;
        border-radius: 1rem;
        border: 3px dashed ${(props) => props.theme.colorGrey5};
        transition: all 0.3s ease;

        i {
            font-size: 1.5rem;
            margin-right: 0.2rem;
        }

        &:hover {
            background-color: ${(props) => props.theme.colorGrey5};
            color: ${(props) => props.theme.colorGrey0};
        }
    }
`;
