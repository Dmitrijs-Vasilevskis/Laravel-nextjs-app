"use client";

import MiniChat from "../MiniDirectMessages/MiniChat";
import { usePathname } from "next/navigation";

export default function MiniFriendChat() {
    const pathname = usePathname();
    
    if (pathname.includes("my-account")) return;

    return <MiniChat />;
}
