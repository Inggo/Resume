# Resume

Interactive résumé at [inggo.dev](https://inggo.dev) — a rotating cube built with Astro + Vue 3 + Vuex, plus a printable A4 version.

## Stack

- **Astro 7** — static build, Vue integration (`src/vue-setup.js` entrypoint)
- **Vue 3 + Vuex** — cube faces, content panels, gallery overlay
- **Cloudinary** — background/gallery images (cloud: `eatnyome`)

## Layout

| Path | What |
|---|---|
| `public/data.json` | All résumé content |
| `src/config/images.js` | Cloudinary public IDs, keyed by entry name |
| `src/utils/images.js` | URL builder + joins the config into the data |
| `src/components/` | Cube, faces, per-face content panels, gallery |
| `src/mixins/_backgroundImage.js` | Background rotation + gallery wiring |
| `src/store/index.js` | Vuex store (faces, background, gallery) |
| `src/pages/index.astro` | Cube page |
| `src/pages/a4.astro` | Print/PDF version (ignores images) |

Cube faces: front = Bio, right = Portfolio, left = Work, top = Education, bottom = Skills, back = Links.

## Commands

```bash
npm install
npm run dev      # localhost:4321
npm run build    # → dist/
./deploy.sh      # build + rsync dist/ to inggo.dev  (alias: ./d)
```

## Adding an entry with a background gallery

Two files: the entry goes in `public/data.json`, its images in `src/config/images.js`.

### 1. Upload to Cloudinary

Upload into the folder matching the face, kebab-case (e.g. `portfolio/my-new-project`, `portfolio/my-new-project-2`). Record the **public ID only** — no base URL, no extension; `imageUrl()` requests `.avif` and Cloudinary converts on the fly, so upload PNG/JPG/WebP as-is.

Images render as a 20%-opacity background (`object-fit: cover`, `object-position: top center`) and full-size in the gallery, so wide screenshots (≥1600px) work best.

### 2. Add the entry to `public/data.json`

| Face | JSON path | Shape |
|---|---|---|
| Portfolio | `portfolio[].items[]` | `{ name, subtitle, description, link, role, responsibilities[], features[], technologies[], samples[], links[] }` — only `name` required |
| Work | `work_experience[]` | `{ company` or `organization, location, titles[{ name, date, responsibilities[] }] }` |
| Education | `education.tertiary[]` (and sibling lists) | `{ institution, campus, date, degree, location, link }` |
| Skills | `skills[]` | `{ category, items[] }` |

Copy the nearest existing sibling as a template — panels render off field presence, so omitted fields just don't appear.

### 3. Register the images in `src/config/images.js`

Add one entry under the matching face, keyed by the **exact** string from `data.json`. The lookup is a plain string match; a mismatch fails silently — no gallery button, no background.

| Face | Key must equal |
|---|---|
| `portfolio` | item's `name` |
| `work` | entry's `company`, or `organization` if there's no `company` |
| `education` | entry's `institution` |
| `skills` | category's `category` |
| `bio` / `links` | n/a — flat arrays, not keyed |

```js
"My New Project": [
  "portfolio/my-new-project",
  "portfolio/my-new-project-2",
],
```

One image gives a static background and a single-slide gallery; two or more rotate every 8s.

### 4. Verify

`npm run dev`, rotate to the face, arrow to the entry, and check that the background fades in, the 📷 button appears top-right (missing = key mismatch), and the gallery opens with ←/→, +/−, Esc.

### 5. Deploy

`./deploy.sh`. Gallery-only changes never affect the PDF, but `data.json` edits do — re-check `/a4` pagination.
