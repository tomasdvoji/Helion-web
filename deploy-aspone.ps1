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
& curl.exe -sS --connect-timeout 20 --retry 3 --list-only -u "${User}:$pw" "ftp://$Server/"
if ($LASTEXITCODE -ne 0) { Write-Host "Nepodarilo se pripojit - zkontroluj heslo/pripojeni."; exit 1 }
$go = Read-Host "`nNahrat web do 'ftp://$Server/$RemoteDir' ? (a = ano)"
if ($go -ne "a") { exit 0 }

# ponytail: vylucujeme jen to, co na web nepatri
$exclude = '\\\.git($|\\)|\\\.claude($|\\)|\\\.github($|\\)|\.gitattributes$|deploy-aspone\.ps1$|NASAZENI-ASPONE\.md$|README\.md$|_upload\.cfg$'
$files = Get-ChildItem -Path $repo -Recurse -File | Where-Object { $_.FullName -notmatch $exclude }
Write-Host "Souboru k nahrani: $($files.Count)"

# vsechny soubory v JEDNOM curl behu (znovupouziva FTP spojeni, server nezahlcujeme
# novymi spojenimi) + automaticke opakovani pri vypadku
$cfg = Join-Path $repo "_upload.cfg"
$lines = foreach ($f in $files) {
    $rel = $f.FullName.Substring($repo.Length + 1) -replace '\\', '/'
    'upload-file = "' + ($f.FullName -replace '\\', '/') + '"'
    'url = "ftp://' + $Server + '/' + $RemoteDir + $rel + '"'
}
[IO.File]::WriteAllLines($cfg, $lines)  # UTF-8 bez BOM (BOM by rozbil prvni radek configu)

Write-Host "Nahravam (jeden prenos za druhym, pri chybe az 8 pokusu)...`n"
& curl.exe -sS --ftp-create-dirs --connect-timeout 20 --retry 8 --retry-delay 3 --retry-all-errors `
    -u "${User}:$pw" -K $cfg --write-out "OK  %{url_effective}`n"
$rc = $LASTEXITCODE
Remove-Item $cfg -ErrorAction SilentlyContinue

if ($rc -ne 0) {
    Write-Host "`ncurl skoncil s chybou ($rc) - spust skript jeste jednou, dokonci to (soubory se prepisuji)."
} else {
    Write-Host "`nHotovo bez chyb."
}
Write-Host "Zkontroluj web na: http://helion.cz.windows12.aspone.cz/"
