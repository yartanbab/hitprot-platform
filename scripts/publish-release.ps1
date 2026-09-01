<#
.SYNOPSIS
    Plesk/IIS yayın paketi üretir: Web + DbMigrator, ikisi de self-contained win-x64.

.DESCRIPTION
    Bu betiğin varlık sebebi, geçmişte SESSİZCE bozulan adımları ölçerek kapatmaktır.
    Her doğrulama gerçekten yaşanmış bir olaya karşılık gelir:

      - self-contained unutuldu           -> sunucuda .NET runtime yok, site 500.31 / 502.5
      - abp install-libs koşmadı          -> wwwroot/libs boş, her istek 500 "Libs Folder is Missing"
      - .vite/manifest.json publish'e giremedi -> island preload'ları sessizce boşa düşer (#287)
      - Compress-Archive ile ZIP'lendi    -> girdiler ters slash'lı, Plesk yanlış açar
      - ZIP'te sarmalayıcı klasör oluştu  -> web.config site kökünde olmaz, ANCM ayağa kalkmaz

    Doğrulamalardan biri düşerse betik DURUR; yarım paket üretmez.

.PARAMETER OutputRoot
    Paketlerin yazılacağı kök klasör. Varsayılan: Masaüstünde tarihli bir klasör.

.PARAMETER SkipTests
    Test koşumunu atlar. Yalnız testleri az önce elle koşturduysan kullan.

.EXAMPLE
    .\scripts\publish-release.ps1
#>
[CmdletBinding()]
param(
    [string] $OutputRoot,
    [switch] $SkipTests
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

# --- Yollar ---------------------------------------------------------------
$RepoRoot   = Split-Path -Parent $PSScriptRoot
$WebProj    = Join-Path $RepoRoot 'src\Apya.Platform.Web\Apya.Platform.Web.csproj'
$MigProj    = Join-Path $RepoRoot 'src\Apya.Platform.DbMigrator\Apya.Platform.DbMigrator.csproj'
$LibsDir    = Join-Path $RepoRoot 'src\Apya.Platform.Web\wwwroot\libs'
$ViteMan    = Join-Path $RepoRoot 'src\Apya.Platform.Web\wwwroot\js\.vite\manifest.json'
$Tar        = Join-Path $env:SystemRoot 'System32\tar.exe'

if (-not $OutputRoot) {
    $stamp = Get-Date -Format 'yyyy-MM-dd'
    $OutputRoot = Join-Path ([Environment]::GetFolderPath('Desktop')) "Apya-Yayin-$stamp"
}

# Paket adlarına giren commit — tek doğru kaynak paketin kendisidir.
Push-Location $RepoRoot
$Sha = (& git rev-parse --short=8 HEAD).Trim()
$Dirty = (& git status --porcelain)
Pop-Location

if ($Dirty) {
    throw "Çalışma ağacı temiz değil. Paket hangi commit'ten üretildiği belirsiz olur.`n$Dirty"
}

$WebPublish = Join-Path $OutputRoot 'web-publish'
$MigPublish = Join-Path $OutputRoot 'dbmigrator-publish'
$WebZip     = Join-Path $OutputRoot "Apya-Yayin-$Sha.zip"
$MigZip     = Join-Path $OutputRoot "Apya-DbMigrator-$Sha.zip"

Write-Host ""
Write-Host "Apya yayın paketi" -ForegroundColor Cyan
Write-Host "  commit : $Sha"
Write-Host "  hedef  : $OutputRoot"
Write-Host ""

# --- 0. Ön koşullar -------------------------------------------------------
Write-Host "[0/6] Ön koşullar" -ForegroundColor Yellow

if (-not (Test-Path $LibsDir)) {
    throw "wwwroot\libs YOK. Önce 'abp install-libs' çalıştır, sonra dynamic-assets içinde 'npm ci'. Bu klasör olmadan üretilen paket her isteğe 500 döner."
}
$libCount = (Get-ChildItem -LiteralPath $LibsDir -Directory).Count
Write-Host "      wwwroot\libs      : $libCount paket"

if (-not (Test-Path $ViteMan)) {
    throw ".vite\manifest.json YOK. Island preload'ları sunucuda sessizce boşa düşer (bkz. #287)."
}
Write-Host "      .vite\manifest.json: var"

if (-not (Test-Path $Tar)) {
    throw "tar.exe bulunamadı: $Tar  (Compress-Archive KULLANMA - ters slash'lı girdi üretir.)"
}
Write-Host "      tar.exe           : var"

# --- 1. Testler -----------------------------------------------------------
if ($SkipTests) {
    Write-Host "[1/6] Testler ATLANDI (-SkipTests)" -ForegroundColor DarkYellow
} else {
    Write-Host "[1/6] Testler" -ForegroundColor Yellow
    & dotnet test (Join-Path $RepoRoot 'Apya.Platform.slnx') --nologo -v q
    if ($LASTEXITCODE -ne 0) { throw "Testler düştü. Paket üretilmedi." }
    Write-Host "      yeşil"
}

# --- 2. Temiz hedef -------------------------------------------------------
Write-Host "[2/6] Hedef klasör hazırlanıyor" -ForegroundColor Yellow
foreach ($d in @($WebPublish, $MigPublish)) {
    if (Test-Path $d) { Remove-Item -LiteralPath $d -Recurse -Force }
}
New-Item -ItemType Directory -Force -Path $OutputRoot | Out-Null

# --- 3. Publish -----------------------------------------------------------
# -r win-x64 --self-contained true ZORUNLU: sunucuda .NET runtime yok.
Write-Host "[3/6] Web publish (self-contained win-x64)" -ForegroundColor Yellow
& dotnet publish $WebProj -c Release -r win-x64 --self-contained true -o $WebPublish --nologo -v q
if ($LASTEXITCODE -ne 0) { throw "Web publish düştü." }

Write-Host "[3/6] DbMigrator publish (self-contained win-x64)" -ForegroundColor Yellow
& dotnet publish $MigProj -c Release -r win-x64 --self-contained true -o $MigPublish --nologo -v q
if ($LASTEXITCODE -ne 0) { throw "DbMigrator publish düştü." }

# --- 4. Paket doğrulamaları ----------------------------------------------
Write-Host "[4/6] Paket doğrulanıyor" -ForegroundColor Yellow

# 4a. Self-contained kanıtı: runtime pakette mi
foreach ($pair in @(@{n='Web'; p=$WebPublish}, @{n='DbMigrator'; p=$MigPublish})) {
    $core = Join-Path $pair.p 'System.Private.CoreLib.dll'
    if (-not (Test-Path $core)) {
        throw "$($pair.n) paketi framework-dependent! System.Private.CoreLib.dll yok. Sunucuda .NET runtime olmadığı için site 500.31 verir."
    }
}
Write-Host "      self-contained     : iki pakette de runtime var"

# 4b. web.config: ANCM'in çalıştıracağı yol .exe olmalı, hostingModel OutOfProcess
$webConfigPath = Join-Path $WebPublish 'web.config'
if (-not (Test-Path $webConfigPath)) { throw "web.config publish çıktısında yok." }
$webConfig = Get-Content -LiteralPath $webConfigPath -Raw
if ($webConfig -notmatch 'processPath\s*=\s*"\.\\Apya\.Platform\.Web\.exe"') {
    throw "web.config processPath .exe değil - paket framework-dependent üretilmiş olabilir."
}
if ($webConfig -match 'hostingModel\s*=\s*"InProcess"') {
    Write-Warning "web.config hostingModel=InProcess. Sunucunun ANCM'i .NET 10 self-contained'i in-process barındıramazsa 500.30/500.31 verir. Paket OutOfProcess ile çıkmalı; deploy sonrası tek tek açılır."
}
Write-Host "      web.config         : processPath .exe"

# 4c. #287: island preload manifest'i pakete girdi mi
if (-not (Test-Path (Join-Path $WebPublish 'wwwroot\js\.vite\manifest.json'))) {
    throw ".vite\manifest.json publish çıktısına GİRMEDİ (#287 regresyonu)."
}
Write-Host "      .vite\manifest.json: pakette"

# 4d. Sırlar kazara pakete girmiş olmasın
if (Test-Path (Join-Path $WebPublish 'appsettings.secrets.json')) {
    throw "appsettings.secrets.json pakete girmiş! Yerel sırlar sunucuya taşınır. csproj'daki CopyToPublishDirectory=Never bozulmuş."
}
Write-Host "      secrets            : pakette değil (doğru)"

# 4e. libs publish'e taşındı mı
$libsOut = Join-Path $WebPublish 'wwwroot\libs'
if (-not (Test-Path $libsOut)) { throw "wwwroot\libs publish çıktısında yok." }
Write-Host "      wwwroot\libs       : pakette"

# --- 5. migrate.bat (DbMigrator paketine) --------------------------------
# Şablon: sırlar BOŞ bırakılır, sunucuda elle doldurulur ve iş bitince klasör SİLİNİR.
Write-Host "[5/6] migrate.bat yazılıyor" -ForegroundColor Yellow
$migrateBat = @'
@echo off
REM ---------------------------------------------------------------------
REM  Apya.Platform - veritabani migrate + seed
REM
REM  ASAGIDAKI UC DEGERI DOLDUR, sonra Plesk > Zamanlanmis Gorevler ile
REM  bu .bat dosyasini TEK SEFERLIK calistir.
REM
REM  🔴 IS BITINCE BU KLASORU SUNUCUDAN SIL - asagida sifre duz metin durur.
REM  🔴 Basariyi cikis kodundan DEGIL, Logs\logs.txt icindeki
REM     "Successfully completed all database migrations." satirindan dogrula.
REM ---------------------------------------------------------------------
cd /d "%~dp0"

set "CONN=Server=SUNUCU;Database=VERITABANI;User Id=KULLANICI;Password=PAROLA;TrustServerCertificate=True;Encrypt=False"
set "CLIENTSECRET=BURAYA_CLIENT_SECRET"

Apya.Platform.DbMigrator.exe ^
  --Database:Provider=SqlServer ^
  --ConnectionStrings:SqlServer="%CONN%" ^
  --OpenIddict:Applications:Platform_Web:ClientSecret=%CLIENTSECRET%

echo.
echo Bitti. Simdi Logs\logs.txt dosyasini ac ve su satiri ara:
echo   "Successfully completed all database migrations."
pause
'@
Set-Content -LiteralPath (Join-Path $MigPublish 'migrate.bat') -Value $migrateBat -Encoding ascii

# --- 6. ZIP ---------------------------------------------------------------
# tar.exe kullanilir: Compress-Archive girdileri TERS SLASH ile yazar, Plesk yanlis acar.
# Sarmalayici klasor OLMAMALI - web.config site kokune dusmeli.
Write-Host "[6/6] ZIP" -ForegroundColor Yellow

function New-FlatZip {
    param([string] $SourceDir, [string] $ZipPath)

    if (Test-Path $ZipPath) { Remove-Item -LiteralPath $ZipPath -Force }
    $names = Get-ChildItem -LiteralPath $SourceDir -Force | ForEach-Object { $_.Name }
    & $Tar -a -c -f $ZipPath -C $SourceDir @names
    if ($LASTEXITCODE -ne 0) { throw "ZIP üretimi düştü: $ZipPath" }

    # Ters slash denetimi: bir tane bile varsa paket bozuktur.
    $listing = & $Tar -t -f $ZipPath
    $bad = @($listing | Where-Object { $_ -like '*\*' })
    if ($bad.Count -gt 0) {
        throw "ZIP içinde ters slash'lı $($bad.Count) girdi var - Plesk bunu yanlış açar. Örnek: $($bad[0])"
    }
    # Sarmalayıcı klasör denetimi: web paketinde web.config kökte olmalı.
    return $listing
}

$webListing = New-FlatZip -SourceDir $WebPublish -ZipPath $WebZip
if (-not ($webListing | Where-Object { $_ -eq 'web.config' })) {
    throw "ZIP kökünde web.config yok - sarmalayıcı klasör oluşmuş. ANCM ayağa kalkmaz."
}
Write-Host "      Web        : ters slash yok, web.config kökte"

$migListing = New-FlatZip -SourceDir $MigPublish -ZipPath $MigZip
if (-not ($migListing | Where-Object { $_ -eq 'migrate.bat' })) {
    throw "DbMigrator ZIP kökünde migrate.bat yok."
}
Write-Host "      DbMigrator : ters slash yok, migrate.bat kökte"

# --- Özet -----------------------------------------------------------------
$webMb = [math]::Round((Get-Item $WebZip).Length / 1MB, 1)
$migMb = [math]::Round((Get-Item $MigZip).Length / 1MB, 1)

Write-Host ""
Write-Host "Paket hazır" -ForegroundColor Green
Write-Host "  $WebZip  ($webMb MB)"
Write-Host "  $MigZip  ($migMb MB)"
Write-Host ""
Write-Host "Sıradaki adımlar için: docs/deployment/ altındaki güncel deploy-delta belgesi." -ForegroundColor Cyan
Write-Host ""
