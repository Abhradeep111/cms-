# License & Copyright

**Copyright © 2026 Corpxcloud Technologies Private Limited. All rights reserved.**

This software and its source code are the exclusive property of **Corpxcloud Technologies Private Limited**.

---

## License

This software is proprietary software made available for **personal, educational, and non-commercial use only**, subject to the terms and conditions below.

### Permitted Use

Individuals may:

* Download and use this software for personal learning and experimentation.
* Modify the software for personal, educational, and non-commercial purposes.
* Study and experiment with the source code for learning purposes.
* Create personal modifications, provided that all copyright notices and license terms are retained.

**Commercial use requires prior written permission from Corpxcloud Technologies Private Limited.**

---

## Restrictions

Without prior written permission from **Corpxcloud Technologies Private Limited**, you may not:

* Use this software or any part of it for commercial purposes.
* Sell, sublicense, lease, or otherwise commercially exploit the software.
* Distribute the software or modified versions commercially.
* Use the software as part of a commercial product or service.
* Publish or redistribute the source code, in whole or in part.
* Remove, modify, or obscure copyright, license, or ownership notices.
* Claim ownership of the software or its original source code.
* Represent the software or its source code as your own.

---

## Ownership

All intellectual property rights associated with this software remain the exclusive property of:

**Corpxcloud Technologies Private Limited**

This includes, but is not limited to:

* Copyright
* Source code
* Software architecture
* Trademarks
* Branding
* Documentation
* Other proprietary intellectual property

Permission to use the software does not transfer ownership or grant any intellectual property rights beyond those explicitly provided in this license.

---

## Disclaimer

This software is provided **"AS IS"**, without warranties of any kind, whether express or implied.

This includes, but is not limited to, warranties of:

* Merchantability
* Fitness for a particular purpose
* Non-infringement
* Reliability
* Availability
* Accuracy

To the maximum extent permitted by applicable law, **Corpxcloud Technologies Private Limited** shall not be liable for any direct, indirect, incidental, consequential, special, or other damages or claims arising from or related to the use of this software.

---

## Commercial Licensing

Commercial use, enterprise deployment, redistribution, integration into commercial products or services, or other forms of commercial exploitation require **prior written permission** from Corpxcloud Technologies Private Limited.

For commercial licensing, enterprise usage, redistribution permissions, or other licensing inquiries, please visit:

