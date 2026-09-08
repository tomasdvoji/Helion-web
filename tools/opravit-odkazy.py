#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Opraví odkazy na staré wordpressové adresy /novinky/....

    py -3 tools/opravit-odkazy.py .

PROČ
----
Články mezi sebou odkazují adresami ze starého WordPressu
(/novinky/fotovoltaika/solarni-elektrarna/). Ty na novém webu
neexistují — čtenář skončí na chybové stránce a vyhledávač počítá
odkaz jako rozbitý.

CO SE S NIMI DĚLÁ
-----------------
Kde na nový web existuje odpovídající článek, odkaz se přesměruje.
Počítají se i synonyma: "solární panel" a "fotovoltaický panel" je
totéž, stejně jako "fotovoltaická elektrárna" a "solární elektrárna".

Kde odpovídající článek NENÍ (solární kolektor, bojler, ohřev,
klimatizace, tepelné čerpadlo), odkaz se zruší a zůstane jen text.
Nasměrovat ho někam "podobně" by čtenáře poslalo na stránku, která
o tom není — mrtvý odkaz je špatný, ale podvržený cíl horší.
"""

import io
import os
import re
import sys

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

# stará adresa (bez /novinky/ a bez lomítek) -> článek na novém webu
NAHRADIT = {
    "fotovoltaicky-panel": "fotovoltaicky-panel.html",
    "solarni-panel": "fotovoltaicky-panel.html",          # totéž jinými slovy
    "fotovoltaika-s-bateriemi": "fotovoltaika-s-bateriemi.html",
    "hybridni-elektrarna": "hybridni-elektrarna.html",
    "ostrovni-elektrarna": "ostrovni-elektrarna.html",
    "solarni-baterie": "solarni-baterie.html",
    "solarni-elektrarna": "solarni-elektrarna.html",
    "fotovoltaicka-elektrarna": "solarni-elektrarna.html",  # totéž jinými slovy
}

# na tohle článek není — odkaz zrušit, text nechat
ZRUSIT = {"solarni-bojler", "solarni-kolektor", "solarni-ohrev",
          "klimatizace-trutnov", "tepelne-cerpadlo"}


def main():
    repo = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else ".")
    nanecisto = "--nanecisto" in sys.argv
    clanky = os.path.join(repo, "clanky")

    presmerovano = zruseno = 0
    neznamé = set()

    for f in sorted(os.listdir(clanky)):
        if not f.endswith(".html"):
            continue
        cesta = os.path.join(clanky, f)
        s = io.open(cesta, encoding="utf-8").read()
        puvodni = s

        # 1) přesměrovat, na co článek existuje
        def prepsat(m):
            nonlocal presmerovano
            slug = m.group(1).rstrip("/").rsplit("/", 1)[-1]
            if slug in NAHRADIT:
                presmerovano += 1
                return f'href="{NAHRADIT[slug]}"'
            if slug not in ZRUSIT:
                neznamé.add(slug)
            return m.group(0)

        s = re.sub(r'href="(/novinky/[^"]+)"', prepsat, s)

        # 2) zrušit odkaz tam, kde cíl neexistuje — text zůstane
        def ododkazovat(m):
            nonlocal zruseno
            slug = m.group(1).rstrip("/").rsplit("/", 1)[-1]
            if slug in ZRUSIT:
                zruseno += 1
                return m.group(2)
            return m.group(0)

        s = re.sub(r'<a[^>]*href="(/novinky/[^"]+)"[^>]*>(.*?)</a>',
                   ododkazovat, s, flags=re.S)

        if s != puvodni and not nanecisto:
            io.open(cesta, "w", encoding="utf-8", newline="\n").write(s)

    print(f"přesměrováno na existující článek: {presmerovano}")
    print(f"zrušeno (text zůstal):             {zruseno}")
    if neznamé:
        print("\nnezpracované adresy — dopsat do skriptu:")
        for s in sorted(neznamé):
            print("  ", s)

    zbyva = 0
    for f in sorted(os.listdir(clanky)):
        if f.endswith(".html"):
            obsah = io.open(os.path.join(clanky, f), encoding="utf-8").read()
            zbyva += len(re.findall(r'href="/novinky/', obsah))
    print(f"\nzbývajících odkazů na /novinky/: {zbyva}")
    return 1 if zbyva else 0


if __name__ == "__main__":
    sys.exit(main())
