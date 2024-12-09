"use client";

import { useAuth } from "@/app/hooks/auth";
import VideoSession from "./components/VideoSession/VideoSession";
import styled from "styled-components";
import { useGlobalState } from "./context/globalProvider";
import { Typography, Button } from "@material-tailwind/react";
import Image from "next/image";

export default function Home() {
    const { handleOpenAuthModal, user } = useGlobalState();

    return (
        <HomePageStyled className="main-container">
            <div className="main-logo">
                <Image
                    src="/images/home-logo.png"
                    alt="Description of image"
                    width={500}
                    height={300}
                    priority
                />
            </div>
            <div className="home-container">
                <div className="header">
                    <h1 className="header-title">
                        <span>Watch Videos</span>
                        <span>With Friends Together</span>
                    </h1>
                    <h3 className="header-secondary-content">
                        Synced Video Rooms with Live Chat
                    </h3>
                </div>
                <div className="main-content">
                    <Typography className="content-desc">
                        Connect with friends in private rooms to watch synced
                        videos, share real-time reactions, and chat live. Enjoy
                        a seamless, shared viewing experience where you can
                        queue videos, switch seamlessly between clips, and chat
                        as you watch—all in sync!
                    </Typography>
                    <div className="content-actions-container">
                        {user ? (
                            <VideoSession />
                        ) : (
                            <div>
                                <Button
                                    className="login-button"
                                    onClick={handleOpenAuthModal}
                                >
                                    Login to start
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </HomePageStyled>
    );
}

const HomePageStyled = styled.div`
  .main-logo {
    aspect-ratio: 4 / 3;
    justify-items: center;
  }

  .login-button {
    background-color: #5c16c5;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    color: #fff;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .login-button::hover {
    background-color: #772ce8
  }

  .home-container {
    display: flex;
    flex-direction: column;
    padding: 0 20px;
    line-height: 30px;
    letter-spacing: .5px;
    text-align: center;
    margin-bottom: 1rem;

    .header-title {
      font-size: 2rem;
      display:flex;
      flex-direction: column;
      align-items: center;
    }
    
    .header-secondary-content {
      font-size 1.5rem;
    }
  }

  .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 1.5rem;
  }

  .main-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .content-desc {
    width: 80%;
  }

  .content-actions-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 1.5rem;
  }
`;
