<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class logbook extends Model
{
    /** @use HasFactory<\Database\Factories\LogbookFactory> */
    use HasFactory, softDeletes;

    protected $table = 'logbook';

    protected $fillable = [
        'magang_id',
        'tanggal',
        'kegiatan',
        'kendala',
        'file',
        'status_verifikasi',
        'catatan_guru',
        'catatan_dudi'
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

    public function magang()
    {
        return $this->belongsTo(magang::class, 'magang_id');
    }
}
