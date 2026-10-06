# Zohair RezaeiMobin — Resume & Portfolio

A responsive, trilingual resume and portfolio for my work in digital marketing strategy, company leadership, medical tourism, negotiation, WordPress websites and projects involving Iraq. The original Foliox dark-purple and cyan palette, background artwork and mouse-circle effect are restored, with Google Fonts Vazirmatn throughout.

**Website:** https://zrezaeimobin.github.io/resume/

## Profile

- Based in Shiraz, Iran.
- Founder and CEO of SanaMedTour in Shiraz, with clients from more than 10 countries; international patient coordination and medical interpretation.
- Digital marketing strategy across Facebook, Instagram, YouTube and TikTok, with WordPress websites, multilingual content and social media management.
- Eye-care communication and web presence through ShirazEye.
- Fish-feed export sales experience with Fitall, focused on the Iraqi market.
- Strong negotiation skills and deep knowledge of Iraq, its language, culture and business context.
- Near-native English; native Arabic and Persian (raised bilingual); A2 German.

**Email:** zrezaeimobin@gmail.com

**Iran phone and WhatsApp:** +98 937 831 9583 — https://wa.me/989378319583

**Iraq WhatsApp:** +964 774 999 9583 — https://wa.me/9647749999583

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
- `js/init.js`: language selection, responsive menu, section navigation, scroll entrance animations, the original circular cursor and hover tilt, and printing. Animations run on desktop and mobile, respect reduced-motion preferences, and stop before printing or when keyboard focus enters an animating element.
- `img/hero/avatar.png`: existing profile portrait.
- `fonts/Vazirmatn.ttf`: a local copy of the variable [Google Fonts Vazirmatn](https://github.com/google/fonts/tree/main/ofl/vazirmatn) font, covered by `fonts/OFL.txt`. Hosting it with the page keeps typography available when Google’s font CDN is unreachable.
- `img/flags/`: US, Iranian and Iraqi SVG flags from [flag-icons](https://github.com/lipis/flag-icons), distributed under the included MIT license.

No build step or JavaScript framework is required. Run `python -m http.server 8765` from this directory to preview locally. Use the page’s print button to print or save the currently selected language as a PDF. Publishing uses the repository’s existing GitHub Pages configuration.

The theme’s original background artwork is loaded from `img/hero/1.jpg`. Its cyan circular cursor, button wipe and gentle hover tilt are adapted to the current accessible, trilingual markup. Mouse effects run only with a fine pointer and hover support; they are disabled for touch input and reduced motion.
