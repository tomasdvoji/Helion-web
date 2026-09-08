#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
HELION.CZ — generátor sitemap.xml z repozitáře webu

Použití:
    py -3 tools/sitemap.py .

Zapíše sitemap.xml do kořene webu. Pustit po každém přidání nebo
přejmenování stránky — v CI to hlídá .github/workflows/kontrola.yml,
který ohlásí, když se vygenerovaná sitemapa liší od té v repu.

Skript patří do repozitáře webu schválně: sitemap.xml o sobě tvrdí,
že ji generuje, a kdyby ležel jinde, nikdo by ho nenašel a seznam
stránek by se tiše rozešel se skutečností.

Proč skript a ne ruční seznam: web má 71 stránek, z toho 55 článků
v clanky/. Ručně udržovaný seznam by po druhém článku přestal sedět
a nikdo by si toho nevšiml — chybějící stránka v sitemapě se nijak
neprojeví, jen se hůř indexuje.

lastmod bere z gitu, ne ze souborového systému. Datum souboru se změní
při každém checkoutu, datum commitu je to, kdy se obsah opravdu měnil.
"""

import io
import os
import subprocess
import sys

# konzole na Windows jede v cp1250 a rozsype diakritiku ve výpisu
try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

# priorita podle role stránky; články dostanou 0.6, zbytek 0.5
PRIO = {
    "index.html": "1.0",
    "poptavka.html": "0.9",
    "konfigurator.html": "0.9",
    "produkty.html": "0.9",
    "krok-za-krokem.html": "0.7",
    "reference.html": "0.7",
    "kalkulacka.html": "0.7",
    "odhad-produkce.html": "0.7",
    "podpora.html": "0.7",
    "kontakt.html": "0.6",
    "caste-dotazy.html": "0.6",
    "spotovky.html": "0.5",
    "aplikace.html": "0.5",
    "manualy.html": "0.5",
    "novinky.html": "0.5",
    "gdpr.html": "0.2",
}

ZALOZNI_DATUM = "2026-09-04"   # nasazení nového webu na ASPone


def datum(repo, rel):
    try:
        d = subprocess.run(
            ["git", "-C", repo, "log", "-1", "--format=%cs", "--", rel],
            capture_output=True, text=True, timeout=20,
        ).stdout.strip()
        return d or ZALOZNI_DATUM
    except Exception:
        return ZALOZNI_DATUM


def main():
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    repo = os.path.abspath(sys.argv[1])
    if not os.path.exists(os.path.join(repo, "index.html")):
        raise SystemExit("V %s není index.html — je to opravdu kořen webu?" % repo)

    koren, clanky = [], []
    for slozka, pods, soubory in os.walk(repo):
        pods[:] = [d for d in pods if d not in (".git", "node_modules", ".github")]
        for f in sorted(soubory):
            if not f.endswith(".html"):
                continue
            rel = os.path.relpath(os.path.join(slozka, f), repo).replace(os.sep, "/")
            if rel in ("404.html", "500.html"):
                continue          # chybové stránky mají noindex
            (clanky if rel.startswith("clanky/") else koren).append(rel)

    out = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        "<!-- HELION.CZ — sitemap. Generováno z repozitáře Helion-web.",
        "     %d stránek: %d v kořeni + %d článků v clanky/." % (len(koren) + len(clanky), len(koren), len(clanky)),
        "     lastmod = datum posledního commitu, který se souboru dotkl.",
        "     Adresy jsou www — kanonická varianta podle web.config.",
        "     Generuje se skriptem tools/sitemap.py, ručně needitovat. -->",
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]

    poradi = sorted(koren, key=lambda r: (-float(PRIO.get(r, "0.5")), r)) + sorted(clanky)
    for rel in poradi:
        loc = "https://www.helion.cz/" + ("" if rel == "index.html" else rel)
        prio = PRIO.get(rel, "0.6" if rel.startswith("clanky/") else "0.5")
        out += [
            "  <url>",
            "    <loc>%s</loc>" % loc,
            "    <lastmod>%s</lastmod>" % datum(repo, rel),
            "    <priority>%s</priority>" % prio,
            "  </url>",
        ]
    out.append("</urlset>")

    # Do kořene webu, ne vedle skriptu. Dokud skript ležel mimo repozitář,
    # dávalo "vedle sebe" smysl; teď je v tools/ a sitemapa patří tam,
    # odkud si ji vyzvedne vyhledávač — vedle robots.txt.
    cil = os.path.join(repo, "sitemap.xml")
    io.open(cil, "w", encoding="utf-8", newline="\n").write("\n".join(out) + "\n")
    print("sitemap.xml: %d adres (%d v kořeni + %d článků)" % (len(koren) + len(clanky), len(koren), len(clanky)))
    print("zapsáno do %s" % cil)


if __name__ == "__main__":
    main()
