<?php

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

Broadcast::routes(['middleware' => ['auth:sanctum']]);

require __DIR__.'/auth.php';
