<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\ScopedBy;
use App\Models\Scopes\VideoSessionScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[ScopedBy([VideoSessionScope::class])]
class VideoSession extends Model
{
    use HasFactory;

    protected $table = 'video_session';

    protected $fillable = [
        'session_id',
        'host_id',
        'video_id',
        'token',
        'is_public',
        'is_active'
    ];

    public function messages()
    {
        return $this->hasMany(VideoSessionChatMessage::class, 'session_id');
    }

    public function host(): BelongsTo
    {
        return $this->belongsTo(User::class, 'host_id');
    }
}
