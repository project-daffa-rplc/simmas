<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class siswa extends Model
{
    /** @use HasFactory<\Database\Factories\SiswaFactory> */
    use HasFactory;

    protected $table = 'siswa';

    protected $fillable = [
        'user_id',
        'nama',
        'nis',
        'kelas',
        'jurusan',
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

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function magang()
    {
        return $this->hasMany(magang::class, 'siswa_id');
    }

}
