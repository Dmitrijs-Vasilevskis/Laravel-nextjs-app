<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ChatParticipant;
use App\Models\DirectMessage;

class Chat extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'type',
    ];

    /**
     * Get the participant of the chat.
     */
    public function participants()
    {
        return $this->hasMany(ChatParticipant::class);
    }

    /**
     * Get the messages of the chat.
     */
    public function messages()
    {
        return $this->hasMany(DirectMessage::class);
    }
}
