<?php

namespace App\Events\VideoSession\Chat;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ChatMessageEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(
        public string $message,
        public string $from,
        public string $sessionId,
        public string $chatNameColor,
        public string $created_at,
    ) {}

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn()
    {
        return new PrivateChannel('session.' . $this->sessionId);
    }

    /**
     * Get the data to broadcast with the event.
     *
     * @return array<string, string> The array containing message details such as
     *                               message content, sender, session ID, and chat name color.
     */
    public function broadcastWith(): array
    {
        return [
            'message' => $this->message,
            'from' => $this->from,
            'sessionId' => $this->sessionId,
            'chat_name_color' => $this->chatNameColor,
        ];
    }

    /**
     * The event's broadcast name.
     *
     * @return string
     */
    public function broadCastAs(): string
    {
        return 'chat.message';
    }
}
