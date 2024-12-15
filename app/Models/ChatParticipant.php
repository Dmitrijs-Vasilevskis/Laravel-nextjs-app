<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Chat;

class ChatParticipant extends Model
{
    use HasFactory;

    protected $table = 'chat_participant';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'chat_id',
        'user_id',
        'last_read_at',
    ];

    /**
     * Get the chat associated with the participant.
     */
    public function chat()
    {
        return $this->belongsTo(Chat::class);
    }

    /**
     * Get the user associated with the participant.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
