<?php

namespace App\Events\DirectMessage;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\DirectMessage;

class DirectMessageReadEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(
        public int $messageId,
        public int $senderId,
        public int $receiverId
    ) {}

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('direct-message.' . $this->senderId),
        ];
    }

    /**
     * Get the data to broadcast with the event.
     *
     * @return array<int, mixed>
     */
    public function broadcastWith(): array
    {
        return [
            'messageId' => $this->messageId,
            'receiverId' => $this->receiverId
        ];
    }

    /**
     * The event's broadcast name.
     *
     * @return string
     */
    public function broadcastAs(): string
    {
        return 'direct-message.read';
    }
}
