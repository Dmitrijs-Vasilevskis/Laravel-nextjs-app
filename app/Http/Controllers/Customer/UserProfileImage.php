<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Response;

class UserProfileImage extends Controller
{
    /**
     * Update the profile_image in storage for a specific user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request): JsonResponse
    {
        $request->validate([
            'id' => 'required|exists:users,id',
            'profile_picture' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $user = User::find($request->id);

        if ($request->hasFile('profile_picture')) {
            $file = $request->file('profile_picture');

            if ($user->profile_picture) {
                Storage::delete($user->profile_picture);
            }

            $file_path = $file->store('profile_pictures');
            $file_url = asset('storage/profile_pictures/' . basename($file_path));

            $user->profile_picture_url = $file_url;
            $user->profile_picture = $file_path;
        }

        $user->save();

        return response()->json([
            'message' => 'User data updated successfully',
            'user' => $user,
            'url' => $file_url,
        ], 200);
    }
}
