"use client";

import React, { useEffect, useState } from "react";
import {
    Navbar,
    Collapse,
    Typography,
    Button,
    IconButton,
} from "@material-tailwind/react";
import AuthModal from "../Auth/AuthModal";
import { useGlobalState } from "@/app/context/globalProvider";
import UserProfile from "../User/UserProfile";

export default function Navigation() {
    const { openAuthModal, handleOpenAuthModal, user } = useGlobalState();

    const [openUserMenu, setOpenUserMenu] = useState(false);
    const handleOpenUserMenu = () => setOpenUserMenu((cur) => !cur);

    const [openMobileMenu, setOpenMobileMenu] = useState(false);
    const handleOpenMobileMenu = () => setOpenMobileMenu((cur) => !cur);

    useEffect(() => {
        window.addEventListener(
            "resize",
            () => window.innerWidth >= 960 && setOpenMobileMenu(false)
        );
    }, []);

    return (
        <Navbar color="transparent" className="mx-auto">
            <div className="container mx-auto flex items-center justify-between dark:text-white text-blue-gray-900">
                <div>
                    <Typography
                        as="a"
                        href="/"
                        color="blue-gray"
                        className="mr-4 cursor-pointer text-lg font-bold"
                    >
                        Watch W
                    </Typography>
                </div>

                <div className="navigation-right">
                    {!user ? (
                        <Button
                            onClick={handleOpenAuthModal}
                            color="gray"
                            className="hidden lg:inline-block"
                        >
                            Sign in
                        </Button>
                    ) : (
                        <div className="user-profile relative">
                            <UserProfile user={user} />
                        </div>
                    )}
                    {openAuthModal && (
                        <AuthModal handleOpenAuthModal={handleOpenAuthModal} />
                    )}
                </div>
                <IconButton
                    size="sm"
                    variant="text"
                    color="white"
                    onClick={handleOpenMobileMenu}
                    className="ml-auto inline-block dark:text-white text-blue-gray-900 lg:hidden"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-6 w-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                        />
                    </svg>
                </IconButton>
            </div>
            <Collapse open={openMobileMenu}>
                <div className="mt-2 rounded-xl bg-white py-2">
                    <Button className="mb-2" fullWidth>
                        Sign in
                    </Button>
                </div>
            </Collapse>
        </Navbar>
    );
}
