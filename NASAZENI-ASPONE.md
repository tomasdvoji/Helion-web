# Nasazení webu na ASPone (helion.cz)

Web je statický (žádná databáze, žádný WordPress) – stačí nahrát soubory přes FTP a pak přesměrovat doménu.

## Krok 1 – nahrání souborů (FTP)

V PowerShellu ve složce webu spusť:

```
powershell -ExecutionPolicy Bypass -File .\deploy-aspone.ps1
```

Skript se zeptá na FTP heslo (je v e-mailu od ASPone), ukáže obsah FTP a po potvrzení nahraje
všech ~420 souborů (~283 MB, chvíli to potrvá). Nic instalovat nemusíš – používá vestavěný curl.

> Kdyby ti byl milejší program s okýnkem: nainstaluj **FileZilla** (filezilla-project.org),
> připoj se na server `193.105.158.197`, login `helion.cz` + heslo z e-mailu,
> a přetáhni tam celý obsah složky webu (kromě `.git`).

## Krok 2 – kontrola na zkušební adrese

Otevři **http://helion.cz.windows12.aspone.cz/** a proklikej web (úvod, produkty, konfigurátor,
články, manuály). Tohle je tvůj web na novém hostingu, ještě na zkušební adrese – ostrý web to nijak neovlivňuje.

Kdyby se ukázal jen prázdný výpis / chyba: soubory možná patří do podsložky (např. `wwwroot`).
Skript ti na začátku vypsal obsah FTP – nastav v `deploy-aspone.ps1` proměnnou `$RemoteDir` a spusť znovu.

## Krok 3 – přesměrování domény (až budeš spokojený!)

Tímhle krokem se starý web vypne a začne se ukazovat nový. Dělá se tam, kde je spravovaná
doména helion.cz (registrátor / správce DNS – tam, kde se platí doména).

Změň **pouze A záznamy**:

| Záznam | Typ | Hodnota |
|---|---|---|
| `helion.cz` (@) | A | 193.105.158.197 |
| `www.helion.cz` | A | 193.105.158.197 |

**NEMĚNIT a NEMAZAT:**
- **MX záznamy** (jinak přestanou chodit e-maily @helion.cz!),
- záznam pro **eshop.helion.cz** (e-shop běží jinde a má běžet dál),
- ostatní záznamy (TXT/SPF apod.).

Změna se projeví do pár hodin (podle TTL). Starý web/WordPress zůstane u původního
poskytovatele netknutý – kdyby něco, stačí A záznamy vrátit zpět.

## Krok 4 – HTTPS

Po přesměrování domény zapni v klientské sekci ASPone certifikát (Let's Encrypt bývá zdarma)
pro helion.cz + www.helion.cz, ať web běží na https. Kdyby nešel zapnout, napiš podpoře ASPone.

## Co už je vyřešené

- Web hotlinkoval 341 obrázků a PDF ze starého webu (`www.helion.cz/wp-content/…`) – po přesměrování
  domény by zmizely. Všechny jsou teď stažené v `media/wp/` a odkazy přepsané na lokální.
- Aktualizace webu do budoucna = znovu spustit `deploy-aspone.ps1` (nahraje vše znovu).
