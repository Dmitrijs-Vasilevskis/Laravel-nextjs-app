<?php

namespace App\Http\Controllers;

use App\Models\DirectMessage;
use Illuminate\Http\Request;
use App\Events\DirectMessage\DirectMessageEvent;
use App\Events\DirectMessage\DirectMessageReadEvent;
use Illuminate\Support\Facades\Log;

class DirectMessageController extends Controller
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
     * Send a direct message to a user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function sendDirectMessage(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'message' => 'required|string|max:255'
        ]);

        $message = DirectMessage::create([
            'sender_id' => $this->user->id,
            'receiver_id' => $request->receiver_id,
            'message' => $request->message
        ]);


        broadcast(new DirectMessageEvent($message, $request->receiver_id, $this->user->id))->toOthers();

        return response()->json($message);
    }

    /**
     * Retrieve direct messages exchanged between the authenticated user and a friend.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     *
     * Validates the request for 'friend_id', 'page', and 'limit', retrieves the messages
     * between the authenticated user and the specified friend, and paginates the results.
     */
    public function getDirectMessages(Request $request)
    {
        $request->validate([
            'friend_id' => 'required|exists:users,id',
            'page' => 'integer',
            'limit' => 'integer'
        ]);

        $userId = $this->user->id;
        $friendId = $request->friend_id;
        $page = $request->page ?? 1;
        $limit = $request->limit ?? 40;

        $messageCollection = DirectMessage::where(function ($query) use ($userId, $friendId) {
            $query->where('sender_id', $userId)->where('receiver_id', $friendId);
        })->orWhere(function ($query) use ($userId, $friendId) {
            $query->where('sender_id', $friendId)->where('receiver_id', $userId);
        })->orderBy('created_at', 'desc')
            ->skip(($page - 1) * $limit)
            ->take($limit)
            ->get();

        return response()->json($messageCollection);
    }

    /**
     * Update a direct message to mark it as read.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function readDirectMessage(Request $request)
    {
        $request->validate([
            'message_id' => 'required|exists:direct_messages,id',
            'sender_id' => 'required|exists:users,id'
        ]);

        $receiverId = $this->user->id;

        DirectMessage::where('id', $request->message_id)
            ->where('receiver_id', $receiverId)
            ->update(['is_read' => true]);

        broadcast(new DirectMessageReadEvent($request->message_id, $request->sender_id, $receiverId))->toOthers();

        return response()->json([
            'message_id' => $request->message_id,
            'sender_id' => $request->sender_id,
        ]);
    }
}
