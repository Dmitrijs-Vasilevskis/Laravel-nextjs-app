<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserDetails extends Controller
{

    public function updateUserNameColor(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:users,id',
            'nicknameColor' => 'required|string|max:255',
        ]);

        $user = User::find($request->id);

        if ($user) {
            $user->chat_name_color = $request->nicknameColor;
            $user->save();
        }

        return response()->json([
            'message' => 'User nickname color updated successfully',
            'user' => $user
        ], 200);
    }
}
