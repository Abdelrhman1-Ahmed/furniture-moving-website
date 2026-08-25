# Redesign Audit & Blueprint — شركة النخبة لنقل الأثاث بالرياض

**Scope:** Full visual/structural audit of the existing single-page site (`index.html` 790 lines · `style.css` 1,411 lines · `script.js` 433 lines) and an implementation-ready redesign plan.
**Status:** Analysis only. No code has been modified. Implementation begins after plan approval.

---

## 1. Executive Summary

The site is a functional, SEO-conscious RTL landing page for a Riyadh furniture-moving company. Its structure is sound (hero → proof → services → differentiators → coverage → social proof → gallery → contact), the semantic HTML is decent, alt texts are good, and a token block already exists in CSS. However, the **visual system is not a system**: it is a collection of individually styled blocks with inconsistent spacing, typography, radii, shadows, and color usage. Measured facts:

| Metric | Value |
|---|---|
| Distinct font-size values | **35** (71 declarations) |
| Hardcoded hex colors outside tokens | **38 distinct** (88 occurrences) |
| `!important` declarations | **104** |
| Distinct border-radius values in use | 9 (5px→9999px) |
| Referenced image weight | **≈ 4.5 MB** (8 photos as 1024px PNGs/JPGs) |
| Unused/duplicate images in `/images` | ≈ **6.0 MB**, 12 files |
| Focus-visible styles | **0** |
| `prefers-reduced-motion` support | **None** |
| Favicon | **Missing** |
| Font payload | 2 families × up to 900 weight (10 weights) |

The current aesthetic leans on the generic "premium AI landing page" kit: teal gradient hero, blurred floating blobs, wave divider, gradient gold/green pill buttons, colored glow shadows, icon-in-colored-circle repetition, and zoom-in scroll animations. The redesign direction is therefore **subtraction and systematization**: keep the teal + gold brand identity (appropriate for the Saudi market), flatten all gradients into solids, collapse the token chaos into one scale, tighten oversized elements, and rebuild trust signals that currently undermine credibility (the fabricated-looking Google reviews placeholder).

Target feel: **institutional service company** — calm, precise, trustworthy. Not a startup template.

---

## 2. Current Design Assessment

