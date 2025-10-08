<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class guru extends Model
{
    /** @use HasFactory<\Database\Factories\GuruFactory> */
    use HasFactory;

    protected $table = 'guru';

    protected $fillable = [
        'user_id',
        'nama',
        'nip',
        'alamat',
        'telepon',
    ];

    public $incrementing = false; // karena bukan auto-increment
    protected $keyType = 'string'; // UUID itu string

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }

    public function dudi()
    {
        return $this->hasMany(dudi::class, 'guru_id', 'id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function magang()
    {
        return $this->hasMany(magang::class, 'guru_id');
    }
}
