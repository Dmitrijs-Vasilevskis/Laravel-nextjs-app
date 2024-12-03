<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\ScopedBy;
use App\Models\Scopes\VideoSessionScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[ScopedBy([VideoSessionScope::class])]

class VideoSessionChatMessage extends Model
{
    use HasFactory;

    protected $table = 'video_session_chat_messages';

    protected $fillable = ['session_id', 'user_id','from', 'message', 'chat_name_color'];

    public function session(): BelongsTo
    {
        return $this->belongsTo(VideoSession::class, 'session_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function from(): BelongsTo
    {
        return $this->belongsTo(User::class, 'from');
    }
}

