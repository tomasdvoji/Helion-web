#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Kontrola SEO a struktury webu. Vrací nenulový kód, když něco nesedí.

    py -3 tools/seo-kontrola.py .

PROČ
----
Web je statický a stránky se přidávají ručně. Vada v jedné stránce se
nijak neprojeví — nespadne build, nic nezčervená, jen se ta stránka hůř
indexuje. Tahle kontrola je proto ta jediná zpětná vazba, která existuje.

Konkrétně se to už jednou stalo: všech 55 článků mělo neuzavřený <div>
a nikdo si toho půl roku nevšiml.

CO SE KONTROLUJE
----------------
každá stránka   párování tagů, <title>, meta description, canonical,
                právě jedno <h1>, existence odkazovaných souborů
články navíc    BlogPosting schema s datePublished, Open Graph,
                neprázdný ALT hero obrázku
celý web        platný JSON-LD, sitemap odpovídá skutečným souborům,
                robots.txt odkazuje na sitemapu, žádné dva canonical
                nemíří na totéž
"""

import io
import json
import os
import re
import sys
from html.parser import HTMLParser

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

PRAZDNE = {"br", "img", "input", "meta", "link", "hr", "source", "use",
           "area", "col", "embed", "param", "track", "wbr"}
NEINDEXOVANE = {"404.html", "500.html"}


class Parovani(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.zasobnik = []
        self.chyby = []

    def handle_starttag(self, t, a):
        if t not in PRAZDNE:
            self.zasobnik.append(t)

    def handle_endtag(self, t):
        if t in PRAZDNE:
            return
        if not self.zasobnik:
            self.chyby.append(f"</{t}> bez otevření")
            return
        if self.zasobnik[-1] != t:
            self.chyby.append(f"</{t}> místo </{self.zasobnik[-1]}>")
            for i in range(len(self.zasobnik) - 1, -1, -1):
                if self.zasobnik[i] == t:
                    del self.zasobnik[i:]
                    return
            return
        self.zasobnik.pop()


class Nalezy:
    def __init__(self):
        self.polozky = []

    def pridej(self, soubor, popis):
        self.polozky.append((soubor, popis))

    def vypis(self, nazev):
        if not self.polozky:
            print(f"OK    {nazev}")
            return 0
        print(f"CHYBA {nazev} ({len(self.polozky)})")
        for s, p in self.polozky[:15]:
            print(f"        {s}: {p}")
        if len(self.polozky) > 15:
            print(f"        … a dalších {len(self.polozky) - 15}")
        return 1


def stranky(repo):
    for slozka, pods, soubory in os.walk(repo):
        pods[:] = [d for d in pods if d not in (".git", "node_modules",
                                                ".github", "tools", "media")]
        for f in sorted(soubory):
            if f.endswith(".html"):
                rel = os.path.relpath(os.path.join(slozka, f), repo)
                yield rel.replace(os.sep, "/")


def main():
    repo = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else ".")
    if not os.path.exists(os.path.join(repo, "index.html")):
        raise SystemExit(f"V {repo} není index.html — je to kořen webu?")

    vsechny = list(stranky(repo))
    clanky = [p for p in vsechny if p.startswith("clanky/")]
    print(f"kontroluji {len(vsechny)} stránek ({len(clanky)} článků)\n")

    struktura = Nalezy()
    hlavicka = Nalezy()
    schema = Nalezy()
    obrazky = Nalezy()
    odkazy = Nalezy()

    canonicaly = {}

    for rel in vsechny:
        s = io.open(os.path.join(repo, rel), encoding="utf-8").read()

        # --- struktura ---
        k = Parovani()
        k.feed(s)
        if k.chyby:
            struktura.pridej(rel, k.chyby[0])
        elif k.zasobnik:
            struktura.pridej(rel, f"neuzavřené <{k.zasobnik[-1]}>")

        # --- hlavička ---
        if not re.search(r"<title>\s*\S", s):
            hlavicka.pridej(rel, "chybí <title>")
        if not re.search(r'<meta name="description" content="\s*\S', s):
            hlavicka.pridej(rel, "chybí meta description")
        h1 = len(re.findall(r"<h1\b", s))
        if h1 != 1:
            hlavicka.pridej(rel, f"{h1} nadpisů H1 (má být právě jeden)")

        m = re.search(r'rel="canonical" href="([^"]*)"', s)
        if not m:
            if rel not in NEINDEXOVANE:
                hlavicka.pridej(rel, "chybí canonical")
        else:
            canonicaly.setdefault(m.group(1), []).append(rel)

        # --- JSON-LD ---
        for blok in re.findall(r'(?s)<script type="application/ld\+json">(.*?)</script>', s):
            try:
                json.loads(blok)
            except Exception as e:
                schema.pridej(rel, f"neplatný JSON-LD: {str(e)[:60]}")

        # --- článek navíc ---
        if rel in clanky:
            if '"BlogPosting"' not in s and '"Article"' not in s:
                schema.pridej(rel, "chybí Article/BlogPosting schema")
            elif '"datePublished"' not in s:
                schema.pridej(rel, "schema bez datePublished")
            if 'property="og:title"' not in s:
                schema.pridej(rel, "chybí Open Graph")
            hero = re.search(r'article__hero-img"><img([^>]*)>', s)
            if hero:
                alt = re.search(r'alt="([^"]*)"', hero.group(1))
                if not alt or not alt.group(1).strip():
                    obrazky.pridej(rel, "hero obrázek bez ALT")

        # --- odkazované soubory existují ---
        slozka = os.path.dirname(os.path.join(repo, rel))
        for cil in re.findall(r'(?:href|src)="([^"#?:]+)"', s):
            if cil.startswith(("http", "//", "mailto:", "tel:", "data:")):
                continue
            # Lomítko na začátku znamená kořen webu, ne kořen disku.
            # Chybová stránka 404.html tak odkazuje záměrně — musí
            # fungovat i z podsložky /clanky/.
            zaklad = repo if cil.startswith("/") else slozka
            plna = os.path.normpath(os.path.join(zaklad, cil.lstrip("/")))
            if not os.path.exists(plna):
                odkazy.pridej(rel, f"odkaz na neexistující {cil}")

    for url, kde in canonicaly.items():
        if len(kde) > 1:
            hlavicka.pridej(", ".join(kde), f"stejný canonical {url}")

    # --- sitemap ---
    sitemap = Nalezy()
    cesta = os.path.join(repo, "sitemap.xml")
    if not os.path.exists(cesta):
        sitemap.pridej("sitemap.xml", "chybí")
    else:
        obsah = io.open(cesta, encoding="utf-8").read()
        v_mape = {u.rsplit("helion.cz/", 1)[-1] or "index.html"
                  for u in re.findall(r"<loc>([^<]+)</loc>", obsah)}
        maji_byt = {p for p in vsechny if p not in NEINDEXOVANE}
        for chybi in sorted(maji_byt - v_mape):
            sitemap.pridej("sitemap.xml", f"chybí stránka {chybi}")
        for navic in sorted(v_mape - maji_byt):
            sitemap.pridej("sitemap.xml", f"odkazuje na neexistující {navic}")

    robots = os.path.join(repo, "robots.txt")
    if not os.path.exists(robots):
        sitemap.pridej("robots.txt", "chybí")
    elif "sitemap.xml" not in io.open(robots, encoding="utf-8").read().lower():
        sitemap.pridej("robots.txt", "neodkazuje na sitemap.xml")

    spatne = 0
    spatne += struktura.vypis("struktura HTML")
    spatne += hlavicka.vypis("title, description, canonical, H1")
    spatne += schema.vypis("Article schema a Open Graph")
    spatne += obrazky.vypis("ALT hero obrázků")
    spatne += odkazy.vypis("odkazy na existující soubory")
    spatne += sitemap.vypis("sitemap a robots.txt")

    print()
    if spatne:
        print(f"NEPROŠLO — {spatne} skupin nálezů")
        return 1
    print("Všechno v pořádku.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
