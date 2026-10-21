# 八字通胜 · BaZi Almanac

A phone-friendly personal almanac (installable web app, works offline) hosted with GitHub Pages.

- **BaZi engine:** free, open-source [lunar-javascript](https://github.com/6tail/lunar-javascript) (MIT), bundled in `lib/`.
- **Birthplace:** built-in city list (`cities.js`), worldwide search (Open-Meteo geocoding, free, no key), or manual coordinates.
  Historical time zones / daylight saving come from the browser's tz database; day & hour pillars use true solar time.
- **Readings:** daily and two-hourly (shichen) Yi/Ji, directions, clashes, plus a personal score from the user's chart.
- **Bilingual:** 双语 / 中文 / English toggle. Glossary in `terms.js`.
- **Privacy:** birth data stays in the browser's localStorage.

Files: `index.html` (layout + styles), `app.js` (screens), `engine.js` (chart + scoring, no DOM), `sw.js` (offline cache — bump `VERSION` after edits).
