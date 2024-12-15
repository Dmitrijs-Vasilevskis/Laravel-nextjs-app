"use client";

import { useGlobalState } from "@/app/context/globalProvider";
import MiniChat from "../MiniDirectMessages/MiniChat";
import { usePathname } from "next/navigation";

export default function MiniFriendChat() {
    const { user } = useGlobalState();
    const pathname = usePathname();

    if (pathname.includes("my-account") || !user) return;

    return <MiniChat />;
}
