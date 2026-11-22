# Better Paombong

A community-run portal for **Paombong, Bulacan**: municipal officials, offices, services and public information in one place.

Better Paombong is a volunteer project listed in the [BetterGov.ph LGU Directory](https://lgu.bettergov.ph/). It is **not** an official website of the Municipality of Paombong.

## About Paombong

Paombong is a coastal municipality in Bulacan, Central Luzon, on Manila Bay. It has 14 barangays and a population of 55,696 (2020 Census). The town is known for nipa vinegar, fish sauce, salt and aquaculture.

| Barangay | Population (2020) |
|---|---|
| Binakod | 1,886 |
| Kapitangan | 4,708 |
| Malumot | 1,423 |
| Masukol | 1,389 |
| Pinalagdan | 3,253 |
| Poblacion | 1,462 |
| San Isidro I | 3,427 |
| San Isidro II | 12,011 |
| San Jose | 5,209 |
| San Roque | 4,810 |
| San Vicente | 3,176 |
| Santa Cruz | 1,386 |
| Santo Niño | 3,574 |
| Santo Rosario | 7,982 |

Sources: [Provincial Government of Bulacan](https://bulacan.gov.ph/cities-and-municipalities/paombong/), [PhilAtlas (PSA data)](https://www.philatlas.com/luzon/r03/bulacan/paombong.html).

## Run it locally

Requires Node.js 18 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

Site content lives in `content/` (Markdown and YAML) and `src/data/`. See [CONTENT-MANAGEMENT.md](CONTENT-MANAGEMENT.md) for how to edit pages without touching code.

## Contributing

Many service pages are still placeholders. If you know how a service works in Paombong (requirements, office, fees, schedule), open an issue or a pull request. Please cite a public source for facts about officials, offices and fees.

## Credits

Built on the [Better Local Gov](https://github.com/iyanski/betterlocalgov) starter kit by the BetterGov.ph community. Released under [CC0 1.0](LICENSE).