### What already works (keep)
- Clear section narrative and logical IA order for a local-service funnel.
- Semantic landmarks (`nav`, `section`, `footer`), descriptive Arabic `alt`s, labeled form fields, `lang`/`dir` correct.
- JSON-LD `MovingCompany` schema, canonical, OG/Twitter tags.
- Teal (#0f3d3e) + gold (#c89b3c) identity — distinctive, culturally apt, worth keeping in flattened form.
- JS architecture: delegated handlers, IntersectionObserver, passive listeners, rAF-throttled scroll, central `CONFIG`.
- Mobile form inputs forced to 16px (prevents iOS zoom). WhatsApp form handoff is a good conversion pattern for this market.

### What does not work (summary)
1. **No enforced design system** — tokens exist but are bypassed 88 times by hardcoded colors; every component invents its own padding/radius/shadow.
2. **AI-template visual language** — gradients, blobs, wave, glow shadows, pill-everything, zoom-in-on-scroll.
3. **Oversized & over-decorated elements** relative to content density (see §4).
4. **Trust-damaging placeholder**: a "Google Reviews (5.0)" card whose button fires `alert('قريباً')`. Fabricated stars without reviews read as fake and hurt credibility.
5. **Accessibility gaps**: zero keyboard focus styling, non-keyboard lightbox/gallery, drawer without dialog semantics or focus trap, alert()-based validation with dead `.field-error` markup, failing contrast on the WhatsApp button and gold small-text.
6. **Performance drag**: 1024×1024 PNGs rendered at ~360px, 376 KB logo shown at 52 px, 12 dead duplicate assets (~6 MB), backdrop-filter blur layers, persisted `will-change`, duplicated smooth-scroll mechanisms.
7. **Responsive CSS fought with specificity** (104 `!important`, mostly in the ≤920px drawer block) instead of being designed.

---

## 3. Major Problems (ranked overview)

| # | Problem | Severity |
|---|---|---|
| P1 | Image weight/format: 8 referenced photos ≈ 4.5 MB (1024² PNGs displayed at ≤560px); logo.png 376 KB at 52 px | **Critical** |
| P2 | No keyboard accessibility: no `:focus-visible` anywhere, lightbox & gallery items not keyboard-operable, drawer lacks dialog semantics/focus trap | **Critical** |
| P3 | Contrast failures: white on `#25D366` (WhatsApp btn ≈ 1.9:1), gold `#C89B3C` small text/icons on white ≈ 2.6:1, footer keyword line `rgba(255,255,255,.4)` | **Critical** |
| P4 | Google-reviews placeholder with fake "(5.0)" stars + `alert()` button — damages professionalism/trust | **Critical** |
| P5 | Form UX: validation via `alert()`, `.field-error` spans never populated (dead markup), `window.open` popup-blocker risk, `formSuccess` shown before send confirmed | High |
| P6 | Gradient/glow/blob decorative layer (hero gradient + 3 blur blobs, wave SVG, gradient buttons, gold/whatsapp colored shadows, Instagram-gradient icon) | High |
| P7 | Spacing anarchy: 18/14/22/24/26/28/32/36/40/48/55/70/85/90… no scale; per-component one-off paddings | High |
| P8 | Typography anarchy: 35 font sizes, 2 families × 10 weights, `letter-spacing` on Arabic script, weight-900 headings | High |
| P9 | Component inconsistency: same "card" concept with radii 14/22/30, paddings 22–48px, 3 different dark background colors, 6 button variants with 3 heights | High |
| P10 | Oversized/trendy sizing: 9999px pill on all buttons, radius-xl 30px banner, hero title clamp→3.1rem @900, repeated icon-in-circle motif (36/44/48/52/64px circles) | High |
| P11 | Responsive strategy by override: breakpoints only 1080/920/768; drawer styles need 25+ `!important`; areas collapse to 1 column already at 1080; gallery collapses to a very long 1-column stack at 768 | Medium |
| P12 | Motion excess: zoom-in on nearly everything, stagger delays to 500 ms, hover translateY/scale on informational cards, image zooms, 1800 ms counters; no reduced-motion path; duplicated smooth scroll with mismatched offset (JS 85 vs `--nav-height` 80); persistent `will-change` | Medium |
| P13 | IA redundancy: nav has 8 items; Social-banner section duplicates footer social block; Gallery reuses the exact same files as Services; Areas section is thin; footer SEO keyword-stuffing line looks unprofessional | Medium |
| P14 | Code hygiene: inline styles in HTML (lines 551, 555, 619, 637), duplicate `google-site-verification` metas (lines 4, 87), missing favicon, `overflow-x:hidden !important` on html+body masking real overflow bugs | Medium |
| P15 | Minor polish: custom scrollbar gold hover, `::selection` gold, og:image = 376 KB PNG, obsolete `meta keywords`, two `data-target` counters vs static "24/7" stat inconsistency | Low |

---

## 4. Layout Audit

**Current structure:** sticky dark navbar (80px) → dark gradient hero with blobs + wave → white stats band (45px pad) → services (3×2 cards) → gray why-us (3×2) → areas (2×2 centered, max-960) → reviews placeholder card → gallery (3×2 incl. CTA tile) → dark social banner → contact (info+form panels) → dark footer.

**Findings**

| Area | Observation | Issue |
|---|---|---|
| Page rhythm | Section paddings: 80–90 hero, 45 stats, 85 standard, 70+50 footer; header margin-bottom 55px | No vertical rhythm unit; adjacent sections breathe differently |
| Background alternation | white → white(stats) → white(services) → gray(why) → white(areas) → white(reviews) → white(gallery) → **dark banner** → white(contact) → **dark footer** | Two near-adjacent dark blocks (banner→footer) sandwich a lone white section; alternation feels arbitrary |
| Container | max-width 1220px, side gutter **18px desktop / 14px mobile** | Gutters too thin for 1220px canvas; wide/normal/narrow content widths unmanaged (areas grid self-centers at 960, reviews at 760 — ad hoc) |
| Hero | 2-col grid 1.15fr/0.85fr, badge + H1 + paragraph + **3 CTAs** + trust row; image with rating badge below | 3 equal-weight CTAs compete; blobs/wave add noise, not hierarchy |
| Stats band | 4 items, no header, sits between hero and services without separation logic | Reads as orphan strip; "24/7" item breaks the counter pattern of its siblings |
| Services vs Why vs Gallery | Three consecutive 6-tile grids (3-col) | Monotonous 6-card rhythm; gallery reuses service images → no new information |
| Areas | 2×2 text rows in cards, centered 960px | Over-packaged for thin content (4 lines of text) |
| Contact | 0.9fr/1.1fr split, both panels carded with shadow+border | Double-carding inside a section that already has clear halves; map fixed at 220px |
| Density hotspots | Hero (7 stacked elements), contact-info panel (4 items + map), footer col 4 | Crowded vs. empty areas/reviews sections → unbalanced page |

---

## 5. Spacing Audit

Measured one-off values in production CSS: `4 5 6 8 10 12 13 14 16 18 20 22 24 26 28 30 32 36 40 48 55 70 85 90`.

Representative inconsistencies:

| Element | Values found |
|---|---|
| Card interiors | service 26/24 · why 32/26 · area 22/26 · google 40/32 · social 48/36 · contact 36 |
| Grid gaps | 28 (services/why/stats) · 22 (areas/gallery) · 24 (social) · 16 (form-row) |
| Buttons | 12/26 base · 14/32 large · 13/30 google variant |
| Section header → content | 55px everywhere (odd value) |
| Icon-to-label gaps | 8/10/12/14 depending on component |

**Verdict:** adopt a strict 4-base scale (§18). Every margin/padding/gap must resolve to a token; the odd values above disappear.

---

## 6. Typography Audit

- **Families:** Cairo (headings) + Tajawal (body), loaded at weights 400/600/700/800/900 and 400/500/700/800/900 → 10 font files. Weight 900 used for logo/H1/stat numbers; 800 for most headings; 700 for everything emphatic.
- **Sizes:** 35 distinct values from 0.72rem to clamp(3.1rem). Adjacent components differ meaninglessly (service h3 1.22rem vs why h3 1.15rem vs gallery-cta h3 1.25rem).
- **Line-heights:** body 1.8 global; headings 1.1–1.35 inconsistently.
- **Letter-spacing:** `.logo-title { letter-spacing: 0.5px }` — letter-spacing on connected Arabic script disturbs the calligraphic rhythm; should be 0.
- **Hierarchy problem:** hierarchy is carried almost entirely by *size* (big badge → huge 900 title). Weight/position/color are underused, forcing oversized type.
- Numerals: stat counter correctly uses `ar-SA` locale digits (١٬٥٠٠) — keep; phone numbers mix RTL/LTR contexts (handled ad hoc with inline `direction:ltr`).

---

## 7. Color Audit

Current palette in play: teal trio + gold trio + slate/navy trio + neutral ramp + WhatsApp green duo + TikTok pink/cyan + Instagram gradient + Google red + hardcoded grays (`#cbd5e1`, `#fee2e2`, `#dc2626`, `#1a1a1a`, …).

**Issues**
1. **Accent inflation.** Brand accents (teal, gold) + channel brands (WhatsApp, TikTok, Instagram, Google) all render at full saturation in UI chrome. TikTok pink/cyan appear only as hover borders — pure decoration.
2. **Three different darks:** navbar `rgba(7,31,32,.95)`, hero gradient `#071f20→#134b4c`, banner/footer `#0b1522`. They never match each other.
3. **Gradients everywhere:** hero bg, primary(gold) btn, whatsapp btn, gallery CTA tile, instagram icon. Direction: none of these survive.
4. **Colored glow shadows:** `--shadow-gold` (rgba(200,155,60,.28)) and `--shadow-whatsapp` (.3 alpha green) — glow effects.
5. **Contrast failures (WCAG):**
   - White on `#25D366` ≈ **1.9:1** (fails; main conversion button!).
   - Gold `#C89B3C` on white ≈ **2.6:1** — used for icons/small emphasis (fails non-text 3:1 and any text use).
   - Footer keyword line `rgba(255,255,255,.4)` on `#0b1522` — fails.
   - Passing: `#64748B` muted on white (4.76:1), gold-light `#E5B85A` on dark surfaces.
6. **Token bypass:** 38 distinct raw hex values coexist with the token block.

---

## 8. Component Audit (inventory)

| Component | Count | Current inconsistencies |
|---|---|---|
| Navbar | 1 | Dark translucent + backdrop-blur; 8 icon-bearing links; underline hover; active state gold |
| Mobile drawer | 1 | White drawer redesigned via 25+ `!important` overrides; close button 36px (<44 target); links become boxed chips (different paradigm than desktop) |
| Hero badge/trust/badge-on-image | 3 badge patterns | Different paddings/colors/radii each |
| Stat cards | 4 | Borderless; mixed animated/static numerals |
| Service cards | 6 | Image 205px + overlapping icon square; radius-lg; shadow-md; hover lift −6px + border→gold + img zoom 1.08 |
| Why cards | 6 | Circle icon 52px; radius-md; shadow-sm; hover lift −4px — *a different card dialect than services* |
| Area cards | 4 | Row-cards; radius-md; third shadow level |
| Google placeholder | 1 | 64px circle icon, dashed gold divider, disabled-looking CTA w/ alert |
| Gallery tiles + Lightbox | 6+1 | Overlay teal 85%; zoom 1.06; CTA tile inside grid; lightbox close positioned off-content, not keyboard reachable |
| Social banner + cards | 1+2 | Dark rounded-30 banner; instagram gradient icon; tiktok pink border hover |
| Contact info items | 4 | 44px circles; one item recolored via inline style (email/red) |
| Form | 7 fields | Inputs radius-md(14) bg #f8fafc; select native; errors dead; submit = whatsapp-branded |
| Floating buttons | 2 | Pill w/ label desktop → 44px circles mobile; hide-on-form-focus logic |
| Back-to-top | 1 | 42px (40 mobile) — below 44 touch minimum |
| Footer | 4 cols | Heading gold bar; long email overflow risk on ≤360px; SEO keyword line |

---

## 9. Button Audit

Variants found: `btn-primary` (gold gradient, dark text), `btn-whatsapp` (green gradient, white text), `btn-call` (teal + gold border), `btn-outline` (white ghost, hero-only), `btn-google-link` (teal + gold border, own padding), plus float variants. Sizes: base 12/26, large 14/32, google 13/30. All `radius-full`.

**Problems**
- Six one-off variants; three competing CTAs side-by-side in hero (gold + green + ghost) with no primary/secondary logic.
- Colored gradients + colored glow shadows on buttons.
- `translateY(-2..3px)` + `scale(1.04)` hovers; no pressed state; **no focus-visible ring anywhere**.
- `disabled-placeholder` class + inline `onclick="alert(...)"` (index.html:470).
- Pill shape on every button reads trend-driven; combined with 2px borders on transparent buttons creates heavy outlines.

---

## 10. Card & Container Audit

Everything is a rounded, bordered *and* shadowed card — including content that isn't interactive (stats, areas). Radius in actual use: 5(scrollbar) / 8(sm) / 12(drawer links) / 14(md) / 22(lg) / 30(xl) / 50% circles / 9999 pills. Shadow levels sm/md/lg/xl + two colored glows; several components combine border + shadow + lift-hover simultaneously. Hover lifts are applied to purely informational tiles (why/area/stat), teaching users things are clickable when they aren't.

**Direction:** cards only where grouping aids scanning (service, why, contact panels, gallery). Borders as default elevation; shadow reserved for true overlays (drawer, lightbox, floating cluster). One card dialect, one resting state, one hover grammar for genuinely clickable cards only.

---

## 11. Animation Audit

Inventory: AOS-style entrances (`fade-up/right/left`, `zoom-in`) with per-card delays 0–500ms; navbar bg transition; nav-link underline width; card lifts; image zooms (1.06/1.08); stat count-up 1800ms; smooth scroll (CSS `scroll-behavior` **and** JS `window.scrollTo` — duplicated, offset mismatched 85 vs 80); drawer slide 350ms; overlay fade; lightbox show/hide; float-button auto-hide; hover transforms everywhere.

**Issues:** zoom-in entrance is gimmicky; 500ms stagger delays perception; no `prefers-reduced-motion` branch; `will-change` persists after animation completes; entrance animations exist on ~40 elements including below-fold minor tiles.

---

## 12. Responsive Audit

- Breakpoints: 1080 / 920 / 768 only. No ≥1440 handling (container caps fine), no <380 handling.
- 1080: services/why →2col, stats→2col, **areas→1col (far too early)**, gallery→2col, footer→2col.
- 920: hero stacks & centers; nav-actions hidden entirely (phone unreachable in header until floating buttons appear); drawer replaces nav via `!important` war.
- 768: everything →1col; container gutter 14px; form-row stacks; float buttons become 44px circles; back-to-top 40px; gallery becomes a 6-tile single column (very long scroll).
- Touch targets: drawer-close 36px, back-to-top 40/42px — below 44×44 recommendation.
- Footer email (43 chars) has no `word-break` → overflow risk ≤360px.
- Map iframe height fixed 220px regardless of viewport.
- `overflow-x:hidden !important` on both `html` and `body` masks layout bugs rather than preventing them.

---

## 13. Accessibility Audit

| Check | Status |
|---|---|
| Color contrast (key pairs) | ❌ WhatsApp btn 1.9:1 · gold small text 2.6:1 · footer-seo fails · muted passes |
| Keyboard navigation | ⚠️ Links/buttons tabbable, but: gallery items & lightbox not keyboard-operable; drawer has no focus trap/return; Escape works (good) |
| Focus visibility | ❌ No `:focus-visible` styles at all (browser default outline is the only indicator, inconsistent cross-browser) |
| Drawer semantics | ❌ Missing `role="dialog"`, `aria-modal`, focus management |
| Forms | ⚠️ Labels present ✅; but errors delivered via `alert()`; `.field-error` + `aria-describedby` wiring absent; `novalidate` set yet custom validation incomplete |
| Touch targets | ⚠️ Two controls <44px |
| Motion sensitivity | ❌ No `prefers-reduced-motion` handling |
| Icons | ⚠️ FA icons lack `aria-hidden="true"` (decorative glyphs may be announced) |
| Headings | ⚠️ Social-banner section jumps to `h3` with no `h2`; otherwise ordered |
| Language | ✅ `lang="ar" dir="rtl"`; phone/email LTR isolation handled ad hoc |

---

## 14. Performance Considerations

| Item | Current | Cost | Recommendation |
|---|---|---|---|
| Service/gallery photos | 1024×1024 PNG 0.7–1.0 MB each, shown ≤400px | ~4.1 MB of the page | Convert to WebP q≈78 at ≤800px wide → ~60–90 KB each (**−85%**) |
| Logo | 376 KB PNG shown at 52px | LCP/OG cost | Compress/export ≤20 KB; provide 512px OG variant |
| Dead assets | 12 unused/duplicate files ≈ 6.0 MB (`gallery_*.png` = service dupes; `Gemini_Generated_Image_.jpg`=`ac.jpg`; `truck.jpg`=`hero_truck.png`; `truck_nokhba.jpg`=`hero_truck.jpg`; `office_nokhba.jpg`=`office.jpg`; 3 WhatsApp JPEGs unused) | Repo bloat | Delete or archive; the 3 WhatsApp photos are candidates for *real* gallery content if owner approves |
| Fonts | 2 families × 10 weights | ~10 requests, hundreds of KB | One family (Tajawal), weights 400/500/700/800 → 4 files |
| Font Awesome | Full CDN CSS for ~30 icons | ~100 KB CSS + webfont | Inline SVG sprite of needed icons (~6 KB total) or keep CDN if preferred |
| Effects | `backdrop-filter: blur(14px)` navbar; 3 × `blur(80px)` blobs; persistent `will-change` | GPU/memory, jank on low-end | Solid navbar; delete blobs; scope/remove `will-change` |
| Hero image | `loading="eager"` ✅ but no `fetchpriority`/preload; declared 560×400 vs intrinsic 1024×436 (ratio mismatch → crop shift) | CLS risk | Preload + correct intrinsic ratio + `srcset` |
| Scripts | End-of-body, vanilla, observer-based | Fine | Keep; optionally `defer` |
| Duplicated smooth scroll | CSS + JS | Trivial but messy | One mechanism (JS, for offset control) |

---

## 15–22. Design System Proposal

### 15. Design principles (drive every decision)
1. **Clarity over decoration** — nothing purely ornamental survives.
2. **One system, zero exceptions** — if a value isn't a token, it doesn't ship.
3. **Compact confidence** — restrained sizes signal maturity; hierarchy comes from weight, position, and space — not bigness.
4. **Borders before shadows** — elevation through surface tone and 1px lines; blur/shadow reserved for true overlays.
5. **Solid color only** — flat fills; interest from composition and typography.
6. **Motion means feedback** — short, purposeful, reducible.
7. **Respect the market** — RTL-first, Arabic typographic conventions (no letter-spacing, proper numeral isolation).

### 16. Color Tokens

```
── Brand ──────────────────────────────────────────
--teal-900   #08252A   (header/footer/banner dark surface)
--teal-800   #0E3438   (hover/darker band)
--teal-700   #0F3D3E   PRIMARY (buttons, links, active)
--teal-600   #16595B   (primary hover)
--teal-100   rgba(15,61,62,.08)  (tint bg / selected)
--teal-50    rgba(15,61,62,.05)

── Accent (functional only: ratings, highlights, markers) ──
--gold-600   #A87B24   (icons/markers on light — 3:1+)
--gold-500   #C89B3C   (borders, bars, large elements)
--gold-300   #E5B85A   (accent text on dark)

── Neutrals ───────────────────────────────────────
--bg         #F6F8FA   (page)
--surface    #FFFFFF   (cards)
--surface-2  #EEF2F5   (inset/tint blocks, inputs)
--line       #E3E8EE   (borders)
--line-strong#CBD5E1   (input borders)
--ink        #101826   (headings)
--ink-2      #3D4C5E   (body)
--ink-3      #64748B   (muted/meta)
--on-dark    #F4F7F9   (text on teal-900)
--on-dark-2  rgba(244,247,249,.72)

── Semantic / channels ────────────────────────────
--success    #15803D    --warning  #B45309    --error   #DC2626
--whatsapp   #128C7E   ← darker brand green; white text = AA-passing.
                        Bright #25D366 allowed ONLY as icon tint, never behind white text.
Channel brand colors (TikTok/Instagram/Google) may appear ONLY inside their small
brand glyph, never as UI borders/backgrounds/hovers.
```

Removed: all gradients, TikTok pink/cyan, Instagram gradient, Google red as UI colors, colored shadows.

### 17. Typography Tokens

Single family: **Tajawal** (cleaner at small sizes, better screen legibility than Cairo for body). Weights: 400 / 500 / 700 / 800. *(If brand insists on dual families, keep Cairo strictly for Display+H2 — but single-family is recommended: −1 family, −6 weights.)* Letter-spacing: **always 0** for Arabic.

| Role | Desktop | Mobile | Weight | Line-height | Usage |
|---|---|---|---|---|---|
| Display (hero H1) | 34px / 2.125rem | 26px | 800 | 1.35 | once, hero |
| H2 (section titles) | 24px | 21px | 800 | 1.4 | section headers |
| H3 (card titles) | 17px | 16px | 700 | 1.5 | cards, panels |
| Lead (section subtitle) | 16px | 15px | 400 | 1.75 | subtitle under H2 |
| Body | 15.5px | 15.5px | 400 | 1.75 | paragraphs |
| Small / list | 14px | 14px | 400 | 1.65 | card bodies, footer |
| Caption / meta | 12.5px | 12px | 500 | 1.5 | labels-over-values, timestamps |
| Label (form) | 13.5px | 13.5px | 700 | — | form labels |
| Button | 14.5px | 14.5px | 700 | — | all buttons |
| Stat number | 26px | 22px | 800 | 1.1 | `font-variant-numeric: tabular-nums` |

Rules: hierarchy via weight + size steps of ≥2px only; body measure ≤ 68ch; numerals in phone/price contexts isolated `dir="ltr"`.

### 18. Spacing Tokens (4-base scale)

```
--space-1: 4px    hairline offsets, icon nudges
--space-2: 8px    icon↔label gap, chip padding-y
--space-3: 12px   related-element gap, list row gap
--space-4: 16px   component internal padding (compact), grid gap (mobile)
--space-5: 20px   input/button block padding, card interior rhythm
--space-6: 24px   card padding (standard), grid gap (desktop), block gaps
--space-7: 32px   grouped-block separation (e.g., form-row ↔ next group),
                  contact panel padding, banner padding
--space-8: 40px   section-header → content
--space-9: 56px   section padding-y (tablet)
--space-10: 72px  section padding-y (desktop)   [was 85–90]
--space-11: 96px  hero padding-y desktop only
```

Mapping examples: card padding 24; grid gaps 24/16; button padding 10px 20px (md) / 12px 24px (lg); input height 44; nav height 72/64; section header mb 40; footer top/bottom 56/24.

### 19. Radius Tokens

```
--radius-sm: 6px   chips, badges, small tags
--radius-md: 10px  buttons, inputs, selects
--radius-lg: 14px  cards, media frames, panels, map, lightbox image
--radius-full 9999px  avatars/icon dots ONLY (not buttons)
```

Retired: 22px, 30px, pill buttons, 12px drawer-link special case. Buttons become 10px-rounded rectangles — instantly less "template".

### 20. Shadow Tokens

```
--shadow-1: 0 1px 2px rgb(16 24 38 / .05)      (resting cards — optional, prefer border-only)
--shadow-2: 0 6px 16px rgb(16 24 38 / .10)     (hoverable cards on hover only)
--shadow-3: 0 16px 40px rgb(16 24 38 / .18)    (overlays: drawer, lightbox, mobile menu)
Focus ring (not a shadow): 0 0 0 3px rgba(22,89,91,.35) on :focus-visible
```

Rules: colored shadows banned; no shadow stacking; a surface gets either a border or a shadow — never both at rest.

### 21. Container System

```
--container: 1180px        standard content width (slightly tighter than 1220)
gutter: 24px desktop / 16px ≥480 / 14px <480
--container-narrow: 760px  form column, reviews/testimonials, legal text
Full-bleed: only hero/footer/banner backgrounds (content still in .container)
```

### 22. Grid System & Breakpoints

Breakpoints: **480 / 768 / 1024 / 1280** (add small-mobile tier; drop the awkward 920).

| Grid | ≥1280 | 1024–1279 | 768–1023 | <768 |
|---|---|---|---|---|
| Services | 3 col | 2 col | 2 col | 1 col (or 2-col compact list ≥560) |
| Why-us | 3 col | 3 col | 2 col | 1 col |
| Stats | 4 col | 4 col | 2 col | 2 col |
| Areas | 4 col chips | 2 col | 2 col | 2 col ≥480 else 1 |
| Gallery | 3 col | 3 col | 2 col | 2 col ≥480 else 1 |
| Contact | 2 col (0.95fr/1.05fr) | 2 col | 1 col | 1 col |
| Footer | 4 col (1.5/0.9/1/1.1) | 2 col | 2 col | 1 col |

All grids `gap: var(--space-6)` desktop / `--space-4` mobile. No negative-margin hacks; remove `html/body overflow-x !important` and fix causes.

### 23. Component Standards

**Buttons** — rectangle, radius-md, weight 700, no gradients, no lift; hover = darken/lighten + shadow-2; active = pressed (translateY 1px); focus-visible ring mandatory.

| Variant | Look | Use |
|---|---|---|
| Primary | solid teal-700, white text | ONE per view-group: “احجز موعدك” |
| Secondary | white surface, 1px line-strong border, ink text | paired alternative actions |
| WhatsApp | solid `--whatsapp` #128C7E, white text | WhatsApp-labeled actions only |
| Ghost/on-dark | transparent, on-dark border/text (hero) | tertiary on dark surfaces |
| Destructive | error red (currently unused, defined for completeness) |

Sizes: sm 34px (dense contexts) · md 42px (default) · lg 46px (hero/form submit only). Padding md: 10px 20px. Icon gap 8px. Disabled: 45% opacity + `cursor:not-allowed` + real `disabled`/`aria-disabled` (no alert()).

**Inputs/Selects/Textarea:** height 44 (textarea min 96), radius-md, `surface-2` bg → white on focus, 1px `line-strong` border → teal-700 + ring on focus, error = 1px `--error` + `.field-error` text 12.5px wired via `aria-describedby`, success inline note. Select gets custom chevron. Labels always visible (no placeholders-as-labels).

**Cards:** white surface, 1px `--line`, radius-lg, padding 24 (media-topped cards: media flush, body 20/24). Resting: border only. Hover (only if the whole card is a link): shadow-2 + border teal-100, **no translate** (or ≤2px). Informational cards get no hover.

**Header/nav:** solid teal-900 (no blur), height 72/64; links plain text 14px/500 without icons (desktop); active = 2px gold underline + on-dark text; scrolled state = shadow-1 only. Mobile drawer: teal-900 full-height panel (matches header, removes the current white-drawer `!important` fork), 320px, dialog semantics, focus trap, 44px targets, links as plain rows with dividers.

**Badges/chips:** radius-sm, tint bg, 12.5px/700 — one style everywhere (replaces section-badge/hero-badge/google variants).

**Icon containers:** max ONE circular-icon motif site-wide (contact rows, 40px, teal-50 bg). Elsewhere: bare 18–20px icons inline with text. Kill 36/44/48/52/64 circle zoo.

**Lightbox:** dialog role, focus trap, Esc/close/overlay-click, prev/next arrows, caption from alt, thumbnails optional.

**Tables/filters/tabs/modals:** none exist today; standards defined in tokens for future (tabs = underline style; filters = chip toggles) — documented, not built now.

---

## 24. Page-by-Page Redesign Strategy (single page, section by section)

**Visual hierarchy target (whole page):** ① Hero value-proposition + primary CTA → ② proof strip (stats) → ③ services scan → ④ differentiators → ⑤ contact/conversion → supporting: areas, gallery, social.

1. **Navbar.** Now: translucent blur, 8 icon links, dual CTAs. → Solid teal-900, 72px, 6 plain links (drop حساباتنا — social lives in its strip + footer; تقييمات جوجل link drops with the section), one compact call CTA + WA icon button. Active-section underline kept.
2. **Hero.** Remove: gradient, 3 blobs, wave SVG. Solid teal-900 field (or `bg` with teal-900 left panel — recommend solid dark for contrast with white page). Badge simplified to chip. H1 → 34px/800 (from clamp→49.6px/900). Description trimmed to ~2 lines. **CTAs: Primary “احجز موعدك الآن” + WhatsApp secondary only** — phone number moves into the trust row as text-with-icon (it’s already 4× elsewhere). Trust row keeps 3 items, smaller. Image: real aspect ratio, radius-lg, subtle border, rating badge becomes small floating chip or moves into stats. Padding-y 96→72 desktop.
3. **Stats strip.** Merge visually with hero bottom OR keep as slim band: 4 columns, no cards, gold-600 icons 20px, number 26px/800, label 13px. Make “24/7” consistent (either all animate or none — recommend none; instant paint, less JS). Top+bottom 1px lines instead of shadow.
4. **Services.** Header mb 40. Cards: media 180px, radius-lg, NO overlapping icon square (icon moves inline before H3, 20px, gold-600). Hover: border tint only. Link “اطلب الخدمة” stays, arrow-left kept (RTL-correct). Grid gaps 24.
5. **Why us.** Same card dialect as services but text-only (no media): icon 20px inline or 40px single sanctioned circle, padding 24. Consider 3×2 → 2×3 at 1024 to break the monotony of three identical grids.
6. **Areas.** Demote from cards to **chip cloud**: 8–12 location chips (radius-sm, surface bg, 1px line, 13.5px) flowing inline within narrow container — thinner, scannable, honest about content weight. Optionally fold into a band directly above contact.
7. **Reviews.** **Remove the placeholder card entirely.** Replace with either (a) nothing (fold GBP badge into hero trust row: “تقييمنا على جوجل ★ 5.0” once the profile is live) or (b) 3 written customer quotes clearly attributed as client statements (owner must supply real ones). Never render stars/ratings that don’t exist.
8. **Gallery.** Deduplicate from services: use the 3 WhatsApp photos on disk (pending owner approval) + new job photos; until then reduce to 4 tiles + CTA tile. Uniform radius-lg, 4:3, overlay caption on hover only (desktop), tap opens lightbox (keyboard accessible). CTA tile: solid teal-800, no gradient.
9. **Social strip.** Convert dark banner into a slim horizontal band (teal-900, 64px tall) between gallery and contact: “تابعنا” + two ghost icon-buttons (TikTok/Instagram) with brand glyph only — removes the big rounded-30 card and the dark-white-dark sandwich.
10. **Contact.** Panels lose double elevation: one surface card for the form; info column becomes open list (icon-dot rows + map) without its own card. Narrow-container option: center a single 760px booking card with info condensed above — evaluate during implementation; default keeps 2-col. Inputs per §23; inline validation; submit = Primary lg (WhatsApp icon allowed) with loading state; success message replaces form area.
11. **Footer.** 4 cols → keep; heading gold bar removed (use 12.5px/700 uppercase-style label in on-dark-2); email gets `word-break`; replace SEO keyword line with a clean descriptor line (“نقل أثاث بالرياض — فك وتركيب وتغليف وتخزين” once, normal contrast); social icons 40px ghost squares.
12. **Floating layer.** Keep WA + call floats (business-critical in KSA), restyle: 48px circles, shadow-3, no labels on any viewport (labels duplicated nav CTAs), hide-behavior logic kept. Back-to-top: 44px, appears >600px.

---

## 25. Responsive Strategy (behavioral, not shrunken-desktop)

- **≥1280:** as designed. Container 1180.
- **768–1279:** grids step down per §22 table; hero remains 2-col until 1024 then stacks **left-aligned** (not center — centered hero text on tablet reads promotional; keep start-aligned, image below).
- **<768:** nav → drawer (dialog, teal-900); hero single column, badge/H1/copy/CTAs stacked, CTAs full-width lg; stats 2×2; services 1-col with 160px media; gallery 2-col ≥480; contact stacks (info condensed: phone/WA rows only + collapsible map); form fields full-width; footer accordion-free simple stack.
- **<380:** gutters 14px, Display 26px, stats 2×2 with 22px numerals, chips wrap, floating buttons 48px with safe-area inset (`env(safe-area-inset-bottom)`).
- Fixed rules: touch targets ≥44; inputs 16px font (iOS zoom); map height 200 (mobile) via aspect-ratio; tables n/a; nothing horizontal-scrolls; drawer width `min(320px, 86vw)`.

---

## 26. Animation Strategy

| Keep | Retire | Add |
|---|---|---|
| Nav underline slide (150ms) | zoom-in entrances | `:focus-visible` ring transition |
| Card hover border/shadow fade (150–200ms ease-out) | hover translateY/scale on informational cards | Button darken + pressed 1px (120ms) |
| Drawer slide 280ms ease-out + overlay fade 200ms | image zoom-on-hover (or cap at 1.02) | Lightbox fade/scale-in 200ms |
| Float-layer show/hide fade 200ms | 500ms stagger chains (cap chain 240ms total, 60ms steps) | Form field error shake? **No** — color + text only |
| Smooth scroll via JS only (offset = measured header height) | CSS+JS duplication; blob/wave (static decor removed anyway) | — |
| Count-up: **remove** (instant values; calmer + cheaper) | persistent `will-change` | — |

Durations: micro 120–150ms · standard 200ms · layer 280ms. Easing: `cubic-bezier(.2,0,.2,1)`. Entrances: single fade-up 8–12px, 240ms, applied to section headers and card groups only (not every tile). **`@media (prefers-reduced-motion: reduce)`: disable entrances/smooth-scroll/counters; keep opacity-only fades ≤120ms or none.**

---

## 27. Prioritized Issues (final classification)

**Critical** — fix first, non-negotiable
1. Optimize/resize all shipped images (WebP, correct dimensions) — P1
2. Keyboard + focus-visible system (drawer dialog semantics, lightbox, gallery) — P2
3. Contrast remediation (WhatsApp button color, gold usage, footer line) — P3
4. Remove/replace fake Google-reviews placeholder — P4

**High** — core redesign scope
5. Form inline validation + success/error states; popup-blocker-safe submission — P5
6. De-gradient/de-glow: hero, buttons, shadows, icons; remove blobs/wave — P6
7. Adopt spacing scale; purge one-off values — P7
8. Consolidate typography (one family, 4 weights, 10 roles) — P8
9. Unify card/button/badge/dark-surface dialects; radius overhaul — P9/P10

**Medium**
10. Responsive re-breakpointing + drawer rewrite without `!important` — P11
11. Motion cleanup + reduced-motion — P12
12. IA trims: nav 6 items, social slim-strip, gallery dedupe, areas→chips, footer line — P13
13. Hygiene: favicon, inline styles, duplicate metas, overflow-x removal, dead assets deletion — P14

**Low**
14. Scrollbar/selection theming consistency, meta keywords removal, og:image swap, counter-pattern consistency — P15

---

## 28. Implementation Phases

**Phase 1 — Foundation (tokens & reset).** New `:root` token block (colors §16, type §17, space §18, radius §19, shadows §20, containers §21, breakpoints §22), base reset, focus-visible ring, reduced-motion block. Deliverable: stylesheet skeleton; page still looks “old but working”.

**Phase 2 — Global chrome.** Header/nav (+drawer rewrite, dialog semantics), footer, buttons, forms, badges, floating layer, back-to-top.

**Phase 3 — Sections.** Hero → stats → services → why → areas → reviews replacement → gallery(+lightbox) → social strip → contact. Each section: restructure HTML, restyle, verify against hierarchy map (§24).

**Phase 4 — Responsive pass.** Apply §22/§25 at 480/768/1024/1280 + <380 spot checks; remove all `!important` from media queries; kill overflow guards after fixing roots.

**Phase 5 — Motion.** Implement §26 durations/easings; entrance pass; remove counters; verify reduced-motion.

**Phase 6 — Polish & QA.** Accessibility sweep (§13 checklist), performance pass (image pipeline, font trim, FA decision, preload), cross-browser (Chrome/Edge/Safari iOS/Android Chrome/Firefox), visual QA at 360/390/768/1024/1440/1920, interaction QA (keyboard-only run, screen-reader smoke test), Lighthouse targets: Perf ≥ 90 mobile, A11y ≥ 95, CLS < 0.05, LCP < 2.5s.

Suggested commit sequence mirrors phases; each phase leaves the site fully shippable.

---

## 29. Visual Quality Checklist (acceptance gates)

- [ ] Zero raw hex/px values in component CSS (tokens only; breakpoints excepted)
- [ ] ≤ 12 font-size declarations, all from type scale
- [ ] One family, ≤ 4 weights loaded
- [ ] All radii ∈ {6,10,14,full}
- [ ] Shadows only on: hoverable cards (hover), drawer, lightbox, floating cluster
- [ ] No gradients anywhere; no blurred decor; no colored glows
- [ ] Exactly one Primary CTA visible per viewport region; WhatsApp green only on WhatsApp actions
- [ ] Every interactive element: hover + active + focus-visible states
- [ ] All touch targets ≥ 44px
- [ ] Contrast: body ≥ 4.5:1, large/labels ≥ 3:1, verified pairs listed in §16
- [ ] `prefers-reduced-motion` honored; no continuous animations
- [ ] Total image payload ≤ 700KB; no image > 200KB; no unused assets in repo
- [ ] Lighthouse mobile Perf ≥ 90 / A11y ≥ 95 / CLS < 0.05
- [ ] Keyboard-only walkthrough: nav → drawer → gallery → lightbox → form → submit, no traps
- [ ] 360px–1920px screenshot sweep: no overflow, no orphan words in headings, consistent gutters

---

## 30. Final Design Principles

1. **Trust is the product.** Every choice optimizes for “this company is careful, precise, and established.”
2. **System over taste.** Tokens decide; opinions don’t.
3. **Flat, bordered, tonal.** Depth from surface contrast and lines — never glow.
4. **Quiet accent.** Teal leads; gold punctuates; channel colors stay inside their glyphs.
5. **Compact by default.** If an element can be 10% smaller without losing function, it should be.
6. **Motion only as feedback,** brief and removable.
7. **RTL-native.** Decisions made for Arabic reading rhythm first, not translated aesthetics.
8. **Performance is design.** A fast page is the most premium effect available.

---

*End of blueprint. Awaiting approval to begin Phase 1.*
