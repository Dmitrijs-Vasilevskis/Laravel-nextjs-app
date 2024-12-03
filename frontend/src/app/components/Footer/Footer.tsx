"use client";

import React from "react";
import Image from "next/image";
import { Typography } from "@material-tailwind/react";
import {
    gitIcon,
    twitterIcon,
    instagramIcon,
    faceBookIcon,
} from "@/app/utils/icons";
import Link from "next/link";

export default function Footer() {
    const icons = [
        {
            icon: gitIcon,
        },
        {
            icon: twitterIcon,
        },
        {
            icon: instagramIcon,
        },
        {
            icon: faceBookIcon,
        },
    ];

    return (
        <>
            <footer className="footer bloc w-full mx-auto mt-4 mb-4 py-4 px-8 container">
                <div className="flex flex-row">
                    <div>
                        <Image
                            src="/images/home-logo.png"
                            alt="Description of image"
                            width={90}
                            height={90}
                            priority
                        />
                    </div>
                    <div className="w-full">
                        <ul className="flex flex-row h-full items-center float-right">
                            <li className="mr-4">
                                <div>
                                    <Link href="/">Footer navigation</Link>
                                </div>
                            </li>
                            <li className="mr-4">
                                <div>
                                    <Link href="/">Footer navigation</Link>
                                </div>
                            </li>
                            <li className="mr-4">
                                <div>
                                    <Link href="/">Footer navigation</Link>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="flex flex-row justify-around mt-4">
                    <Typography className="mb-4 text-center font-normal  md:mb-0 flex flex-row gap-4">
                        Watch With ❤️
                        <span>All rights reserved.</span>
                    </Typography>
                    <div className="flex flex-row">
                        {icons.map(({ icon }, key) => (
                            <Typography
                                key={key}
                                as="a"
                                href="#"
                                variant="small"
                                className="mr-4 text-xl"
                            >
                                {icon}
                            </Typography>
                        ))}
                    </div>
                </div>
            </footer>
        </>
    );
}
