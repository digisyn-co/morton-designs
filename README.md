# Morton — Website Design Concepts

Three design concepts for **Morton** (Family & Criminal Law). Open `index.html` to choose one.

| # | Concept | Folder | Pages |
|---|---|---|---|
| 01 | **Editorial** | [`editorial/`](editorial/index.html) | Home, Family Law |
| 02 | **Modern** | [`modern/`](modern/index.html) | Home, Family Law, Criminal Law, Profile, Insights, Article, Contact |
| 03 | **Quiet** | [`quiet/`](quiet/index.html) | Home, Family Law, Criminal Law, Profile, Insights, Article, Contact |

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
│   ├── insights.html  article.html  contact.html
│   ├── site-header.dc.html  site-footer.dc.html
│   ├── js/   components.js · support.js · morton-ui.js · vendor/react
│   └── assets/  logo/ · img/
├── quiet/                   # same page set as modern/
│   └── js/   components.js · support.js · morton-quiet-ui.js · vendor/react
├── docs/image-prompts.html  # Photography prompt brief
└── source-files/            # Original logos, photos, videos (not used by the sites)
```

Every concept folder is self-contained — you can copy one folder on its own and it still works.

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

- **Editorial:** the Contact and Insights links go to the homepage `#contact` and `#insights` sections, because no separate pages were included for that concept.
- Contact details such as `[Phone number]`, `[Name Surname]` and `[Address]` are placeholders.
