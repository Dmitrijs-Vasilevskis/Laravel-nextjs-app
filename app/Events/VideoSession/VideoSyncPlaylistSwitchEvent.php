<?php

namespace App\Events\VideoSession;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class VideoSyncPlaylistSwitchEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(
        public string $sessionId,
        public string $action,
        public int $current_index
    ) {}

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): PrivateChannel
    {
        return new PrivateChannel('session.' . $this->sessionId);
    }

    /**
     * Get the data to broadcast with the event.
     *
     * @return array<string, mixed> An associative array containing the action
     *                              to be performed and the current index of the playlist.
     */
    public function broadcastWith(): array
    {
        return [
            'action' => $this->action,
            'currentIndex' => $this->current_index,
        ];
    }

    /**
     * The event's broadcast name.
     *
     * @return string
     */
    public function broadcastAs(): string
    {
        return 'video.sync.playlist.switch';
    }
}
