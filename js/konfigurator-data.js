// Generováno z CN_HFVE_kalkulačka.xlsm (list Ceny, stav 2026-08).
// Pouze prodejní ceny bez DPH + ceny práce. Neupravovat ručně – přegenerovat skriptem.
const FVE_DATA = {
 "panely": [
  {
   "nazev": "Fotovoltaický panel Aiko Neostar 2S AIKO-A450-MAH54Mb 450 Wp, N-Type ABC, celočerný, SVT35557",
   "wp": 450,
   "vyska_mm": 1757,
   "sirka_mm": 1134,
   "prodej": 2206,
   "prace": 300
  },
  {
   "nazev": "Fotovoltaický panel AIKO Neostar 2S+ A500-MAH60Db 500Wp, dvojité sklo, celočerný, SVT35942",
   "wp": 500,
   "vyska_mm": 1954,
   "sirka_mm": 1134,
   "prodej": 2683,
   "prace": 320
  },
  {
   "nazev": "Fotovoltaický panel Aiko Stellar 1N+ AIKO-G650-MCH72Dw, 650Wp, dual glass, bifaciál, stříbrný rámeček",
   "wp": 650,
   "vyska_mm": 2382,
   "sirka_mm": 1134,
   "prodej": 2979,
   "prace": 350
  },
  {
   "nazev": "Fotovoltaický panel Cortex OP360M10C 360Wp, monokrystal, celooranžové provedení RAL 8004, SVT35738",
   "wp": 360,
   "vyska_mm": 1722,
   "sirka_mm": 1134,
   "prodej": 4075,
   "prace": 300
  },
  {
   "nazev": "Fotovoltaický panel Cortex OP410M54-P3-B 410Wp, monokrystal, celočerné provedení, SVT33298",
   "wp": 410,
   "vyska_mm": 1724,
   "sirka_mm": 1134,
   "prodej": 2950,
   "prace": 300
  },
  {
   "nazev": "Fotovoltaický panel Cortex OP415M54-P3-BF 415Wp, monokrystal, celočerné provedení",
   "wp": 415,
   "vyska_mm": 1724,
   "sirka_mm": 1134,
   "prodej": 2950,
   "prace": 300
  },
  {
   "nazev": "Fotovoltaický panel JA Solar JAM54D41-450/LB 450Wp, dvojité sklo, záruka 25/30 let, celočerné provedení",
   "wp": 450,
   "vyska_mm": 1762,
   "sirka_mm": 1134,
   "prodej": 1675,
   "prace": 300
  },
  {
   "nazev": "Fotovoltaický panel LONGi Hi-MO LR7-54HVH-485M 485Wp, HPBC 2.0, účinnost 23.8%, double glass, záruka 30 let, celočerný",
   "wp": 485,
   "vyska_mm": 1800,
   "sirka_mm": 1134,
   "prodej": 2625,
   "prace": 300
  },
  {
   "nazev": "Fotovoltaický panel LONGi LR7-54HVB-470M 470Wp, HPBC 2.0, záruka 25/25 let, celočerné provedení",
   "wp": 470,
   "vyska_mm": 1800,
   "sirka_mm": 1134,
   "prodej": 2554,
   "prace": 300
  },
  {
   "nazev": "Fotovoltaický panel LONGi Hi-MO X6 Max 60HTB-500M 500Wp, xBC, záruka 25/25 let, celočerné provedení",
   "wp": 500,
   "vyska_mm": 1990,
   "sirka_mm": 1134,
   "prodej": 2334,
   "prace": 300
  },
  {
   "nazev": "Fotovoltaický panel Trina Vertex S+ TSM-NEG9RC.27 445 Wp, bifaciální, monokrystal, celočerné provedení",
   "wp": 445,
   "vyska_mm": 1762,
   "sirka_mm": 1134,
   "prodej": 2104,
   "prace": 300
  },
  {
   "nazev": "Fotovoltaický panel Trina Vertex S+ TSM-NEG18R.25 505 Wp, bifaciální,  i-TOPCon, celočerné provedení",
   "wp": 505,
   "vyska_mm": 1961,
   "sirka_mm": 1134,
   "prodej": 2630,
   "prace": 320
  }
 ],
 "baterie": [
  {
   "nazev": "Bez baterie",
   "kwh_modul": 0,
   "bms": "bez BMS",
   "max_modulu_na_bms": 1,
   "prodej": 0,
   "prace": 0
  },
  {
   "nazev": "Baterie BYD Battery-Box Premium HVM 11.0",
   "kwh_modul": 11,
   "bms": "BMS BYD BCU",
   "max_modulu_na_bms": 1,
   "prodej": 103316,
   "prace": 1500
  },
  {
   "nazev": "Baterie BYD Battery-Box Premium HVM 13.8",
   "kwh_modul": 13.8,
   "bms": "BMS BYD BCU",
   "max_modulu_na_bms": 1,
   "prodej": 126012,
   "prace": 1780
  },
  {
   "nazev": "Baterie BYD Battery-Box Premium HVM 16.6",
   "kwh_modul": 16.6,
   "bms": "BMS BYD BCU",
   "max_modulu_na_bms": 1,
   "prodej": 148707,
   "prace": 2060
  },
  {
   "nazev": "Baterie BYD Battery-Box Premium HVM 19.3",
   "kwh_modul": 19.3,
   "bms": "BMS BYD BCU",
   "max_modulu_na_bms": 1,
   "prodej": 171403,
   "prace": 2330
  },
  {
   "nazev": "Baterie BYD Battery-Box Premium HVM 22.1",
   "kwh_modul": 22.1,
   "bms": "BMS BYD BCU",
   "max_modulu_na_bms": 1,
   "prodej": 194099,
   "prace": 2610
  },
  {
   "nazev": "Baterie BYD Battery-Box Premium HVM 8.3",
   "kwh_modul": 8.3,
   "bms": "BMS BYD BCU",
   "max_modulu_na_bms": 1,
   "prodej": 80620,
   "prace": 1230
  },
  {
   "nazev": "Bateriový modul DEYE BOS-G, 5.1 kWh, HV, LiFePO4 baterie, záruka 10 let, výroba Čína",
   "kwh_modul": 5.1,
   "bms": "bez BMS",
   "max_modulu_na_bms": 12,
   "prodej": 35938,
   "prace": 910
  },
  {
   "nazev": "Bateriový modul Dyness Tower 2.0 HV9637 V2, 3.55 kWh, LiFePO4 baterie, balancér na úrovni článků, záruka 10 let, výroba Čína",
   "kwh_modul": 3.55,
   "bms": "BMS Dyness BDU GEN2 - modul pro řízení a ochranu bateriových modulů",
   "max_modulu_na_bms": 6,
   "prodej": 19000,
   "prace": 755
  },
  {
   "nazev": "Bateriový modul Dyness Tower HV9637, 3.55 kWh, LiFePO4 baterie, záruka 10 let, výroba Čína",
   "kwh_modul": 3.55,
   "bms": "BMS Dyness BDU - modul pro řízení a ochranu bateriových modulů",
   "max_modulu_na_bms": 5,
   "prodej": 28875,
   "prace": 755
  },
  {
   "nazev": "Bateriový modul GoodWe Lynx Home F Plus - LX 3.28kWh, LiFePO4 baterie, záruka 10 let, výroba Čína",
   "kwh_modul": 3.28,
   "bms": "BMS Goodwe PCU - modul pro řízení a ochranu bateriových modulů včetně podstavce",
   "max_modulu_na_bms": 4,
   "prodej": 35000,
   "prace": 728
  },
  {
   "nazev": "Bateriový modul GoodWe LynxD 5kWh, LiFePO4 baterie včetně BMS, záruka 10 let, výroba Čína",
   "kwh_modul": 5,
   "bms": "BMS je již součástí bateriového modulu",
   "max_modulu_na_bms": 8,
   "prodej": 37299,
   "prace": 900
  },
  {
   "nazev": "Bateriový modul Pylontech Force H1 3.55kW, LiFePO4 baterie, záruka 10 let, provozní teplota 0 až 55C°, 8000 cyklů, výroba Čína",
   "kwh_modul": 3.55,
   "bms": "BMS Pylontech H1 - modul pro řízení a ochranu bateriových modulů",
   "max_modulu_na_bms": 7,
   "prodej": 17183,
   "prace": 755
  },
  {
   "nazev": "Bateriový modul Pylontech Force H2 3.55kW, LiFePO4 baterie, záruka 10 let, provozní teplota 0 až 55C°, 8000 cyklů, výroba Čína",
   "kwh_modul": 3.55,
   "bms": "BMS Pylontech H2 - modul pro řízení a ochranu bateriových modulů",
   "max_modulu_na_bms": 5,
   "prodej": 18328,
   "prace": 755
  },
  {
   "nazev": "Bateriový modul Pylontech Force H3 5.12kW, LiFePO4 baterie, záruka 10 let, provozní teplota -10 až +55°C, 8000 cyklů, výroba Čína",
   "kwh_modul": 5.12,
   "bms": "BMS Pylontech H3 - modul pro řízení a ochranu bateriových modulů",
   "max_modulu_na_bms": 7,
   "prodej": 21992,
   "prace": 912
  },
  {
   "nazev": "Bateriový Modul RCT Battery 1.9 (netto kapacita 1.73kW), lithiová baterie, záruka 10 let, výroba SRN",
   "kwh_modul": 1.92,
   "bms": "BMS RCT Power baterry - modul pro řízení a ochranu bateriových modulů",
   "max_modulu_na_bms": 6,
   "prodej": 14537,
   "prace": 592
  },
  {
   "nazev": "Bateriový modul SigenStor BAT 6.0, kapacita 5.84 kWh, LiFePO4 baterie, integrovaná BMS, provozní teplota -30 až +60°C, záruka 10 let, výroba Čína",
   "kwh_modul": 5.84,
   "bms": "Sigen - set pro montáž baterie na zem",
   "max_modulu_na_bms": 4,
   "prodej": 57283,
   "prace": 984
  },
  {
   "nazev": "Bateriový modul SigenStor BAT 9.0, kapacita 8.76 kWh, LiFePO4 baterie, integrovaná BMS, provozní teplota -30 až +60°C, záruka 10 let, výroba Čína",
   "kwh_modul": 8.76,
   "bms": "Sigen - set pro montáž baterie na zem",
   "max_modulu_na_bms": 4,
   "prodej": 72969,
   "prace": 1276
  },
  {
   "nazev": "Bateriový modul Solax TriplePower 5.8 kW, LiFePO4 baterie, záruka 10 let, výroba Čína",
   "kwh_modul": 5.8,
   "bms": "BMS Solax TriplePower - modul pro řízení a ochranu bateriových modulů o výkonu 5.8kWh (součást master baterie)",
   "max_modulu_na_bms": 4,
   "prodej": 48016,
   "prace": 980
  }
 ],
 "bms": [
  {
   "nazev": "bez BMS",
   "prodej": 0,
   "prace": 0
  },
  {
   "nazev": "BMS DEYE HVB750V/100A-EU, controllbox pro sestavy BOS-G, HV",
   "prodej": 20488,
   "prace": 500
  },
  {
   "nazev": "BMS Dyness BDU - modul pro řízení a ochranu bateriových modulů",
   "prodej": 18750,
   "prace": 500
  },
  {
   "nazev": "BMS Dyness BDU GEN2 - modul pro řízení a ochranu bateriových modulů",
   "prodej": 12625,
   "prace": 500
  },
  {
   "nazev": "BMS Goodwe PCU - modul pro řízení a ochranu bateriových modulů včetně podstavce",
   "prodej": 18750,
   "prace": 500
  },
  {
   "nazev": "BMS Pylontech H1 - modul pro řízení a ochranu bateriových modulů",
   "prodej": 17000,
   "prace": 500
  },
  {
   "nazev": "BMS Pylontech H2 - modul pro řízení a ochranu bateriových modulů",
   "prodej": 8410,
   "prace": 500
  },
  {
   "nazev": "BMS Pylontech H2 V2 - modul pro řízení a ochranu bateriových modulů s možnostzí rozšíření o další věže",
   "prodej": 12160,
   "prace": 500
  },
  {
   "nazev": "BMS Pylontech H3 - modul pro řízení a ochranu bateriových modulů",
   "prodej": 15625,
   "prace": 500
  },
  {
   "nazev": "BMS RCT Power baterry - modul pro řízení a ochranu bateriových modulů",
   "prodej": 9144,
   "prace": 500
  },
  {
   "nazev": "BMS Solax TriplePower - modul pro řízení a ochranu bateriových modulů o výkonu 5.8kWh (součást master baterie)",
   "prodej": 55797,
   "prace": 500
  },
  {
   "nazev": "Sigen - set pro montáž baterie na stěnu",
   "prodej": 2917,
   "prace": 500
  },
  {
   "nazev": "Sigen - set pro montáž baterie na zem",
   "prodej": 2610,
   "prace": 500
  },
  {
   "nazev": "BMS pro Sigen Hybrid Inverter (ukončení bateriového sloupce)",
   "prodej": 7168,
   "prace": 500
  },
  {
   "nazev": "BMS je již součástí bateriového modulu",
   "prodej": 0,
   "prace": 0
  },
  {
   "nazev": "BMS BYD BCU",
   "prodej": 0,
   "prace": 500
  }
 ],
 "menice": [
  {
   "nazev": "Síťový měnič DEYE SUN-12K-G06P3-EU-AM2-P1, 3-f vč. monitoringu výkonu pomocí LAN/Wifi, záruka 10let, 4xMPPT, výroba Čína *",
   "kw": 12,
   "rozvadec": "RFVE - plastový rozvaděč s jištěním a AC přepěťovými ochranami střídače (bez funkce zálohování)",
   "hybridni": 0,
   "prodej": 17888,
   "prace": 3700
  },
  {
   "nazev": "Síťový měnič DEYE SUN-20K-G04, 3-f vč. monitoringu výkonu pomocí LAN/Wifi, záruka 10let, 4xMPPT, výroba Čína *",
   "kw": 20,
   "rozvadec": "RFVE - plastový rozvaděč s jištěním a AC přepěťovými ochranami střídače (bez funkce zálohování)",
   "hybridni": 0,
   "prodej": 21480,
   "prace": 4500
  },
  {
   "nazev": "Síťový měnič DEYE SUN-30K-G04, 3-f vč. monitoringu výkonu pomocí LAN/Wifi, záruka 10let, 4xMPPT, výroba Čína *",
   "kw": 30,
   "rozvadec": "RFVE - plastový rozvaděč s jištěním a AC přepěťovými ochranami střídače (bez funkce zálohování)",
   "hybridni": 0,
   "prodej": 29155,
   "prace": 5500
  },
  {
   "nazev": "Síťový měnič DEYE SUN-100K-G04, 3-f vč. monitoringu výkonu pomocí LAN/Wifi, záruka 10let, 4xMPPT, výroba Čína *",
   "kw": 100,
   "rozvadec": "RFVE - plastový rozvaděč s jištěním a AC přepěťovými ochranami střídače (bez funkce zálohování)",
   "hybridni": 0,
   "prodej": 90088,
   "prace": 12500
  },
  {
   "nazev": "Síťový měnič Huawei SUN2000-30KTL-M3, 3-f vč. monitoringu výkonu pomocí LAN/Wifi, záruka 10let, 4xMPPT, výroba Čína *",
   "kw": 30,
   "rozvadec": "RFVE - plastový rozvaděč s jištěním a AC přepěťovými ochranami střídače (bez funkce zálohování)",
   "hybridni": 0,
   "prodej": 56661,
   "prace": 5500
  },
  {
   "nazev": "Síťový měnič Huawei SUN2000-36KTL-M3, 3-f vč. monitoringu výkonu pomocí LAN/Wifi, záruka 10let, 4xMPPT, výroba Čína *",
   "kw": 36,
   "rozvadec": "RFVE - plastový rozvaděč s jištěním a AC přepěťovými ochranami střídače (bez funkce zálohování)",
   "hybridni": 0,
   "prodej": 64589,
   "prace": 6100
  },
  {
   "nazev": "Síťový měnič Huawei SUN2000-40KTL-M3, 3-f vč. monitoringu výkonu pomocí LAN/Wifi, záruka 10let, 4xMPPT, výroba Čína *",
   "kw": 40,
   "rozvadec": "RFVE - plastový rozvaděč s jištěním a AC přepěťovými ochranami střídače (bez funkce zálohování)",
   "hybridni": 0,
   "prodej": 68079,
   "prace": 6500
  },
  {
   "nazev": "Síťový měnič Huawei SUN2000-50KTL-M3, 3-f vč. monitoringu výkonu pomocí LAN/Wifi, záruka 10let, 4xMPPT, výroba Čína *",
   "kw": 50,
   "rozvadec": "RFVE - plastový rozvaděč s jištěním a AC přepěťovými ochranami střídače (bez funkce zálohování)",
   "hybridni": 0,
   "prodej": 68261,
   "prace": 7500
  },
  {
   "nazev": "Síťový měnič Huawei SUN2000-100KTL-M2, 3-f vč. monitoringu výkonu pomocí LAN/Wifi, záruka 10let, 10xMPPT, výroba Čína *",
   "kw": 100,
   "rozvadec": "RFVE - plastový rozvaděč s jištěním a AC přepěťovými ochranami střídače (bez funkce zálohování)",
   "hybridni": 0,
   "prodej": 107444,
   "prace": 12500
  },
  {
   "nazev": "Síťový měnič Huawei SUN2000-115KTL-M2, 3-f vč. monitoringu výkonu pomocí LAN/Wifi, záruka 10let, 10xMPPT, výroba Čína *",
   "kw": 115,
   "rozvadec": "RFVE - plastový rozvaděč s jištěním a AC přepěťovými ochranami střídače (bez funkce zálohování)",
   "hybridni": 0,
   "prodej": 107690,
   "prace": 14000
  },
  {
   "nazev": "Síťový měnič Huawei SUN5000-150KTL-MGO, 3-f vč. monitoringu výkonu pomocí LAN/Wifi, záruka 10let, 9xMPPT, výroba Čína *",
   "kw": 150,
   "rozvadec": "RFVE - plastový rozvaděč s jištěním a AC přepěťovými ochranami střídače (bez funkce zálohování)",
   "hybridni": 0,
   "prodej": 153305,
   "prace": 17500
  },
  {
   "nazev": "Síťový měnič Huawei SUN2000-185KTL-H1, 3-f vč. monitoringu výkonu pomocí LAN/Wifi, záruka 10let, 9xMPPT, výroba Čína *",
   "kw": 185,
   "rozvadec": "RFVE - plastový rozvaděč s jištěním a AC přepěťovými ochranami střídače (bez funkce zálohování)",
   "hybridni": 0,
   "prodej": 121480,
   "prace": 21000
  },
  {
   "nazev": "Síťový měnič Huawei SUN2000-215KTL-H3, 3-f vč. monitoringu výkonu pomocí LAN/Wifi, záruka 10let, 9xMPPT, výroba Čína *",
   "kw": 215,
   "rozvadec": "RFVE - plastový rozvaděč s jištěním a AC přepěťovými ochranami střídače (bez funkce zálohování)",
   "hybridni": 0,
   "prodej": 153477,
   "prace": 24000
  },
  {
   "nazev": "Síťový měnič Huawei SUN2000-330KTL-H1, 3-f vč. monitoringu výkonu pomocí LAN/Wifi, záruka 10let, 6xMPPT, výroba Čína *",
   "kw": 330,
   "rozvadec": "RFVE - plastový rozvaděč s jištěním a AC přepěťovými ochranami střídače (bez funkce zálohování)",
   "hybridni": 0,
   "prodej": 212629,
   "prace": 35500
  },
  {
   "nazev": "Síťový měnič SolarEdge SE16K-RW0TOBNM4, AC výkon 16kW, přepěťová ochrana DC typ II, integrovaný systém SafeDC a detekce oblouku, 12let záruka",
   "kw": 16,
   "rozvadec": "RFVE - plastový rozvaděč s jištěním a AC přepěťovými ochranami střídače (bez funkce zálohování)",
   "hybridni": 0,
   "prodej": 34310,
   "prace": 4100
  },
  {
   "nazev": "Síťový měnič SolarEdge SE20K-RW0TOBNM4, AC výkon 20kW, přepěťová ochrana DC typ II, integrovaný systém SafeDC a detekce oblouku, 12let záruka",
   "kw": 20,
   "rozvadec": "RFVE - plastový rozvaděč s jištěním a AC přepěťovými ochranami střídače (bez funkce zálohování)",
   "hybridni": 0,
   "prodej": 38677,
   "prace": 4500
  },
  {
   "nazev": "Síťový měnič SolarEdge SE25K-RW00IBNM4, AC výkon 25kW, přepěťová ochrana DC typ II, integrovaný systém SafeDC a detekce oblouku, 12let záruka",
   "kw": 25,
   "rozvadec": "RFVE - plastový rozvaděč s jištěním a AC přepěťovými ochranami střídače (bez funkce zálohování)",
   "hybridni": 0,
   "prodej": 250,
   "prace": 5000
  },
  {
   "nazev": "Síťový měnič SolarEdge SE30K-RW00IBNM4, AC výkon 30kW, přepěťová ochrana DC typ II, integrovaný systém SafeDC a detekce oblouku, 12let záruka",
   "kw": 30,
   "rozvadec": "RFVE - plastový rozvaděč s jištěním a AC přepěťovými ochranami střídače (bez funkce zálohování)",
   "hybridni": 0,
   "prodej": 45136,
   "prace": 5500
  },
  {
   "nazev": "Solární měnič SolarEdge SE33.3K-RW00IBNM4 s funkcí automatic rapid shutdown, AC výkon 33.3kW, přepěťová ochrana DC typ II, integrovaný systém SafeDC a detekce oblouku, 12let záruka",
   "kw": 33.3,
   "rozvadec": "RFVE - plastový rozvaděč s jištěním a AC přepěťovými ochranami střídače (bez funkce zálohování)",
   "hybridni": 0,
   "prodej": 46898,
   "prace": 5830
  },
  {
   "nazev": "Síťový měnič SolarEdge SE50K+2xSESUK, AC výkon 50kW, přepěťová ochrana DC typ II, integrovaný systém SafeDC a detekce oblouku, 12let záruka",
   "kw": 50,
   "rozvadec": "RFVE - plastový rozvaděč s jištěním a AC přepěťovými ochranami střídače (bez funkce zálohování)",
   "hybridni": 0,
   "prodej": 81582,
   "prace": 7500
  },
  {
   "nazev": "Síťový měnič SolarEdge SE66.6K+2xSESUK, AC výkon 66.6kW, přepěťová ochrana DC typ II, integrovaný systém SafeDC a detekce oblouku, 12let záruka",
   "kw": 66.6,
   "rozvadec": "RFVE - plastový rozvaděč s jištěním a AC přepěťovými ochranami střídače (bez funkce zálohování)",
   "hybridni": 0,
   "prodej": 92032,
   "prace": 9160
  },
  {
   "nazev": "Síťový měnič SolarEdge SE90K+3xSESUK, AC výkon 90kW, přepěťová ochrana DC typ II, integrovaný systém SafeDC a detekce oblouku, 12let záruka",
   "kw": 90,
   "rozvadec": "RFVE - plastový rozvaděč s jištěním a AC přepěťovými ochranami střídače (bez funkce zálohování)",
   "hybridni": 0,
   "prodej": 127272,
   "prace": 11500
  },
  {
   "nazev": "Síťový měnič SolarEdge SE100K+3xSESUK, AC výkon 100kW, přepěťová ochrana DC typ II, integrovaný systém SafeDC a detekce oblouku, 12let záruka",
   "kw": 100,
   "rozvadec": "RFVE - plastový rozvaděč s jištěním a AC přepěťovými ochranami střídače (bez funkce zálohování)",
   "hybridni": 0,
   "prodej": 128897,
   "prace": 12500
  },
  {
   "nazev": "Síťový měnič SolarEdge SE120K+3xSESUK, AC výkon 120kW, přepěťová ochrana DC typ II, integrovaný systém SafeDC a detekce oblouku, 12let záruka",
   "kw": 120,
   "rozvadec": "RFVE - plastový rozvaděč s jištěním a AC přepěťovými ochranami střídače (bez funkce zálohování)",
   "hybridni": 0,
   "prodej": 130466,
   "prace": 14500
  },
  {
   "nazev": "Solární měnič SUNGROW SG50CX-P2 V21, 4 MPP trackery, podpora optimizérů, přepěťová ochrana AC typu II a DC typu I+II, aktivní chlazení, záruka 5 let a možnost rozšířit",
   "kw": 50,
   "rozvadec": "RFVE - plastový rozvaděč s jištěním a AC přepěťovými ochranami střídače (bez funkce zálohování)",
   "hybridni": 0,
   "prodej": 58150,
   "prace": 7500
  },
  {
   "nazev": "Solární měnič SUNGROW SG350HX V114, 12 MPP trackerů, přepěťová ochrana AC typu II a DC typu I+II, aktivní chlazení, EURO účinnost 98.8%, záruka 5 let a možnost rozšířit",
   "kw": 352,
   "rozvadec": "RFVE - plastový rozvaděč s jištěním a AC přepěťovými ochranami střídače (bez funkce zálohování)",
   "hybridni": 0,
   "prodej": 237143,
   "prace": 37700
  },
  {
   "nazev": "Hybridní měnič DEYE SUN-10K-SG01HP3-EU-AM2, 3-f vč. monitoringu výkonu pomocí Wifi, záruka 5+5 let, 2x MPPT, asymetrický, výroba Čína, aktivní chlazení",
   "kw": 10,
   "rozvadec": "RFVE - plastový rozvaděč s jištěním a AC přep. ochranami střídače s přepínáním do ostrovního provozu do 32A",
   "hybridni": 1,
   "prodej": 38338,
   "prace": 3500
  },
  {
   "nazev": "Hybridní měnič DEYE SUN-12K-SG01HP3-EU-AM2, 3-f vč. monitoringu výkonu pomocí Wifi, záruka 5+5 let, 2x MPPT, asymetrický, výroba Čína, aktivní chlazení",
   "kw": 12,
   "rozvadec": "RFVE - plastový rozvaděč s jištěním a AC přep. ochranami střídače s přepínáním do ostrovního provozu do 32A",
   "hybridni": 1,
   "prodej": 42388,
   "prace": 3700
  },
  {
   "nazev": "Hybridní měnič DEYE SUN-15K-SG01HP3-EU-AM2, 3-f vč. monitoringu výkonu pomocí Wifi, záruka 5+5 let, 2x MPPT, asymetrický, výroba Čína, aktivní chlazení",
   "kw": 15,
   "rozvadec": "RFVE - plastový rozvaděč s jištěním a AC přep. ochranami střídače s přepínáním do ostrovního provozu do 32A",
   "hybridni": 1,
   "prodej": 55272,
   "prace": 4000
  },
  {
   "nazev": "Hybridní měnič DEYE SUN-20K-SG01HP3-EU-AM2, 3-f vč. monitoringu výkonu pomocí Wifi, záruka 10 let, 4x MPPT, asymetrický, výroba Čína, aktivní chlazení",
   "kw": 20,
   "rozvadec": "RFVE - plastový rozvaděč s jištěním a AC přep. ochranami střídače s přepínáním do ostrovního provozu do 63A",
   "hybridni": 1,
   "prodej": 60075,
   "prace": 4500
  },
  {
   "nazev": "Hybridní měnič DEYE SUN-30K-SG01HP3-EU-BM3, 3-f vč. monitoringu výkonu pomocí Wifi, záruka 5+5 let, 3x MPPT, asymetrický, výroba Čína, aktivní chlazení",
   "kw": 30,
   "rozvadec": "RFVE - plastový rozvaděč s jištěním a AC přep. ochranami střídače s přepínáním do ostrovního provozu do 63A",
   "hybridni": 1,
   "prodej": 110612,
   "prace": 5500
  },
  {
   "nazev": "Hybridní měnič GoodWe GW10K-ET-20 G2, AFCI, 3-f vč. monitoringu výkonu pomocí Wifi, záruka 5 let, 3x MPPT, integrovaný smartmetr, asymetrický, výroba Čína",
   "kw": 10,
   "rozvadec": "RFVE - plastový rozvaděč s jištěním a AC přep. ochranami střídače s přepínáním do ostrovního provozu do 32A",
   "hybridni": 1,
   "prodej": 31739,
   "prace": 3500
  },
  {
   "nazev": "Hybridní měnič GoodWe GW12K-ET-20 G2, AFCI, 3-f vč. monitoringu výkonu pomocí Wifi, záruka 5 let, 3x MPPT, integrovaný smartmetr, asymetrický, výroba Čína",
   "kw": 12,
   "rozvadec": "RFVE - plastový rozvaděč s jištěním a AC přep. ochranami střídače s přepínáním do ostrovního provozu do 32A",
   "hybridni": 1,
   "prodej": 32702,
   "prace": 3700
  },
  {
   "nazev": "Hybridní měnič GoodWe GW15K-ET-20 G2, AFCI, 3-f vč. monitoringu výkonu pomocí Wifi, záruka 5 let, 3x MPPT, integrovaný smartmetr, asymetrický, výroba Čína",
   "kw": 15,
   "rozvadec": "RFVE - plastový rozvaděč s jištěním a AC přep. ochranami střídače s přepínáním do ostrovního provozu do 32A",
   "hybridni": 1,
   "prodej": 33465,
   "prace": 4000
  },
  {
   "nazev": "Hybridní měnič GoodWe GW20K-ETA-G20, 3-f vč. monitoringu výkonu pomocí Wifi, záruka 5 let, 3x MPPT, asymetrický, výroba Čína",
   "kw": 20,
   "rozvadec": "RFVE - plastový rozvaděč s jištěním a AC přep. ochranami střídače s přepínáním do ostrovního provozu do 63A",
   "hybridni": 1,
   "prodej": 52621,
   "prace": 4500
  },
  {
   "nazev": "Hybridní měnič GoodWe GW25K-ETA-G20, AFCI, 3-f vč. monitoringu výkonu pomocí Wifi, záruka 5 let, 3x MPPT, asymetrický, výroba Čína",
   "kw": 25,
   "rozvadec": "RFVE - plastový rozvaděč s jištěním a AC přep. ochranami střídače s přepínáním do ostrovního provozu do 63A",
   "hybridni": 1,
   "prodej": 55742,
   "prace": 5000
  },
  {
   "nazev": "Hybridní měnič GoodWe GW29.999K-ETA-G20, 3-f vč. monitoringu výkonu pomocí Wifi, záruka 5 let, 3x MPPT, asymetrický, výroba Čína",
   "kw": 29.9,
   "rozvadec": "RFVE - plastový rozvaděč s jištěním a AC přep. ochranami střídače s přepínáním do ostrovního provozu do 63A",
   "hybridni": 1,
   "prodej": 59593,
   "prace": 5490
  },
  {
   "nazev": "Hybridní měnič RCT Power Storage DC 10.0, 3-f vč. monitoringu výkonu pomocí Wifi nebo LAN, záruka 10 let, 2x MPPT, asymetrický, výroba SRN, SVT30890 *",
   "kw": 10,
   "rozvadec": "RCT Power switch 63A - plastový rozvaděč pro přepínání do ostrovního provozu, vybavení NOARK",
   "hybridni": 1,
   "prodej": 42191,
   "prace": 3500
  },
  {
   "nazev": "Hybridní měnič SigenStack Hybrid 50M1-HYA 50kW, 3-f, záruka 10 let, 4x MPPT 160-1000V, asymetrický, AFCI, IP66, výroba Čína",
   "kw": 50,
   "rozvadec": "SIGEN Gateway HomeMAX TP - plechový rozvaděč pro přepínání do ostrovního provozu s možností připojení záložního generátoru pro dva střídače, max. 76A, 510x750x179mm",
   "hybridni": 1,
   "prodej": 86962,
   "prace": 7500
  },
  {
   "nazev": "Hybridní měnič SigenStack Hybrid 60M1-HYA 60kW, 3-f, záruka 10 let, 5x MPPT 160-1000V, asymetrický, AFCI, IP66, výroba Čína",
   "kw": 60,
   "rozvadec": "SIGEN Gateway HomeMAX TP - plechový rozvaděč pro přepínání do ostrovního provozu s možností připojení záložního generátoru pro dva střídače, max. 76A, 510x750x179mm",
   "hybridni": 1,
   "prodej": 90524,
   "prace": 8500
  },
  {
   "nazev": "Hybridní měnič SigenStack Hybrid 80M1-HYA 80kW, 3-f, záruka 10 let, 6x MPPT 160-1000V, asymetrický, AFCI, IP66, výroba Čína",
   "kw": 80,
   "rozvadec": "SIGEN Gateway HomeMAX TP - plechový rozvaděč pro přepínání do ostrovního provozu s možností připojení záložního generátoru pro dva střídače, max. 76A, 510x750x179mm",
   "hybridni": 1,
   "prodej": 118314,
   "prace": 10500
  },
  {
   "nazev": "Hybridní měnič SigenStack Hybrid 100M1-HYA 100kW, 3-f, záruka 10 let, 8x MPPT 160-1000V, asymetrický, AFCI, IP66, výroba Čína",
   "kw": 100,
   "rozvadec": "SIGEN Gateway C600-B plechový skříňový rozvaděč pro přepínání do ostrovního provozu s možností připojení záložního generátoru, max. 600A, 1270x1800x2300mm",
   "hybridni": 1,
   "prodej": 127219,
   "prace": 12500
  },
  {
   "nazev": "Hybridní měnič SigenStack Hybrid 110M1-HYA 110kW, 3-f, záruka 10 let, 8x MPPT 160-1000V, asymetrický, AFCI, IP66, výroba Čína",
   "kw": 110,
   "rozvadec": "SIGEN Gateway C600-B plechový skříňový rozvaděč pro přepínání do ostrovního provozu s možností připojení záložního generátoru, max. 600A, 1270x1800x2300mm",
   "hybridni": 1,
   "prodej": 130811,
   "prace": 13500
  },
  {
   "nazev": "Hybridní měnič SigenStack Hybrid 125M1-HYA 125kW, 3-f, záruka 10 let, 8x MPPT 160-1000V, asymetrický, AFCI, IP66, výroba Čína",
   "kw": 125,
   "rozvadec": "SIGEN Gateway C600-B plechový skříňový rozvaděč pro přepínání do ostrovního provozu s možností připojení záložního generátoru, max. 600A, 1270x1800x2300mm",
   "hybridni": 1,
   "prodej": 138027,
   "prace": 15000
  },
  {
   "nazev": "Hybridní měnič SIGENSTOR EC 10.0 TP, 3-f, záruka 10 let, 3x MPPT, asymetrický, měřič 120A CT, výroba Čína, SVT35379",
   "kw": 10,
   "rozvadec": "SIGEN Gateway Home TP 30K - plechový rozvaděč pro přepínání do ostrovního provozu pro jeden střídač, 500x370x160mm",
   "hybridni": 1,
   "prodej": 48701,
   "prace": 3500
  },
  {
   "nazev": "Hybridní měnič SIGENSTOR EC 12.0 TP, 3-f, záruka 10 let, 3x MPPT, asymetrický, měřič 120A CT, výroba Čína, SVT35380",
   "kw": 12,
   "rozvadec": "SIGEN Gateway Home TP 30K - plechový rozvaděč pro přepínání do ostrovního provozu pro jeden střídač, 500x370x160mm",
   "hybridni": 1,
   "prodej": 57531,
   "prace": 3700
  },
  {
   "nazev": "Hybridní měnič SIGENSTOR EC 15.0 TP, 3-f, záruka 10 let, 3x MPPT, asymetrický, měřič 120A CT, výroba Čína, SVT35381",
   "kw": 15,
   "rozvadec": "SIGEN Gateway Home TP 30K - plechový rozvaděč pro přepínání do ostrovního provozu pro jeden střídač, 500x370x160mm",
   "hybridni": 1,
   "prodej": 64269,
   "prace": 4000
  },
  {
   "nazev": "Hybridní měnič SIGENSTOR EC 17.0 TP, 3-f, záruka 10 let, 3x MPPT, asymetrický, měřič 120A CT, výroba Čína, SVT35382",
   "kw": 17,
   "rozvadec": "SIGEN Gateway Home TP 30K - plechový rozvaděč pro přepínání do ostrovního provozu pro jeden střídač, 500x370x160mm",
   "hybridni": 1,
   "prodej": 68139,
   "prace": 4200
  },
  {
   "nazev": "Hybridní měnič SIGENSTOR EC 20.0 TP, 3-f, záruka 10 let, 3x MPPT, asymetrický, měřič 120A CT, výroba Čína, SVT35383",
   "kw": 20,
   "rozvadec": "SIGEN Gateway HomeMAX TP - plechový rozvaděč pro přepínání do ostrovního provozu s možností připojení záložního generátoru pro dva střídače, max. 76A, 510x750x179mm",
   "hybridni": 1,
   "prodej": 71692,
   "prace": 4500
  },
  {
   "nazev": "Hybridní měnič SIGENSTOR EC 25.0 TP, 3-f, záruka 10 let, 3x MPPT, asymetrický, měřič 120A CT, výroba Čína, SVT35384",
   "kw": 25,
   "rozvadec": "SIGEN Gateway HomeMAX TP - plechový rozvaděč pro přepínání do ostrovního provozu s možností připojení záložního generátoru pro dva střídače, max. 76A, 510x750x179mm",
   "hybridni": 1,
   "prodej": 83465,
   "prace": 5000
  },
  {
   "nazev": "Hybridní měnič SIGEN Hybrid 10.0 TP2, 3-f, záruka 10 let, 2x MPPT, asymetrický, rozměr jen 477 x 568 x 99 mm, výroba Čína",
   "kw": 10,
   "rozvadec": "SIGEN Gateway Home TP 30K - plechový rozvaděč pro přepínání do ostrovního provozu pro jeden střídač, 500x370x160mm",
   "hybridni": 1,
   "prodej": 28660,
   "prace": 3500
  },
  {
   "nazev": "Hybridní měnič Solax X3-Hybrid-10.0-D (G4), 3-f vč. monitoringu výkonu pomocí Wifi, záruka 10 let, 2x MPPT, asymetrický, výroba Čína, SVT30597",
   "kw": 10,
   "rozvadec": "RFVE - plastový rozvaděč s jištěním a AC přepěťovými ochranami střídače (bez funkce zálohování)",
   "hybridni": 1,
   "prodej": 41035,
   "prace": 3500
  },
  {
   "nazev": "Hybridní měnič Solax X3-Hybrid-15.0-D (G4), 3-f vč. monitoringu výkonu pomocí Wifi, záruka 10 let, 2x MPPT, asymetrický, výroba Čína, SVT30854",
   "kw": 15,
   "rozvadec": "RFVE - plastový rozvaděč s jištěním a AC přepěťovými ochranami střídače (bez funkce zálohování)",
   "hybridni": 1,
   "prodej": 46180,
   "prace": 4000
  }
 ],
 "rozvadece": [
  {
   "nazev": "Komponenty pro montáž jističů a stykačů do stávajícího rozvaděče",
   "prodej": 13688,
   "prace": 2738
  },
  {
   "nazev": "RFVE - plastový rozvaděč s jištěním a AC přepěťovými ochranami střídače (bez funkce zálohování)",
   "prodej": 16188,
   "prace": 4047
  },
  {
   "nazev": "RFVE - plastový rozvaděč s jištěním a AC přep. ochranami střídače s přepínáním do ostrovního provozu do 32A",
   "prodej": 33882,
   "prace": 3500
  },
  {
   "nazev": "RFVE - plastový rozvaděč s jištěním a AC přep. ochranami střídače s přepínáním do ostrovního provozu do 63A",
   "prodej": 42500,
   "prace": 5000
  },
  {
   "nazev": "SIGEN Gateway Home TP 30K - plechový rozvaděč pro přepínání do ostrovního provozu pro jeden střídač, 500x370x160mm",
   "prodej": 16275,
   "prace": 3500
  },
  {
   "nazev": "SIGEN Gateway HomeMAX TP - plechový rozvaděč pro přepínání do ostrovního provozu s možností připojení záložního generátoru pro dva střídače, max. 76A, 510x750x179mm",
   "prodej": 28557,
   "prace": 3500
  },
  {
   "nazev": "SIGEN Gateway C600-B plechový skříňový rozvaděč pro přepínání do ostrovního provozu s možností připojení záložního generátoru, max. 600A, 1270x1800x2300mm",
   "prodej": 28557,
   "prace": 3500
  },
  {
   "nazev": "SIGEN Gateway C1200-B plechový skříňový rozvaděč pro přepínání do ostrovního provozu s možností připojení záložního generátoru, max. 1200A, 1270x1800x2300mm2",
   "prodej": 28557,
   "prace": 3500
  },
  {
   "nazev": "RCT Power switch 63A - plastový rozvaděč pro přepínání do ostrovního provozu, vybavení NOARK",
   "prodej": 39397,
   "prace": 3500
  }
 ],
 "vytezovace": [
  {
   "nazev": "A-Zrouter SMART - regulátor přebytků s plynulou regulací výkonu topných odporových zátěží, bezdrátový přenos dat",
   "prodej": 16648,
   "prace": 5000
  },
  {
   "nazev": "GBO-AKU - regulátor přebytků s plynulou regulací výkonu topných odporových zátěží",
   "prodej": 13062,
   "prace": 5000
  },
  {
   "nazev": "Home assistant - zařízení pro aktivní řízení toků energie, vzdálené řízení zdroje, omezení přetoků v závislosti na spotových cenách, sdílení elektřiny, kompatibilní s většinou chytrých zažízení",
   "prodej": 5625,
   "prace": 6500
  },
  {
   "nazev": "LOXONE Miniserver Compact - profesionální zařízení pro aktivní řízení toků energie, vzdálené řízení zdroje, omezení přetoků v závislosti na spotových cenách, sdílení elektřiny, kompatibilní s většinou chytrých zažízení",
   "prodej": 16088,
   "prace": 6500
  },
  {
   "nazev": "Sigenergy SMART AI - integrovaný software pro aktivní řízení toků energie, vzdálené řízení zdroje, omezení přetoků v závislosti na spotových cenách, sdílení elektřiny, kompatibilní s většinou chytrých zažízení",
   "prodej": 1250,
   "prace": 2000
  },
  {
   "nazev": "NORD Power Genius - regulátor přebytků s plynulou regulací výkonu topných odporových zátěží",
   "prodej": 11035,
   "prace": 5000
  },
  {
   "nazev": "Wattrouter Mx - Regulátor přebytků s plynulou regulací výkonu tepelného čerpadla",
   "prodej": 15000,
   "prace": 5000
  },
  {
   "nazev": "Zařízení pro řízení tepelného čerpadla v závoslosti na výkonu FVE - dodávka ze strany stavby",
   "prodej": 0,
   "prace": 5000
  }
 ],
 "konstrukce": [
  {
   "nazev": "Hák na taškovou střechu, stavitelný, nerez/hliník",
   "pocet_dle": "profil",
   "nasobek_na_panel": 1,
   "jednotky": "ks",
   "prodej": 192,
   "prace": 180
  },
  {
   "nazev": "Falcový úchyt, nerez",
   "pocet_dle": "profil",
   "nasobek_na_panel": 1,
   "jednotky": "ks",
   "prodej": 87,
   "prace": 120
  },
  {
   "nazev": "Originální falcový úchyt Prefalz Vario, hliník",
   "pocet_dle": "profil",
   "nasobek_na_panel": 1,
   "jednotky": "ks",
   "prodej": 562,
   "prace": 120
  },
  {
   "nazev": "Kombivrut M10x180, nerez včetně plocháče a spojovacího materiálu",
   "pocet_dle": "profil",
   "nasobek_na_panel": 1,
   "jednotky": "ks",
   "prodej": 113,
   "prace": 150
  },
  {
   "nazev": "Al úchyt na plechovou/bitumenovou/trapézovou střechu, délka 400mm",
   "pocet_dle": "panel",
   "nasobek_na_panel": 2.5,
   "jednotky": "ks",
   "prodej": 206,
   "prace": 100
  },
  {
   "nazev": "Konstrukce na plochou střechu se zadním krycím plechem, 17°, zátěžová",
   "pocet_dle": "panel",
   "nasobek_na_panel": 1,
   "jednotky": "set",
   "prodej": 2562,
   "prace": 400
  },
  {
   "nazev": "Konstrukce na plochou střechu se zadním krycím plechem, 10°, zátěžová",
   "pocet_dle": "panel",
   "nasobek_na_panel": 1,
   "jednotky": "set",
   "prodej": 2562,
   "prace": 400
  },
  {
   "nazev": "Konstrukce na plochou střechu východ/západ, 10°, zátěžová",
   "pocet_dle": "panel",
   "nasobek_na_panel": 1,
   "jednotky": "set",
   "prodej": 2312,
   "prace": 400
  },
  {
   "nazev": "Konstrukce Console+ na plochou střechu 15°, plastová zátěžová",
   "pocet_dle": "panel",
   "nasobek_na_panel": 1,
   "jednotky": "set",
   "prodej": 2475,
   "prace": 400
  },
  {
   "nazev": "Konstrukce na zem se zemními vruty 25°, pozinkovaná",
   "pocet_dle": "panel",
   "nasobek_na_panel": 1,
   "jednotky": "set",
   "prodej": 3125,
   "prace": 1500
  }
 ],
 "wallboxy": [
  {
   "nazev": "Bez dobíjecí stanice elektromobilů (možno kdykoliv doplnit)",
   "kw": 0,
   "prodej": 0,
   "prace": 0
  },
  {
   "nazev": "Dobíjecí stanice Hardy Barth cPµ2 Pro 11kW s možností chytrého dobíjení z přebytků se spirálovým kabelem + proudový chránič + proudový měřič ecB1",
   "kw": 11,
   "prodej": 30209,
   "prace": 4000
  },
  {
   "nazev": "Dobíjecí stanice Hardy Barth cPµ2 Pro 11kW s možností chytrého dobíjení z přebytků se spirálovým kabelem + proudový chránič",
   "kw": 11,
   "prodej": 24258,
   "prace": 4000
  },
  {
   "nazev": "Dobíjecí stanice Hardy Barth cPH2 1T22 22kW s možností chytrého dobíjení z přebytků s 1 kabelem, Salia, MID, RFID",
   "kw": 22,
   "prodej": 48056,
   "prace": 4000
  },
  {
   "nazev": "Dobíjecí stanice Hardy Barth cPH2 2T22 22kW s možností chytrého dobíjení z přebytků se dvěmi kabely, Salia, MID, RFID",
   "kw": 22,
   "prodej": 72161,
   "prace": 4000
  },
  {
   "nazev": "Dobíjecí stanice EV Mate 01/2-3-16/STR A, 11kW s aktivním omezováním nabíjecího proudu s 5m kabelem",
   "kw": 11,
   "prodej": 16238,
   "prace": 4000
  },
  {
   "nazev": "Dobíjecí stanice EV Mate  01/2-3-16 + IoT meter, 11kW s možností chytrého dobíjení z přetoků s 5m kabelem",
   "kw": 11,
   "prodej": 20362,
   "prace": 4000
  },
  {
   "nazev": "Dobíjecí stanice Sigen EVAC, 11kW s 5m kabelem a koncovkou typu 2, RFID čtečka",
   "kw": 11,
   "prodej": 16889,
   "prace": 4000
  },
  {
   "nazev": "Dobíjecí stanice Sigen EVAC, 22kW s 5m kabelem a koncovkou typu 2, RFID čtečka",
   "kw": 22,
   "prodej": 19345,
   "prace": 4000
  },
  {
   "nazev": "Dobíjecí stanice SigenEVDC, 12.5kW DC s kabelem 7.5m kabelem a koncovkou typu 2, RFID čtečka",
   "kw": 12.5,
   "prodej": 38384,
   "prace": 4000
  },
  {
   "nazev": "Dobíjecí stanice SigenEVDC, 25kW DC s kabelem 5m kabelem a koncovkou typu 2, RFID čtečka",
   "kw": 25,
   "prodej": 52816,
   "prace": 4000
  },
  {
   "nazev": "Dobíjecí stanice GoodWe EV Charger HCA G2 11 kW, s možností chytrého dobíjení z přebytků, se 6m kabelem, komunikace se střídačem, online aplikace na telefon",
   "kw": 11,
   "prodej": 11296,
   "prace": 4000
  },
  {
   "nazev": "Dobíjecí stanice GoodWe EV Charger HCA G2 22 kW, s možností chytrého dobíjení z přebytků, se 6m kabelem, komunikace se střídačem pomocí WiFi, online aplikace na telefon",
   "kw": 22,
   "prodej": 12623,
   "prace": 4000
  }
 ],
 "ucinnosti": {
  "Centrální zásobování teplem": 1,
  "Elektrické vytápění": 0.99,
  "Kotel na dřevo": 0.86,
  "Kotel na uhlí": 0.86,
  "Plynový kotel": 0.85,
  "Plynový kotel kondenzační": 1.02,
  "Tepelné čerpadlo s kolektory": 4.3,
  "Tepelné čerpadlo s vrty": 4.8,
  "Tepelné čerpadlo vzduch/voda": 3,
  "Nespecifikováno": 1
 },
 "sazby": {
  "D01d": {
   "silovka": 5.8567,
   "distribuce": 2.6667
  },
  "D02d": {
   "silovka": 5.2687,
   "distribuce": 2.0786
  },
  "D25d": {
   "silovka": 3.2011,
   "distribuce": 1.5405
  },
  "D26d": {
   "silovka": 3.2011,
   "distribuce": 0.8402
  },
  "D27d": {
   "silovka": 3.1873,
   "distribuce": 1.5405
  },
  "D35d": {
   "silovka": 3.3388,
   "distribuce": 0.2229
  },
  "D45d": {
   "silovka": 3.3306,
   "distribuce": 0.1697
  },
  "D56d": {
   "silovka": 3.3306,
   "distribuce": 0.1697
  },
  "D57d": {
   "silovka": 3.3388,
   "distribuce": 0.2229
  },
  "D61d": {
   "silovka": 4.7456,
   "distribuce": 1.9774
  }
 }
};
