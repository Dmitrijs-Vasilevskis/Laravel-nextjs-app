<?php

namespace App\Events\VideoSession;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class VideoSyncPlaylistState implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(
        public string $sessionId,
        public int $current_index,
        public int $seconds,
    ) {}


    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('session.' . $this->sessionId);
    }

    /**
     * Get the data to broadcast with the event.
     *
     * @return array<string, mixed> The data array containing the current index 
     * and the seconds to sync the playlist state.
     */
    public function broadcastWith(): array
    {
        return [
            'currentIndex' => $this->current_index,
            'seconds' => $this->seconds,
        ];
    }

    /**
     * The event's broadcast name.
     *
     * @return string
     */
    public function broadcastAs(): string
    {
        return 'video.sync.playlist.state';
    }
}
