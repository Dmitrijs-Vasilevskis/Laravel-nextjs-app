<?php

namespace App\Events\VideoSession;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class VideoSyncEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(
        public string $sessionId,
        public string $state,
        public string $time
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
     * @return array<string, mixed> An array containing the state and seekTo information.
     */
    public function broadcastWith(): array
    {
        return [
            'state' => $this->state,
            'seekTo' => [
                'seconds' => $this->time,
                'allowSeekAhead' => false
            ]
        ];
    }

    /**
     * The event's broadcast name.
     *
     * @return string
     */
    public function broadcastAs(): string
    {
        return 'video.sync';
    }
}
