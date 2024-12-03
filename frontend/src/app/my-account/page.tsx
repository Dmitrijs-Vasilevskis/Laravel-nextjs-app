"use client";

import React, { useEffect, useState } from "react";
import { Input, Button, Typography } from "@material-tailwind/react";
import styled from "styled-components";
import { useSearchParams } from "next/navigation";
import MyProfile from "../components/MyAccount/Tabs/Profile/MyProfile";
import MySessions from "../components/MyAccount/Tabs/Sessions/MySessions";
import { useAuth } from "../hooks/auth";
import Link from "next/link";
import MyFriends from "../components/MyAccount/Tabs/Friends/MyFriends";

export default function page() {
    const { user } = useAuth({
        middleware: "auth",
        redirectIfAuthenticated: "/",
    });

    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState<string>("profile");

    const handleTabSwitch = (tab: string) => {
        setActiveTab(tab);
    };

    const isTabActive = (tab: string) => {
        return !!activeTab.includes(tab);
    };

    const handleRenderTab = () => {
        switch (activeTab) {
            case "profile":
                return <MyProfile />;
            case "sessions":
                return <MySessions />;
            case "friends":
                return <MyFriends />;
            default:
                return <MyProfile />;
        }
    };

    useEffect(() => {
        setActiveTab(searchParams.get("tab") || "profile");
    }, [searchParams.get("tab")]);

    return (
        <MyAccountStyled className="main-container">
            <header className="my-account-header">
                <div>
                    <ul className="inline-grid grid-flow-col border-b">
                        <li className="tab-item-container">
                            <Link
                                href={{
                                    pathname: "my-account",
                                    query: { tab: "profile" },
                                }}
                                className={`tab-link ${
                                    isTabActive("profile") ? "active" : ""
                                }`}
                            >
                                My Profile
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={{
                                    pathname: "my-account",
                                    query: { tab: "sessions" },
                                }}
                                className={`tab-link ${
                                    isTabActive("sessions") ? "active" : ""
                                }`}
                            >
                                <span className="tab-text">My Sessions</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={{
                                    pathname: "my-account",
                                    query: { tab: "friends" },
                                }}
                                className={`tab-link ${
                                    isTabActive("friends") ? "active" : ""
                                }`}
                            >
                                <span className="tab-text">My Friends</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </header>
            {user && <div className="main-wrapper">{handleRenderTab()}</div>}
        </MyAccountStyled>
    );
}

const MyAccountStyled = styled.div`
    display: flex;
    flex-direction: column;

    .main-wrapper {
        width: 100%;
        height: 100%;
    }

    .my-account-header {
        margin: 1rem 0;
    }

    .section-item-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 1rem;
    }

    .section-item-content {
        margin: 0 1rem;
        display: flex;
        width: 100%;
    }

    .section-item-actions {
        display: flex;
    }

    .section-input {
        width: 100%;
    }

    .image-preview-container {
        min-width: 6rem;
        align-content: center;
    }

    .image-preview-icon {
        font-size: 63px;
        text-align: center;
        border: 1px solid black;
        border-radius: 9999px;
        // display: flex;
        // justify-content: center;
    }

    .section-item-header {
        align-content: center;
        width: 18rem;
    }

    .tab-item-container {
        padding: 2px;
    }

    .tab-text {
        padding: 0 10px;
    }

    .active {
        color: #bf94ff;
    }

    .tab-link {
        position: relative;
        font-size: 1rem;
        font-weight: 600;
    }

    .tab-link:hover {
        color: #a970ff;
    }

    .tab-link::after {
        position: relative;
        content: "";
        bottom: -2px;
        display: block;
        width: 100%;
        height: 0px;
        background-color: #bf94ff;
    }

    .active::after {
        height: 2px;
    }
`;
