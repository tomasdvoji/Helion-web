"""
Vygeneruje js/mapa-zakazek-data.js pro mapku zakázek na úvodní stránce.

Vstup (mimo repozitář, obsahuje jména zákazníků):
    typed.json   — řádky evidence {year, location: {lat, lon, ...}, name, ...}
    kraje.json   — hranice krajů ČR (GeoJSON, ČÚZK / siwekm, CC BY 4.0)

Na web jde JEN: obrys ČR s kraji a u každé zakázky rok a poloha obce
posunutá náhodně o 1–3 km (deterministicky podle pořadí). Žádná jména,
čísla zakázek ani adresy.

    python tools/mapa-zakazek.py <složka s typed.json a kraje.json>
"""

import json
import math
import random
import sys
from pathlib import Path

SIRKA = 1000.0
SIROKA_STRED = 49.8
KX = math.cos(math.radians(SIROKA_STRED))


def zjednodusit(body, eps):
    if len(body) < 3:
        return body
    a, b = body[0], body[-1]
    dx, dy = b[0] - a[0], b[1] - a[1]
    den = dx * dx + dy * dy
    nej, idx = 0.0, 0
    for i, (x, y) in enumerate(body[1:-1], 1):
        t = max(0, min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / den)) if den else 0
        d = (x - a[0] - t * dx) ** 2 + (y - a[1] - t * dy) ** 2
        if d > nej:
            nej, idx = d, i
    if nej > eps * eps:
        return zjednodusit(body[:idx + 1], eps)[:-1] + zjednodusit(body[idx:], eps)
    return [a, b]


def main(slozka: Path) -> None:
    geo = json.loads((slozka / "kraje.json").read_text(encoding="utf-8"))
    radky = json.loads((slozka / "typed.json").read_text(encoding="utf-8"))

    prstence = []
    for f in geo["features"]:
        g = f["geometry"]
        for poly in ([g["coordinates"]] if g["type"] == "Polygon" else g["coordinates"]):
            prstence.append(zjednodusit(poly[0], 0.012))
    lon = [p[0] for r in prstence for p in r]
    lat = [p[1] for r in prstence for p in r]
    x0, y1 = min(lon), max(lat)
    meritko = SIRKA / ((max(lon) - x0) * KX)
    vyska = round((y1 - min(lat)) * meritko) + 1

    def xy(lo, la):
        return round((lo - x0) * KX * meritko, 1), round((y1 - la) * meritko, 1)

    cesta = ""
    for r in prstence:
        body = [xy(*p) for p in r]
        cesta += "M" + "L".join(f"{x:g} {y:g}" for x, y in body) + "Z"

    rng = random.Random(2003)
    body = []
    for r in sorted((r for r in radky if r.get("location")), key=lambda r: r["year"]):
        l = r["location"]
        uhel, km = rng.uniform(0, 2 * math.pi), rng.uniform(1, 3)
        la = l["lat"] + km * math.sin(uhel) / 111.32
        lo = l["lon"] + km * math.cos(uhel) / (111.32 * math.cos(math.radians(l["lat"])))
        x, y = xy(lo, la)
        body += [x, y, r["year"] - 2003]

    vystup = Path(__file__).resolve().parent.parent / "js" / "mapa-zakazek-data.js"
    vystup.write_text(
        "/* Vygenerováno tools/mapa-zakazek.py. Poloha obce ± 1–3 km, bez jmen a adres.\n"
        "   Hranice krajů: ČÚZK / siwekm, CC BY 4.0. */\n"
        f"window.HELION_MAPA={{w:{SIRKA:g},h:{vyska},kraje:{json.dumps(cesta)},"
        f"body:{json.dumps(body, separators=(',', ':'))}}};\n",
        encoding="utf-8")
    print(f"{len(body) // 3} bodů, {len(prstence)} obrysů, výška {vyska}, {vystup.stat().st_size} B")


if __name__ == "__main__":
    main(Path(sys.argv[1]))
