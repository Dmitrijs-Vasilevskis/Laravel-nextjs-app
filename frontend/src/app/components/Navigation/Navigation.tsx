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
import UserMenu from "../User/UserMenu";
import UserMenuMobile from "../User/UserMenuMobile";
import { AuthFormType } from "@/types/Auth/Auth";

export default function Navigation() {
    const { openAuthModal, handleOpenAuthModal, user } = useGlobalState();
    const [preselectedFormType, setPreselectedFormType] =
        useState<AuthFormType | null>(null);
    const [openMobileMenu, setOpenMobileMenu] = useState(false);
    const handleOpenMobileMenu = () => setOpenMobileMenu((cur) => !cur);

    useEffect(() => {
        window.addEventListener(
            "resize",
            () => window.innerWidth >= 960 && setOpenMobileMenu(false)
        );
    }, []);

    return (
        <Navbar
            color="transparent"
            className="mx-auto max-w-screen-xl py-0 px-0 md:px-8 md:py-4"
        >
            <div className=" px-4 md:px-0 container mx-auto flex items-center justify-between dark:text-white text-blue-gray-900">
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

                <div className="navigation-right invisible lg:visible">
                    {!user ? (
                        <Button
                            onClick={() => {
                                setPreselectedFormType("login");
                                handleOpenAuthModal();
                            }}
                            color="gray"
                            className="hidden lg:inline-block"
                        >
                            Sign in
                        </Button>
                    ) : (
                        <div className="user-profile relative">
                            <UserMenu user={user} />
                        </div>
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
                <div className="mt-2 bg-white py-2 md:rounded-xl">
                    {!user ? (
                        <>
                            <Button
                                className="mb-2"
                                fullWidth
                                onClick={() => {
                                    setPreselectedFormType("login");
                                    handleOpenAuthModal();
                                }}
                            >
                                Sign in
                            </Button>
                            <Button
                                className="mb-2"
                                fullWidth
                                onClick={() => {
                                    setPreselectedFormType("register");
                                    handleOpenAuthModal();
                                }}
                            >
                                Sign up
                            </Button>
                        </>
                    ) : (
                        <div className="user-profile relative">
                            <UserMenuMobile user={user} />
                        </div>
                    )}
                </div>
            </Collapse>
            {openAuthModal && (
                <AuthModal
                    preselectedFormType={preselectedFormType}
                    handleOpenAuthModal={handleOpenAuthModal}
                />
            )}
        </Navbar>
    );
}
