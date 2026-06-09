<#
.SYNOPSIS
    Apya.Platform'u sıfırdan ayağa kaldırır: PostgreSQL'i başlatır, eksik client-side
    kütüphaneleri (wwwroot/libs) kurar ve Web uygulamasını çalıştırır.

.DESCRIPTION
    "ayağa kaldır" dediğinde tek komutla çalışır hale getirir. Idempotent: zaten
    çalışan/kurulu olan adımları atlar. Özellikle git worktree'lerde wwwroot/libs
    git-ignore'lu olduğu için eksiktir ve elle `abp install-libs` gerekir; bu script
    onu otomatik yapar.

.PARAMETER NoRun
    Hazırlık adımlarını yapar (Postgres + libs) ama `dotnet run` yapmaz.

.PARAMETER PgRoot
    PostgreSQL kurulum kökü. Varsayılan: C:\Program Files\PostgreSQL\17

.EXAMPLE
    ./scripts/dev-up.ps1
#>
[CmdletBinding()]
param(
    [switch]$NoRun,
    [string]$PgRoot = 'C:\Program Files\PostgreSQL\17',
    [int]$WebPort = 44386
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
$webProj  = Join-Path $repoRoot 'src\Apya.Platform.Web'
$libsDir  = Join-Path $webProj 'wwwroot\libs'

function Write-Step($msg) { Write-Host "`n==> $msg" -ForegroundColor Cyan }

# ---------------------------------------------------------------------------
# 1) PostgreSQL — servis olarak kayıtlı DEĞİL, gerekirse pg_ctl ile başlat
# ---------------------------------------------------------------------------
Write-Step "PostgreSQL kontrol ediliyor (port 5432)"
$pgUp = (Test-NetConnection -ComputerName localhost -Port 5432 -WarningAction SilentlyContinue).TcpTestSucceeded
if ($pgUp) {
    Write-Host "    PostgreSQL zaten çalışıyor." -ForegroundColor Green
} else {
    $pgCtl  = Join-Path $PgRoot 'bin\pg_ctl.exe'
    $pgData = Join-Path $PgRoot 'data'
    if (-not (Test-Path $pgCtl))  { throw "pg_ctl bulunamadı: $pgCtl  (PostgreSQL 17 kurulu mu? -PgRoot ile yolu verebilirsin.)" }
    if (-not (Test-Path (Join-Path $pgData 'PG_VERSION'))) { throw "PostgreSQL data dizini bulunamadı: $pgData" }
    Write-Host "    Başlatılıyor: pg_ctl start -D `"$pgData`""
    & $pgCtl -D $pgData -l (Join-Path $env:TEMP 'apya_pg.log') -w start
    Start-Sleep -Seconds 2
    $pgUp = (Test-NetConnection -ComputerName localhost -Port 5432 -WarningAction SilentlyContinue).TcpTestSucceeded
    if (-not $pgUp) { throw "PostgreSQL başlatılamadı. Log: $env:TEMP\apya_pg.log" }
    Write-Host "    PostgreSQL başlatıldı." -ForegroundColor Green
}

# ---------------------------------------------------------------------------
# 2) Client-side kütüphaneler — wwwroot/libs yoksa/boşsa `abp install-libs`
#    (worktree'lerde git-ignore'lu olduğu için tipik olarak eksiktir)
# ---------------------------------------------------------------------------
Write-Step "wwwroot/libs kontrol ediliyor"
$libsCount = 0
if (Test-Path $libsDir) { $libsCount = (Get-ChildItem $libsDir -ErrorAction SilentlyContinue | Measure-Object).Count }
if ($libsCount -gt 0) {
    Write-Host "    libs mevcut ($libsCount paket) — install-libs atlanıyor." -ForegroundColor Green
} else {
    Write-Host "    libs eksik — 'abp install-libs' çalıştırılıyor (Web aksi halde HTTP 500 'Libs Folder is Missing' döner)..."
    Push-Location $webProj
    try { abp install-libs } finally { Pop-Location }
    Write-Host "    install-libs tamamlandı." -ForegroundColor Green
}

# ---------------------------------------------------------------------------
# 3) Web uygulamasını çalıştır
# ---------------------------------------------------------------------------
if ($NoRun) {
    Write-Step "Hazırlık tamam (-NoRun verildi, uygulama başlatılmadı)."
    return
}

Write-Step "Web uygulaması başlatılıyor → https://localhost:$WebPort"
$env:ASPNETCORE_ENVIRONMENT = 'Development'
$env:ASPNETCORE_URLS        = "https://localhost:$WebPort"
# Content root proje dizini olmalı (kökten --project çalıştırınca conn string boş gelir).
Push-Location $webProj
try { dotnet run --no-launch-profile } finally { Pop-Location }
