<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class school_settings extends Model
{
    /** @use HasFactory<\Database\Factories\SchoolSettingsFactory> */
    use HasFactory;

    protected $table = 'school_settings';

    protected $fillable = [
        'logo_url',
        'nama_sekolah',
        'alamat',
        'telepon',
        'email',
        'website',
        'kepala_sekolah',
        'npsn'
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
}
