<#
.SYNOPSIS
    Apya.Platform'u sıfırdan ayağa kaldırır: aktif veritabanını hazırlar, eksik
    client-side kütüphaneleri (wwwroot/libs) kurar ve Web uygulamasını çalıştırır.

.DESCRIPTION
    "ayağa kaldır" dediğinde tek komutla çalışır hale getirir. Idempotent: zaten
    çalışan/kurulu olan adımları atlar. Özellikle git worktree'lerde wwwroot/libs
    git-ignore'lu olduğu için eksiktir ve elle `abp install-libs` gerekir; bu script
    onu otomatik yapar.

    Veritabanı adımı `Database:Provider`e göre dallanır: SqlServer ise MSSQL servisi
    + sqlcmd bağlantı doğrulaması, PostgreSql ise pg_ctl ile başlatma. Yerelde şu an
    aktif olan SqlServer'dır.

.PARAMETER NoRun
    Hazırlık adımlarını yapar (veritabanı + libs) ama `dotnet run` yapmaz.

.PARAMETER PgRoot
    PostgreSQL kurulum kökü — yalnız Database:Provider=PostgreSql iken kullanılır.
    Varsayılan: C:\Program Files\PostgreSQL\17

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
# 1) Veritabanı — SABİT VARSAYMA, aktif sağlayıcıyı appsettings'ten oku.
#    Bu repo sağlayıcıyı iki kez çevirdi (2026-05-12 → PostgreSql, 2026-08-13 →
#    SqlServer). Sabit varsayan script sessizce YANLIŞ DB'yi hazırlar: Postgres'i
#    başlatır, uygulama MSSQL'e bağlanır; çıkan hata da alakasız görünür.
#    Çözüm kuralı DatabaseProviderResolver ile birebir aynı tutulmalı.
# ---------------------------------------------------------------------------
Write-Step "Veritabanı sağlayıcısı okunuyor"
$providerRaw = $null
$connStrings = @{}
foreach ($file in @('appsettings.json', 'appsettings.Development.json', 'appsettings.secrets.json')) {
    $cfgPath = Join-Path $webProj $file
    if (-not (Test-Path $cfgPath)) { continue }
    $cfg = Get-Content $cfgPath -Raw | ConvertFrom-Json
    # Sonraki dosya öncekini ezer — ABP config önceliği (secrets en üstte).
    if ($cfg.Database.Provider) { $providerRaw = $cfg.Database.Provider }
    if ($cfg.ConnectionStrings) {
        foreach ($entry in $cfg.ConnectionStrings.PSObject.Properties) { $connStrings[$entry.Name] = $entry.Value }
    }
}

# DatabaseProviderResolver.Resolve: büyük/küçük harf duyarsız; eksik/geçersizse PostgreSql.
$provider = switch -Regex ($providerRaw) {
    '^SqlServer$'  { 'SqlServer';  break }
    '^PostgreSql$' { 'PostgreSql'; break }
    default        { 'PostgreSql' }
}
if ($providerRaw -and $providerRaw -ne $provider) {
    Write-Warning "Database:Provider değeri '$providerRaw' tanınmadı; uygulama gibi '$provider' varsayılıyor."
}
# DatabaseProviderResolver.ResolveConnectionString: ConnectionStrings:{Provider} ?? Default
$connStr = $connStrings[$provider]
if (-not $connStr) { $connStr = $connStrings['Default'] }
Write-Host "    Database:Provider = $provider" -ForegroundColor Green

if ($provider -eq 'SqlServer') {
    # MSSQL Windows servisi olarak kurulu (StartType=Automatic) → normalde boot'ta
    # kendi kalkar. DİKKAT: Postgres'teki gibi PORT YOKLAMASI YAPMA — TCP/IP kapalı,
    # uygulama shared memory ile bağlanır ve netstat'ta 1433 HİÇ görünmez; port
    # yoklaması sağlam kurulumu "kapalı" sanır. Tek geçerli kanıt: fiilen bağlanmak.
    Write-Step "SQL Server kontrol ediliyor"
    if (-not $connStr) { throw "SqlServer bağlantı dizisi bulunamadı (ConnectionStrings:SqlServer / Default)." }
    $csb      = New-Object System.Data.SqlClient.SqlConnectionStringBuilder($connStr)
    $instance = $csb.DataSource
    $database = $csb.InitialCatalog
    # Varsayılan örnek → MSSQLSERVER; adlandırılmış örnek (localhost\X) → MSSQL$X
    $svcName  = if ($instance -match '\\(.+)$') { 'MSSQL$' + $Matches[1] } else { 'MSSQLSERVER' }

    $svc = Get-Service -Name $svcName -ErrorAction SilentlyContinue
    if (-not $svc) { throw "SQL Server servisi bulunamadı: $svcName  (bağlantı dizisindeki sunucu: $instance)" }
    if ($svc.Status -ne 'Running') {
        Write-Host "    Servis '$svcName' durumu: $($svc.Status) — başlatılıyor..."
        try {
            Start-Service -Name $svcName
            (Get-Service -Name $svcName).WaitForStatus('Running', '00:00:30')
        } catch {
            throw "Servis '$svcName' başlatılamadı: $($_.Exception.Message)  (yönetici hakkıyla çalışan bir PowerShell gerekebilir.)"
        }
        Write-Host "    Servis başlatıldı."
    }

    # Servisin 'Running' olması BAĞLANABİLDİĞİM anlamına gelmez; bağlantıyı sına.
    if (Get-Command sqlcmd -ErrorAction SilentlyContinue) {
        & sqlcmd -S $instance -d $database -E -C -b -l 15 -h -1 -Q "SET NOCOUNT ON; SELECT 1" | Out-Null
        if ($LASTEXITCODE -ne 0) {
            throw "Servis çalışıyor ama '$database' veritabanına bağlanılamadı (sqlcmd çıkış kodu $LASTEXITCODE). Ağır build sırasında MSSQL login zaman aşımı verebilir — yük düşünce yeniden dene."
        }
        Write-Host "    SQL Server hazır — '$database' bağlantısı doğrulandı." -ForegroundColor Green
    } else {
        Write-Warning "sqlcmd bulunamadı; yalnız servis durumu doğrulandı, bağlantı fiilen sınanmadı."
    }
}
else {
    # PostgreSQL servis olarak kayıtlı DEĞİL ve PATH'te yok → gerekirse pg_ctl ile başlat.
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
