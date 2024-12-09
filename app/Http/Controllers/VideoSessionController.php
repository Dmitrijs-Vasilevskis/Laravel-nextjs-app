<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\VideoSession;
use App\Models\VideoSessionChatMessage;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use App\Events\VideoSession\Chat\ChatMessageEvent;
use App\Events\VideoSession\VideoSyncEvent;
use App\Events\VideoSession\VideoSyncAddToQueueEvent;
use App\Events\VideoSession\VideoSyncPlaylistState;
use App\Events\VideoSession\VideoSessionJoinEvent;
use App\Events\VideoSession\VideoSyncPlaylistSwitchEvent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class VideoSessionController extends Controller
{
    /**
     *  @var \App\Models\User
     */
    protected $user;

    /**
     * Get the currently authenticated user.
     * 
     * @param  \Illuminate\Http\Request  $request
     */
    public function __construct(Request $request)
    {
        $this->user = $request->user();
    }

    /**
     *  Get active video session by host_id
     * 
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getActiveVideoSessions(Request $request): JsonResponse
    {

        $request->validate([
            'host_id' => ['required'],
        ]);

        $videoSessionsCollection = VideoSession::where('host_id', $request->host_id)->get();

        return response()->json($videoSessionsCollection);
    }

    /**
     *  Create a new video session
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function initVideoSession(Request $request)
    {

        $request->validate([
            'host_id' => ['required'],
            'video_id' => ['required'],
        ]);

        $videoSession = VideoSession::create([
            'host_id' => $request->host_id,
            'video_id' => $request->video_id,
            'token' => Str::random(40),
            'session_id' => uniqid('sess_', false),
            'is_public' => $request->is_public ?? false,
            'is_active' => true,
        ]);

        return response()->json($videoSession);
    }

    /**
     *  Delete a video session by creator request
     * 
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteVideoSession(Request $request)
    {
        $request->validate([
            'session_id' => ['required'],
            'host_id' => ['required'],
        ]);

        if ($this->user->id !== $request->host_id) {
            return response()->json([
                'status' => 403,
                'message' => 'You are not authorized to delete this video session'
            ], 403);
        }

        VideoSession::where('session_id', $request->session_id)->delete();

        return response()
            ->json([
                'status' => 200,
                'message' => 'Video session deleted successfully'
            ], 200);
    }

    /**
     *  Join a video session, and broadcast join event
     * 
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function joinVideoSession(Request $request)
    {
        $request->validate([
            'session_id' => ['required'],
        ]);

        $user = $request->user();

        $videoSession = VideoSession::where('session_id', $request->session_id)->first();

        broadcast(new VideoSessionJoinEvent($request->session_id, $user->name));

        return response()->json($videoSession);
    }

    /**
     *  Broadcast sync event with the latest player state
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function getVideoSessionState(Request $request): Response
    {
        $request->validate([
            'session_id' => ['required'],
            'state' => ['required'],
        ]);

        broadcast(new VideoSyncEvent($request->session_id, $request->state, $request->time));

        return response()->noContent();
    }

    /**
     * Broadcast sync event with the latest playlist state,
     * current video index and seconds
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function getVideoSessionPlaylistState(Request $request): Response
    {
        $request->validate([
            'session_id' => ['required'],
            'current_index' => ['required'],
            'seconds' => ['required']
        ]);

        broadcast(new VideoSyncPlaylistState($request->session_id, $request->current_index, $request->seconds));

        return response()->noContent();
    }

    /**
     * Broadcast add to queue event, with the video id for specific session
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function videoSessionAddToQueue(Request $request): Response
    {
        $request->validate([
            'session_id' => ['required'],
            'video_id' => ['required']
        ]);

        broadcast(new VideoSyncAddToQueueEvent($request->session_id, $request->video_id));

        return response()->noContent();
    }

    /**
     * Broadcast switch playlist event,
     * with the video id for specific session
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function getVideoSessionPlayerSwitch(Request $request): Response
    {
        $request->validate([
            'session_id' => ['required'],
            'action' => ['required'],
            'current_video_index' => ['required']
        ]);

        broadcast(new VideoSyncPlaylistSwitchEvent($request->session_id, $request->action, $request->current_video_index));

        return response()->noContent();
    }

    // todo: implement message loading with pagination to optimize performance

    /**
     *  Get video session live chat messages
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getVideoSessionMessages(Request $request): Collection
    {
        $request->validate([
            'session_id' => ['required'],
        ]);

        return VideoSessionChatMessage::where('session_id', $request->session_id)->get();
    }

    /**
     * Broadcast a new live chat message for a specific session
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function sendChatMessage(Request $request): Response
    {

        $request->validate([
            'session_id' => 'required|string|exists:video_session,session_id',
            'message' => 'required|string',
            'user_id' => 'required',
            'from' => 'required|string'
        ]);

        $message = VideoSessionChatMessage::create([
            'session_id' => $request->session_id,
            'user_id' => $request->user_id,
            'from' => $request->from,
            'message' => $request->message,
            'chat_name_color' => $request->chat_name_color
        ]);

        broadcast(new ChatMessageEvent($message->message, $message->from, $message->session_id, $message->chat_name_color, $message->created_at));

        return response()->noContent();
    }
}
