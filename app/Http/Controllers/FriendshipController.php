<?php

namespace App\Http\Controllers;

use App\Models\DirectMessage;
use Illuminate\Http\Request;
use App\Models\Friendship;
use Illuminate\Support\Facades\Log;


class FriendshipController extends Controller
{
    protected $user;

    /**
     * Get the currently authenticated user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return void
     */
    public function __construct(Request $request)
    {
        $this->user = $request->user();
    }

    /**
     * Send a friendship request to a user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function sendFriendRequest(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
        ]);

        $senderId = $this->user->id;
        $receiverId = $request->receiver_id;

        // Check if a friendship or request already exists
        $existingRequest = Friendship::where(function ($query) use ($senderId, $receiverId) {
            $query->where('sender_id', $senderId)
                ->where('receiver_id', $receiverId);
        })->orWhere(function ($query) use ($senderId, $receiverId) {
            $query->where('sender_id', $receiverId)
                ->where('receiver_id', $senderId);
        })->first();

        if ($existingRequest) {
            if ($existingRequest->receiver_id === $senderId) {
                return response()->json(['message' => 'Friend request was sent to you already.'], 202);
            }

            return response()->json(['message' => 'Friend request already exists or you are already friends.'], 202);
        }

        // Create a new friend
        $friendship = Friendship::create([
            'sender_id' => $senderId,
            'receiver_id' => $receiverId,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Friend request sent successfully.',
            'friendship' => $friendship
        ], 201);
    }

    /**
     * Accept a friendship request sent by another user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function acceptFriendRequest(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
        ]);

        $receiverId = $this->user->id;

        $friendship = Friendship::where('sender_id', $request->receiver_id)
            ->where('receiver_id', $receiverId)
            ->where('status', 'pending')
            ->update(['status' => 'accepted']);

        Log::debug($friendship);

        return response()->json($friendship);
    }

    /**
     * Decline a friendship request sent by another user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function declineFriendRequest(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
        ]);

        $receiverId = $this->user->id;

        $friendship = Friendship::where('sender_id', $request->receiver_id)
            ->where('receiver_id', $receiverId)
            ->where('status', 'pending')
            ->update(['status' => 'declined']);

        return response()->json($friendship);
    }

    public function removeFriend(Request $request)
    {
        $userId = $this->user->id;

        $request->validate([
            'receiver_id' => 'required|exists:users,id',
        ]);

        $friendship = Friendship::where(function ($query) use ($userId, $request) {
            $query->where('sender_id', $userId)->where('receiver_id', $request->receiver_id);
        })->orWhere(function ($query) use ($userId, $request) {
            $query->where('sender_id', $request->receiver_id)->where('receiver_id', $userId);
        })->delete();

        return response()->json($friendship);
    }

    /**
     * Fetches the list of friends for the authenticated user.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function fetchFriendList()
    {
        $userId = $this->user->id;

        $friends = Friendship::where(function ($query) use ($userId) {
            $query->where('sender_id', $userId)->where('status', 'accepted');
        })->orWhere(function ($query) use ($userId) {
            $query->where('receiver_id', $userId)->where('status', 'accepted');
        })->get();

        $friendList = $friends->map(function ($friendship) use ($userId) {
            return $friendship->sender_id === $userId ? $friendship->receiver_id : $friendship->sender_id;
        });

        return response()->json($friendList);
    }

    /**
     * Fetches the list of friends for the authenticated user, including their
     * latest message and count of unread messages.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function fetchFriends()
    {
        $userId = $this->user->id;

        $friendList = Friendship::where(function ($query) use ($userId) {
            $query->where('sender_id', $userId)
                ->orWhere('receiver_id', $userId);
        })
            ->where('status', 'accepted')
            ->with(['sender', 'receiver'])
            ->get()
            ->map(function ($friendship) use ($userId) {
                // Determine the friend user data depending on the relationship
                $friend = $friendship->sender_id === $userId ? $friendship->friend : $friendship->user;

                Log::debug($friend);
                // Fetch the latest message and count of unread messages
                $latestMessage = DirectMessage::where(function ($query) use ($userId, $friend) {
                    $query->where('sender_id', $userId)->where('receiver_id', $friend->id)
                        ->orWhere('sender_id', $friend->id)->where('receiver_id', $userId);
                })
                    ->orderBy('created_at', 'desc')
                    ->first();

                $unreadCount = DirectMessage::where('receiver_id', $userId)
                    ->where('sender_id', $friend->id)
                    ->where('is_read', false)
                    ->count();

                return [
                    'data' => $friend,
                    'chatPreview' => [
                        'latestMessage' => $latestMessage ? $latestMessage->message : null,
                        'sentTime' => $latestMessage ? $latestMessage->created_at : null,
                        'unread' => $unreadCount
                    ]
                ];
            });

        return response()->json(['friendList' => $friendList], 200);
    }

    /**
     * Fetches the pending friend requests for the authenticated user.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPendingRequests()
    {
        $pendingRequests = Friendship::where('receiver_id', $this->user->id)
            ->where('status', 'pending')
            ->with('user')
            ->get();

        return response()->json($pendingRequests);
    }
}
