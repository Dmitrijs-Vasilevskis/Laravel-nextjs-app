<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VideoSessionController;
use App\Http\Controllers\Customer\UserProfileImage;
use App\Http\Controllers\Customer\UserDetails;
use App\Http\Controllers\DirectMessageController;
use App\Http\Controllers\FriendshipController;
use App\Models\User;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});


Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/init-video-session', [VideoSessionController::class, 'initVideoSession']);

    Route::post('delete-video-session', [VideoSessionController::class, 'deleteVideoSession']);

    Route::post('/join-video-session', [VideoSessionController::class, 'joinVideoSession']);

    Route::post('/video-sync-player-state', [VideoSessionController::class, 'getVideoSessionState']);

    Route::post('/video-sync-playlist-state', [VideoSessionController::class, 'getVideoSessionPlaylistState']);

    Route::post('/video-sync-add-to-queue', [VideoSessionController::class, 'videoSessionAddToQueue']);

    Route::post('/video-sync-player-video-switch', [VideoSessionController::class, 'getVideoSessionPlayerSwitch']);

    Route::post('/get-chat-messages', [VideoSessionController::class, 'getVideoSessionMessages']);

    Route::post('/send-chat-message', [VideoSessionController::class, 'sendChatMessage']);

    Route::post('/user-update-profile-image', [UserProfileImage::class, 'update']);

    Route::post('/user-update-profile', [UserDetails::class, 'updateUserNameColor']);

    Route::get('/get-active-sessions', [VideoSessionController::class, 'getActiveVideoSessions']);
});


Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user/{id}', function ($id) {
        return User::where('id', $id)->first();
    });

    Route::post('/send-direct-message', [DirectMessageController::class, 'sendDirectMessage']);

    Route::post('/get-direct-messages', [DirectMessageController::class, 'getDirectMessages']);

    Route::post('/get-unread-direct-messages', [DirectMessageController::class, '']);

    Route::post('/read-direct-message', [DirectMessageController::class, 'readDirectMessage']);

    Route::post('/friend-request/send', [FriendshipController::class, 'sendFriendRequest']);

    Route::post('/friend-request/accept/{id}', [FriendshipController::class, 'acceptFriendRequest']);

    Route::post('/friend-request/reject/{id}', [FriendshipController::class, 'rejectFriendRequest']);

    Route::delete('/friend/remove/{id}', [FriendshipController::class, 'removeFriend']);

    Route::get('/fetch-friends', [FriendshipController::class, 'fetchFriends']);

    Route::get('/friend-requests/pending', [FriendshipController::class, 'getPendingRequests']);

    Route::post('/friend-requests/accept', [FriendshipController::class, 'acceptFriendRequest']);

    Route::post('/friend-requests/decline', [FriendshipController::class, 'declineFriendRequest']);
});