<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class dudi extends Model
{
    /** @use HasFactory<\Database\Factories\DudiFactory> */
    use HasFactory;

    protected $table = 'dudi';

    protected $fillable = [
        'nama_perusahaan',
        'alamat',
        'telepon',
        'email',
        'penanggung_jawab',
        'status',
        'max_magang',
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

    public function guru()
    {
        return $this->belongsTo(guru::class, 'guru_id', 'id');
    }

    public function magang()
    {
        return $this->hasMany(magang::class, 'dudi_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

}