**Website:** [corpxcloud.com](https://corpxcloud.com?utm_source=chatgpt.com)

---

## License Summary

| Use Case                     | Permission                               |
| ---------------------------- | ---------------------------------------- |
| Personal use                 | Allowed                                  |
| Educational use              | Allowed                                  |
| Personal modifications       | Allowed                                  |
| Learning and experimentation | Allowed                                  |
| Commercial use               | Requires written permission              |
| Commercial redistribution    | Requires written permission              |
| Enterprise usage             | Requires written permission              |
| Selling the software         | Not permitted without written permission |
| Sublicensing                 | Not permitted without written permission |
| Publishing source code       | Not permitted without written permission |
| Redistributing source code   | Not permitted without written permission |
| Claiming ownership           | Prohibited                               |
| Removing copyright notices   | Prohibited                               |

---

## Copyright Notice

Any copy or permitted modification of this software must retain the following copyright notice:

> Copyright © 2026 Corpxcloud Technologies Private Limited. All rights reserved.

The copyright notice and applicable license terms must not be removed from copies or permitted modifications.

---

## Acceptance of Terms

By downloading, accessing, modifying, or using this software, you acknowledge that you have read, understood, and agree to comply with the terms and conditions of this license.

If you do not agree with these terms, you must not use, copy, modify, distribute, or otherwise access the software.

---

**Copyright © 2026 Corpxcloud Technologies Private Limited. All rights reserved.**






---

# CORPXCLOUD — Landing page
Next.js 15 (App Router) · TypeScript · Tailwind CSS 3 · Framer Motion · Lucide.

## Run it

```bash
npm install
cp .env.example .env.local
npm run dev        # http://localhost:3000
npm run typecheck
npm run lint
npm run build
```

Requires Node 18.18 or newer.

## Project structure

```
corpxcloud-app/
├── public/                       static assets
├── src/
│   ├── app/                      App Router
│   │   ├── globals.css           design tokens, motif classes, a11y baselines
│   │   ├── icon.svg              favicon (auto-detected by Next)
│   │   ├── layout.tsx            fonts, metadata, skip link
│   │   ├── not-found.tsx         404
│   │   ├── page.tsx              home — section composition + JSON-LD
│   │   ├── robots.ts             generated robots.txt
│   │   └── sitemap.ts            generated sitemap.xml
│   ├── components/
│   │   ├── layout/               chrome that wraps every page
│   │   │   ├── Navbar.tsx        scroll-aware glass header + mobile sheet
│   │   │   └── Footer.tsx        product breakdown, legal, location
│   │   ├── sections/             one file per band of the page
│   │   │   ├── Hero.tsx
│   │   │   ├── HeroConsole.tsx   the signature visual
│   │   │   ├── Solutions.tsx     industry → module-stack mapping
│   │   │   ├── ProductGrid.tsx   filter tabs + card grid
│   │   │   ├── EnterpriseArchitecture.tsx
│   │   │   ├── Roadmap.tsx
│   │   │   └── CTABanner.tsx
│   │   └── ui/                   reusable, section-agnostic
│   │       ├── Button.tsx        primary / outline / ghost
│   │       ├── Logo.tsx          pixel-cloud mark as SVG
│   │       ├── ModuleCard.tsx    live vs roadmap treatments
│   │       └── Reveal.tsx        scroll-entrance primitive
│   ├── data/                     content, no JSX
│   │   ├── modules.ts            the module catalogue + derived selectors
│   │   ├── industries.ts
│   │   ├── pillars.ts
│   │   └── roadmap.ts            derived from modules.ts
│   ├── lib/
│   │   ├── site.ts               company details, nav and footer link maps
│   │   └── utils.ts              cn() class merge
│   └── types/
│       └── index.ts              shared interfaces
├── .env.example
├── .eslintrc.json
├── next.config.mjs
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

The `@/*` path alias maps to `./src/*`.

### Why the split

`data/` holds content with no markup, `components/sections/` holds markup with no content,
and `lib/site.ts` holds everything a non-developer might want to change. Marketing can edit a
release quarter or a headline without opening a `.tsx` file.

`data/modules.ts` is the single source of truth. Flip one module from `roadmap` to `live` and
the grid, the filter counts, the roadmap timeline, the footer columns and the JSON-LD offers
all follow — `data/roadmap.ts` derives its phases from `modulesByRelease` rather than
repeating them.

## Design tokens

| Token                   | Value                 | Used for                                |
| ----------------------- | --------------------- | --------------------------------------- |
| `navy`                  | `#021B3B`             | Dark sections, headings, console chrome |
| `navy-800` / `navy-700` | `#062748` / `#0A365E` | Hover states on dark surfaces           |
| `royal`                 | `#0055D4`             | Primary actions, active states          |
| `sky` → `aqua`          | `#0099FF` → `#00C8FF` | Gradient accents, glows, badges         |
| `canvas`                | `#FAFCFF`             | Page background                         |
| `hairline`              | `#E3ECF7`             | Borders and dividers                    |

Gradients are `bg-brand-gradient` and `bg-sky-gradient`; the text version is `.gradient-text`.

**Type roles** — Archivo (display, variable `wdth` axis), IBM Plex Sans (body), IBM Plex Mono
(anything the platform itself emits: module codes, statuses, timestamps).

**Motif** — `.lattice` / `.lattice-dark` draw the pixel grid from the logomark at a `--cell`
unit of 34px; `.lattice-fade` masks it to atmosphere. `.gradient-ring` gives any element a 1px
gradient border with no wrapper div.

## Notes

- **Accessibility** — visible focus rings, skip link, `aria-selected` filter tabs, labelled
  icon-only buttons, and `prefers-reduced-motion` honoured in CSS and via `useReducedMotion`.
- **SEO** — metadata in `layout.tsx`, Organization + SoftwareApplication JSON-LD in `page.tsx`,
  generated `robots.txt` and `sitemap.xml`.
- **Logo** — `ui/Logo.tsx` renders the mark as SVG cells. To use your real asset, replace the
  `LogoMark` body with an `<Image>` pointing at `public/logo.svg`, and update `app/icon.svg`.
- **Tailwind v4** — if your project is on v4, move `theme.extend` from `tailwind.config.ts`
  into an `@theme` block in `globals.css`; component classes are unchanged.
- **Before launch** — legal links point at `/privacy`, `/terms`, `/dpa`, `/security`, which do
  not exist yet. Add them as routes under `src/app/` or repoint the URLs in `lib/site.ts`.

test push 1
