<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'roleAdmin' => \App\Http\Middleware\ChekRole::class,
            'roleSiswa' => \App\Http\Middleware\CheckRoleSiswa::class,
            'roleGuru' => \App\Http\Middleware\CheckRoleGuru::class,
            'checkGuruOwnership' => \App\Http\Middleware\CheckGuruOwnerShip::class,
            'checkSiswaOwnershipJurnal' => \App\Http\Middleware\CheckJurnalLogbookOwnerShip::class
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
