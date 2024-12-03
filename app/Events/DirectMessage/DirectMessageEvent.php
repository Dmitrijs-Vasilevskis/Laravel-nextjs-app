<?php

namespace App\Events\DirectMessage;

use App\Models\DirectMessage;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DirectMessageEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(
        public DirectMessage $message,
        public int $receiverId,
        public int $senderId
    ) {
        //
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('direct-message.' . $this->receiverId),
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
            'message' => $this->message,
            'sender_id' => $this->senderId
        ];
    }

    /**
     * The event's broadcast name.
     *
     * @return string
     */
    public function broadcastAs(): string
    {
        return 'direct-message.message';
    }
}
