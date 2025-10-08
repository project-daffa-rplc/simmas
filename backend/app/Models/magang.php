<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class magang extends Model
{
    /** @use HasFactory<\Database\Factories\MagangFactory> */
    use HasFactory;

    protected $table = 'magang';

    protected $fillable = [
        'siswa_id',
        'guru_id',
        'dudi_id',
        'status',
        'nilai_akhir',
        'tanggal_mulai',
        'tanggal_selesai',
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

    public function siswa()
    {
        return $this->belongsTo(siswa::class, 'siswa_id', 'id');
    }

    public function dudi()
    {
        return $this->belongsTo(dudi::class, 'dudi_id', 'id');
    }


    public function guru()
    {
        return $this->belongsTo(guru::class, 'guru_id', 'id');
    }


}
