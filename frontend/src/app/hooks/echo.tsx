import { useEffect, useState } from "react";
import { axios } from "@/app/lib/axios";
import Echo from "laravel-echo";

import Pusher from "pusher-js";

declare global {
    interface Window {
        Pusher: typeof Pusher;
    }
}

window.Pusher = Pusher;

interface Channel {
    name: string;
}

interface AuthorizerOptions {
    auth: {
        headers: Record<string, string>;
    };
}

type AuthorizeCallback = (error: boolean, data: any) => void;

export const useEcho = (): Echo | null => {
    const [echoInstance, setEchoInstance] = useState<Echo | null>(null);

    useEffect(() => {
        const echo = new Echo({
            broadcaster: "reverb",
            key: process.env.NEXT_PUBLIC_REVERB_APP_KEY as string,

            authorizer: (channel: Channel, options: AuthorizerOptions) => {
                return {
                    authorize: (
                        socketId: string,
                        callback: AuthorizeCallback
                    ) => {
                        axios
                            .post("api/broadcasting/auth", {
                                socket_id: socketId,
                                channel_name: channel.name,
                            })
                            .then((response) => {
                                callback(false, response.data);
                            })
                            .catch((error) => {
                                callback(true, error);
                            });
                    },
                };
            },
            wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
            wsPort: process.env.NEXT_PUBLIC_REVERB_PORT ?? 80,
            wssPort: process.env.NEXT_PUBLIC_REVERB_PORT ?? 443,
            forceTLS:
                (process.env.NEXT_PUBLIC_REVERB_SCHEME ?? "https") === "https",
            enabledTransports: ["ws", "wss"],
        });

        setEchoInstance(echo);
    }, []);

    return echoInstance;
};
