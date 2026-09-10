# Morton Family and Criminal Law — Website Design Concepts

Three design concepts for **Morton Family and Criminal Law, PLLC** — a Connecticut family law practice in Glastonbury, with a family-violence defense capability alongside it. Open `index.html` to choose one.

All copy is built from **`MortonFamilyAndCriminalLaw_Site_Architecture.xlsx` (Rev. 1, 9/9/26)** — the XPRTS site architecture and content plan.

| # | Concept | Folder | Pages |
|---|---|---|---|
| 01 | **Editorial** | [`editorial/`](editorial/index.html) | Home, Family Law (2) |
| 02 | **Modern** | [`modern/`](modern/index.html) | Home, Family Law, Domestic Violence, Attorney, Service Area, Insights, Article, FAQ, Contact, Legal Notices (10) |
| 03 | **Quiet** | [`quiet/`](quiet/index.html) | same page set as Modern (10) |

## What the concepts carry

**Firm of record (NAP — identical everywhere)**

```
Morton Family and Criminal Law, PLLC
2837-A Main Street, Glastonbury, CT 06033
daniel@mfclegal.com
```

**Attorney** — Daniel M. Morton, admitted in Connecticut 4/10/2017, Juris No. 438184 (active).

**Seven practice areas**, each a hub with its Connecticut service pages listed:

| # | Practice area | Slug | Service pages |
|---|---|---|---|
| 01 | Divorce | `/practice-areas/divorce` | 16 |
| 02 | Custody & Visitation | `/practice-areas/custody-visitation` | 11 |
| 03 | Child Support | `/practice-areas/child-support` | 7 |
| 04 | Modification | `/practice-areas/modification` | 7 |
| 05 | Enforcement & Contempt | `/practice-areas/enforcement-contempt` | 8 |
| 06 | Prenuptial & Postnuptial Agreements | `/practice-areas/marital-agreements` | 5 |
| 07 | Domestic Violence (Criminal) | `/practice-areas/domestic-violence` | 7 |

Also included: the 38-question FAQ bank, the 44-topic Insights runway, the Tier 1–3 service area with the three courthouses, and the compliance layer.

## Compliance layer (from the workbook's Compliance tab)

- **Responsible-lawyer attribution** in the site-wide footer and on Contact — *"Attorney Daniel M. Morton is responsible for the content of this website."* (Conn. RPC 7.2(e), the only strictly required on-page wording.)
- **Footer disclaimer** — general information only, no attorney-client relationship, prior results do not guarantee a similar outcome.
- **Criminal scope stated plainly** on every page — family-violence matters only, no general criminal intake.
- **Intake-form disclaimer** and an **unchecked TCPA consent box** beside every form.
- **No superlatives and no specialist/expert/certified claims** anywhere in the copy (Conn. RPC 7.1, 7.4A).
- **Case results off** and no testimonials — the results box was left unchecked on onboarding, and testimonials need informed written consent.
- **Blog-post disclaimer** on the article pages.
- Legal-notices page (`disclaimer.html`, or the `#disclaimer` section on the Editorial home) covering disclaimer/attorney advertising, privacy, terms, accessibility and cookies.

## Open items still showing as placeholders

- **`[Phone number pending]`** — the supplied numbers (817 area code) are Fort Worth, Texas. The workbook recommends provisioning a local 860/959 number before the footer is templated, so the concepts show a visible placeholder rather than a number that would then have to change in schema, GBP and every citation.
- **Education and any additional court admissions** on the attorney profile.
- **Headshot** — the profile still uses stock photography.

## Structure

```
morton-designs/
├── index.html               # Landing page — links to all 3 concepts
├── build.py                 # Re-embeds header/footer after you edit them
├── editorial/
│   ├── index.html  family-law.html
│   ├── site-header.dc.html  site-footer.dc.html
│   ├── js/   components.js · support.js · image-slot.js · vendor/react
│   └── assets/  logo/ · img/
├── modern/
│   ├── index.html  family-law.html  criminal-law.html  profile.html
│   ├── service-area.html  insights.html  article.html  faq.html
│   ├── contact.html  disclaimer.html
│   ├── site-header.dc.html  site-footer.dc.html
│   ├── js/   components.js · support.js · morton-ui.js · vendor/react
│   └── assets/  logo/ · img/
├── quiet/                   # same page set as modern/
│   └── js/   components.js · support.js · morton-quiet-ui.js · vendor/react
├── docs/image-prompts.html  # Photography prompt brief
└── source-files/            # Original logos, photos, videos (not used by the sites)
```

Every concept folder is self-contained — you can copy one folder on its own and it still works.

### Page-name mapping

The concepts keep short filenames; the built WordPress site uses the workbook's slugs.

| File | Workbook page |
|---|---|
| `family-law.html` | `/practice-areas` — the six family pillars and their service pages |
| `criminal-law.html` | `/practice-areas/domestic-violence` |
| `profile.html` | `/attorneys/daniel-morton` |
| `service-area.html` | `/service-area` |
| `faq.html` | `/faq` |
| `insights.html` · `article.html` | `/insights` |
| `disclaimer.html` | `/disclaimer`, `/privacy-policy`, `/terms`, `/accessibility`, `/cookie-policy` |

## Header & footer

- Edit the header in `site-header.dc.html` and the footer in `site-footer.dc.html` inside each concept folder.
- **After editing either file, run `python3 build.py`.** This regenerates `js/components.js`, which embeds the header and footer into every page.
- Because of this, headers and footers show up **everywhere**: double-clicking the file locally, GitHub Pages, Vercel, Netlify, or any static host.
- React is bundled in `js/vendor/`, so the pages don't depend on a CDN.

## Deploy — GitHub Pages

1. Push this folder to a GitHub repo.
2. Go to **Settings → Pages → Deploy from a branch**, then choose `main` / `root`.
3. The site is at `https://<user>.github.io/<repo>/`, with each concept at `/editorial/`, `/modern/` and `/quiet/`.

`.nojekyll` is included, so GitHub serves the files exactly as they are.

## Notes

- **These are design concepts, not published attorney advertising.** Nothing here has been filed under Practice Book §2-28A, and the statutory references in the copy come from the workbook's content plan — Daniel confirms every legal specific at drafting (Conn. RPC 1.1, 7.1; ABA Formal Op. 512).
- **Editorial** is a two-page concept: the Domestic Violence pillar and the legal notices live as sections on its Home and Family Law pages rather than as separate pages.
- Each page carries a narrow-screen stylesheet block that collapses the fixed multi-column grids below 760px.
