<?php

use Illuminate\Support\Facades\Broadcast;


Broadcast::channel('session.{sessionId}', function ($user, $sessionId) {
    return true;
});

Broadcast::channel('direct-message.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});

Broadcast::channel('notifications.{userId}', function ($user, $userId) {
    return true;
});
