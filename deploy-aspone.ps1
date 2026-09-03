# Nahraje web na ASPone hosting pres FTP (a umi i presunout jiz nahrane soubory do spravne slozky).
# Spusteni:  powershell -ExecutionPolicy Bypass -File .\deploy-aspone.ps1
# Heslo zada uzivatel az pri spusteni - nikde neni ulozene.

$Server = "193.105.158.197"
$User = "helion.cz"

$pw = Read-Host -Prompt "FTP heslo (z e-mailu od ASPone)"
if (-not $pw) { Write-Host "Bez hesla to nejde."; exit 1 }
$repo = Split-Path -Parent $MyInvocation.MyCommand.Path

function Get-FtpList($path) {
    $out = & curl.exe -sS --connect-timeout 20 --retry 3 --list-only -u "${User}:$pw" "ftp://$Server/$path"
    if ($LASTEXITCODE -ne 0) { return $null }
    return @($out | Where-Object { $_ -and $_ -ne "." -and $_ -ne ".." })
}

$root = Get-FtpList ""
if ($null -eq $root) { Write-Host "Nepodarilo se pripojit - zkontroluj heslo/pripojeni."; exit 1 }
Write-Host "`nObsah FTP rootu:  $($root -join ', ')"

# najit webovou slozku (ASPone byva wwwroot / www / slozka domeny)
$RemoteDir = ""
foreach ($cand in @("wwwroot", "www", "web", "httpdocs", "helion.cz", "domains")) {
    if ($root -contains $cand) {
        $RemoteDir = "$cand/"
        $sub = Get-FtpList $RemoteDir
        Write-Host "Obsah '$cand':  $($sub -join ', ')"
        foreach ($c2 in @("wwwroot", "www", "web", "httpdocs")) {
            if ($sub -contains $c2) { $RemoteDir = "$cand/$c2/"; break }
        }
        break
    }
}
if ($RemoteDir) { Write-Host "`nWebova slozka vypada na: '$RemoteDir'" }
else { Write-Host "`nZadnou znamou webovou slozku jsem v rootu nenasel." }
$vlastni = Read-Host "Cilova slozka [Enter = '$RemoteDir', nebo napis jinou, napr. wwwroot/]"
if ($vlastni) { $RemoteDir = $vlastni.TrimStart('/').TrimEnd('/') + '/' }

# co budeme nahravat / presouvat
$exclude = '\\\.git($|\\)|\\\.claude($|\\)|\\\.github($|\\)|\.gitattributes$|deploy-aspone\.ps1$|NASAZENI-ASPONE\.md$|README\.md$|_upload\.cfg$'
$files = Get-ChildItem -Path $repo -Recurse -File | Where-Object { $_.FullName -notmatch $exclude }
$topLevel = $files | ForEach-Object { ($_.FullName.Substring($repo.Length + 1) -split '\\')[0] } | Sort-Object -Unique

$uzNahrane = @($topLevel | Where-Object { $root -contains $_ })
$vCili = @()
if ($RemoteDir) { $cil = Get-FtpList $RemoteDir; $vCili = @($topLevel | Where-Object { $cil -contains $_ }) }
Write-Host ""
if ($uzNahrane.Count -gt 3) { Write-Host "V rootu FTP je nahrany web ($($uzNahrane.Count) polozek) - 'p' ho jen presune do '$RemoteDir'." }
if ($vCili.Count -gt 3) { Write-Host "Ve webove slozce '$RemoteDir' uz web je ($($vCili.Count) polozek). Kdyz web hlasi 401 Unauthorized, zvol 's': smaze ho na serveru a nahraje znovu (opravi prava)." }
$akce = Read-Host "p = presunout z rootu, n = nahrat vse znovu, s = smazat ve webove slozce a nahrat znovu, x = konec"
if ($akce -eq "x") { exit 0 }

if ($akce -eq "s") {
    # smazat na serveru presne to, co jsme nahrali (soubory, pak slozky odspodu) - v davkach kvuli delce prikazove radky
    $rels = $files | ForEach-Object { $_.FullName.Substring($repo.Length + 1).Replace('\', '/') }
    $dirs = $rels | ForEach-Object { $d = Split-Path $_ -Parent; while ($d) { $d.Replace('\', '/'); $d = Split-Path $d -Parent } } |
        Sort-Object -Unique | Sort-Object { ($_ -split '/').Count } -Descending
    $cmds = @($rels | ForEach-Object { "*DELE $RemoteDir$_" }) + @($dirs | ForEach-Object { "*RMD $RemoteDir$_" })
    Write-Host "Mazu $($rels.Count) souboru a $($dirs.Count) slozek na serveru..."
    for ($i = 0; $i -lt $cmds.Count; $i += 120) {
        $q = @(); foreach ($c in $cmds[$i..([Math]::Min($i + 119, $cmds.Count - 1))]) { $q += @("-Q", $c) }
        & curl.exe -sS --connect-timeout 20 -u "${User}:$pw" --list-only @q "ftp://$Server/$RemoteDir" 2>$null | Out-Null
    }
    $akce = "n"
}

if ($akce -eq "p") {
    # presun na serveru pres FTP prikazy RNFR/RNTO (jedna session)
    $q = @()
    foreach ($t in $uzNahrane) { $q += @("-Q", "RNFR $t", "-Q", "RNTO $RemoteDir$t") }
    & curl.exe -sS --connect-timeout 20 -u "${User}:$pw" --list-only @q "ftp://$Server/$RemoteDir" | Out-Null
    if ($LASTEXITCODE -ne 0) { Write-Host "Presun se nepovedl cely - spust skript znovu a zvol 'n' (nahrat znovu)."; exit 1 }
    Write-Host "Presunuto: $($uzNahrane -join ', ')"
} else {
    $cfg = Join-Path $repo "_upload.cfg"
    $lines = foreach ($f in $files) {
        $rel = $f.FullName.Substring($repo.Length + 1) -replace '\\', '/'
        'upload-file = "' + ($f.FullName -replace '\\', '/') + '"'
        'url = "ftp://' + $Server + '/' + $RemoteDir + $rel + '"'
    }
    [IO.File]::WriteAllLines($cfg, $lines)  # UTF-8 bez BOM
    Write-Host "Nahravam $($files.Count) souboru do '$RemoteDir' (pri chybe az 8 pokusu)...`n"
    & curl.exe -sS --ftp-create-dirs --connect-timeout 20 --retry 8 --retry-delay 3 --retry-all-errors `
        -u "${User}:$pw" -K $cfg --write-out "OK  %{url_effective}`n"
    $rc = $LASTEXITCODE
    Remove-Item $cfg -ErrorAction SilentlyContinue
    if ($rc -ne 0) { Write-Host "`ncurl skoncil s chybou ($rc) - spust skript jeste jednou, dokonci to." }
    else { Write-Host "`nHotovo bez chyb." }
}
Write-Host "`nZkontroluj web na: http://helion.cz.windows12.aspone.cz/"
