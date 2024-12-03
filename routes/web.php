<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

Route::get('/csrf-token', function () {
    return response()->json(['csrf_token' => csrf_token()]);
});

Route::get('/storage/profile_pictures/{filename}', function ($filename) {
    $path = storage_path('app/private/profile_pictures/' . $filename);

    if (!file_exists($path)) {
        abort(404);
    }

    return response()->file($path);
});

Route::get('/storage/image/{filename}', function ($filename) {
    $path = storage_path('app/private/images/' . $filename);

    if (!file_exists($path)) {
        abort(404);
    }

    return response()->file($path);
});


require __DIR__.'/auth.php';
