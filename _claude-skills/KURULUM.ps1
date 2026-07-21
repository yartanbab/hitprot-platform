# =============================================================================
#  Apya.Platform — Claude skill kurulumu
#  Repo kökünde çalıştır:  .\_claude-skills\KURULUM.ps1
# =============================================================================

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

Write-Host "`n== 1) Skill'ler .claude\skills altina tasiniyor ==" -ForegroundColor Cyan

$hedef = Join-Path $root ".claude\skills"
New-Item -ItemType Directory -Force -Path $hedef | Out-Null

Get-ChildItem -Path (Join-Path $root "_claude-skills") -Directory | ForEach-Object {
    $dst = Join-Path $hedef $_.Name
    Copy-Item -Path $_.FullName -Destination $hedef -Recurse -Force
    Write-Host "   + $($_.Name)" -ForegroundColor Green
}

Write-Host "`n== 2) settings.local.json izinleri genisletiliyor ==" -ForegroundColor Cyan

$ayarYolu = Join-Path $root ".claude\settings.local.json"
$ayar = Get-Content $ayarYolu -Raw | ConvertFrom-Json

$yeniIzinler = @(
    "Bash(git status *)",
    "Bash(git diff *)",
    "Bash(git worktree *)",
    "Bash(dotnet test *)",
    "Bash(dotnet restore *)",
    "Bash(dotnet run --project src/Apya.Platform.DbMigrator*)",
    "Bash(abp install-libs*)"
)

$mevcut = [System.Collections.ArrayList]@($ayar.permissions.allow)
foreach ($izin in $yeniIzinler) {
    if ($mevcut -notcontains $izin) {
        [void]$mevcut.Add($izin)
        Write-Host "   + $izin" -ForegroundColor Green
    }
}
$ayar.permissions.allow = $mevcut.ToArray()
$ayar | ConvertTo-Json -Depth 10 | Set-Content $ayarYolu -Encoding UTF8

Write-Host "`n== 3) Worktree durumu (SILINMEZ - sadece rapor) ==" -ForegroundColor Cyan

$wtYolu = Join-Path $root ".claude\worktrees"
if (Test-Path $wtYolu) {
    Get-ChildItem $wtYolu -Directory | ForEach-Object {
        $boyut = (Get-ChildItem $_.FullName -Recurse -File -ErrorAction SilentlyContinue |
                  Measure-Object -Property Length -Sum).Sum / 1MB
        Write-Host ("   {0,-45} {1,8:N0} MB" -f $_.Name, $boyut) -ForegroundColor Yellow
    }
    Write-Host "`n   Bunlari incele; isi bitenler icin:" -ForegroundColor Gray
    Write-Host "     git worktree list" -ForegroundColor Gray
    Write-Host "     git worktree remove .claude\worktrees\<ad>" -ForegroundColor Gray
    Write-Host "     git worktree prune" -ForegroundColor Gray
}

Write-Host "`n== 4) Hazirlik klasoru temizligi ==" -ForegroundColor Cyan
Write-Host "   Skill'ler tasindi. Bu klasoru silebilirsin:" -ForegroundColor Gray
Write-Host "     Remove-Item -Recurse -Force _claude-skills" -ForegroundColor Gray

Write-Host "`nTamam. Claude Code'u yeniden baslat, /doctor ile skill'leri gor.`n" -ForegroundColor Green
