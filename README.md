# Zohair RezaeiMobin — Resume & Portfolio

A responsive resume and portfolio for my work in medical interpretation, WordPress websites, multilingual content and export sales.

**Website:** https://zrezaeimobin.github.io/resume/

## Profile

- Based in Shiraz, Iran.
- Medical and cosmetic care interpretation and international patient coordination through SanaMedTour.
- WordPress website building, multilingual content and social media management.
- Eye-care communication and web presence through ShirazEye.
- Fish-feed export sales experience with Fitall, focused on the Iraqi market.
- English and Arabic as working languages; Persian as a native language; German approximately A2 (self-assessed, continuing to learn).

**Email:** ziromoving@gmail.com

**Phone:** +98 937 831 9583

## Languages

The persistent language switcher pairs language names with the requested flags:

- 🇺🇸 [English](https://zrezaeimobin.github.io/resume/?lang=en)
- 🇮🇷 [فارسی](https://zrezaeimobin.github.io/resume/?lang=fa)
- 🇮🇶 [العربية](https://zrezaeimobin.github.io/resume/?lang=ar)

Language selection updates content, document direction, page title, metadata and accessible labels. The choice is saved locally when browser storage is available; an explicit `?lang=` link takes precedence. The English content remains readable without JavaScript.

## Maintenance

- `index.html`: semantic page markup and English fallback content.
- `css/style.css`: responsive layout, RTL spacing, contrast, keyboard focus, reduced motion and print styling.
- `js/translations.js`: the English, Persian and Arabic dictionaries. Keep translation keys consistent, and update the English fallback markup when changing English copy.
- `js/init.js`: language selection, responsive menu, section navigation and printing.
- `img/hero/avatar.png`: existing profile portrait.
- `img/flags/`: US, Iranian and Iraqi SVG flags from [flag-icons](https://github.com/lipis/flag-icons), distributed under the included MIT license.

No build step or JavaScript framework is required. Run `python -m http.server 8765` from this directory to preview locally. Use the page’s print button to print or save the currently selected language as a PDF. Publishing uses the repository’s existing GitHub Pages configuration.

The earlier template assets are retained in the repository; the current page loads only its own stylesheet, translation dictionary and interaction script.
