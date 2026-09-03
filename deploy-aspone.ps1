# Nahraje web na ASPone hosting pres FTP.
# Spusteni:  powershell -ExecutionPolicy Bypass -File .\deploy-aspone.ps1
# Heslo zada uzivatel az pri spusteni - nikde neni ulozene.

$Server = "193.105.158.197"   # IP z e-mailu od ASPone (jmeno helion.cz zatim miri na stary hosting)
$User = "helion.cz"
$RemoteDir = ""               # kdyz web po nahrani nebezi, nastav podslozku z FTP (napr. "wwwroot/")

$pw = Read-Host -Prompt "FTP heslo (z e-mailu od ASPone)"
if (-not $pw) { Write-Host "Bez hesla to nejde."; exit 1 }

$repo = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "`n--- Obsah FTP rootu (pro kontrolu, kam se nahrava): ---"
& curl.exe -sS --list-only -u "${User}:$pw" "ftp://$Server/"
if ($LASTEXITCODE -ne 0) { Write-Host "Nepodarilo se pripojit - zkontroluj heslo/pripojeni."; exit 1 }
$go = Read-Host "`nNahrat web do 'ftp://$Server/$RemoteDir' ? (a = ano)"
if ($go -ne "a") { exit 0 }

# ponytail: vylucujeme jen to, co na web nepatri
$exclude = '\\\.git($|\\)|\\\.claude($|\\)|\\\.github($|\\)|\.gitattributes$|deploy-aspone\.ps1$|NASAZENI-ASPONE\.md$|README\.md$'
$files = Get-ChildItem -Path $repo -Recurse -File | Where-Object { $_.FullName -notmatch $exclude }
Write-Host "Souboru k nahrani: $($files.Count)`n"

$i = 0; $err = 0
foreach ($f in $files) {
    $i++
    $rel = $f.FullName.Substring($repo.Length + 1) -replace '\\', '/'
    & curl.exe -sS --ftp-create-dirs -u "${User}:$pw" -T $f.FullName "ftp://$Server/$RemoteDir$rel"
    if ($LASTEXITCODE -ne 0) { $err++; Write-Host "[$i/$($files.Count)] CHYBA  $rel" }
    else { Write-Host "[$i/$($files.Count)] OK  $rel" }
}
Write-Host "`nHotovo. Chyb: $err"
Write-Host "Zkontroluj web na: http://helion.cz.windows12.aspone.cz/"
