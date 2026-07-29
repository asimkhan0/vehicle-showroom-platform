# Design research — vehicle marketplace

> **Revised:** 2026-07-28. Supersedes the 2026-06-18 research document.
> This version records what was **decided and built**, not only what was proposed.

---

## 1. The problem

A multi-vendor vehicle marketplace has to satisfy two people with opposite needs at the same time.

**The buyer** is comparing. They arrive from search, they scan, and they leave if the price is not immediately findable. They do not care which showroom listed the car until they are close to enquiring — at which point they care enormously, because they are about to hand a stranger a large amount of money.

**The dealer** is operating. They log in to find out what needs a response, and to get stock live quickly. Air and elegance are worth less to them than density and clarity.

One visual system has to serve both. It does that by keeping **one token spine** and varying only **density** — never colour, type, or shape.

---

## 2. What the category does, and where it fails

Surveying the established players (large classifieds, dealer-group sites, and premium single-marque configurators) three patterns hold and three failures repeat.

**Holds:**

- **16:9 photography.** Universal. Buyers have been trained to read a vehicle at this crop.
- **Price above title.** Every high-performing card leads with the number.
- **Faceted filtering with visible active state.** Buyers filter aggressively and need to see why results shrank.

**Fails:**

- **Chrome competing with the vehicle.** Heavy headers, coloured banners, and badge clutter shrink the only thing the buyer came for.
- **Dealer branding taking the headline.** On multi-vendor pages, dealer-first cards measurably reduce scanning speed.
- **Empty and error states as afterthoughts.** "0 results" with no route out is the single most common abandonment point.

These three failures became the three principles in `showroom/MASTER.md` §2.

---

## 3. The three directions explored

**Direction A — Editorial Showroom.** Magazine typography, generous whitespace, large cinematic imagery, restrained palette. Strength: feels premium and trustworthy. Risk: slow to scan; whitespace costs listings per screen.

**Direction B — Confident Marketplace.** Dense but calm. Price-led cards, intent chips, horizontal rails, strong faceted filtering. Strength: fastest to compare. Risk: can read as commodity if the chrome is careless.

**Direction C — Dense Deal Hunter.** Table-like, maximum listings per screen, aggressive price signalling. Strength: power users. Risk: cheap; actively hostile to a premium showroom's brand.

**Original recommendation: Direction B.**

---

## 4. What was actually chosen, and how it reconciles with the research

The brief that came back was *"trustworthy, futuristic, elegant"*. That is Direction A's register with Direction B's mechanics.

**The delivered direction — "Concours" — is an A/B hybrid, and it adopts every Direction B non-negotiable without exception:**

| Direction B non-negotiable | Honoured in Concours |
|---|---|
| Photograph is the largest element | Yes — 16:9 well, fixed ratio, dark ground |
| Price is the strongest type in the card | Yes — above the title, tabular, full figures |
| Showroom subordinate to the vehicle | Yes — smallest row, footer position |
| Intent chips above results | Yes |
| Featured / just-listed rails | Yes — three rails |
| Visible active filters, human-language count | Yes — removable chips, "1,284 hybrid sedans in Karachi" |
| Mobile sticky inquire bar on the detail page | Yes |

What it takes from Direction A: dark cinematic chrome, display typography, and generous vertical rhythm on buyer surfaces — spent on the *page*, not on the *card*, so listings per screen is not sacrificed.

**Elegance here is restraint, not decoration.** One accent, no gradients on chrome, no glows, borders before shadows.

---

## 5. Two places this revision overrules the earlier research

Recorded openly, because the earlier document is still readable in git history.

**5.1 Red is no longer the primary action.** The earlier research specified `#DC2626` for primary CTAs. The core defect being fixed in the codebase was that `--primary` and `--destructive` were the *same colour*. Reinstating red as primary would recreate that ambiguity. The action colour is now `#1F55E0`; red means destructive and nothing else. Full reasoning in `showroom/MASTER.md` §4.

**5.2 The 4:3 claim was wrong.** The earlier research mandated 16:9 cards, but one later spec asserted 4:3 on the grounds that a wider crop keeps wheels and stance in frame. That contradiction has been resolved in favour of **16:9**: it is the category standard, and a fixed ratio is what stops careless dealer photography from changing card height and breaking the grid.

---

## 6. Type and numerals

DM Sans for UI and display; Geist Mono where column alignment matters. Display 2–3.25rem/600, section headings 1.5rem, card price 1.25rem, body 1rem/1.55 capped at 65–70ch, small .875rem, caption .75rem, overline .6875rem uppercase tracked.

**All figures are tabular.** Prices, mileage, years, counts, deltas. This is the single cheapest thing that makes a marketplace feel precise.

**Known limitation:** DM Sans could not be loaded in the mockup environment, so its proportions were tuned against a system-sans fallback and will need re-tuning. This is recorded in `showroom/MASTER.md` §5 rather than hidden.

---

## 7. Components introduced

`TrustStrip`, `FeaturedListingsRail`, `SimilarVehicles`, `FilterChipBar`, `IntentChips`, `DealerTrustCard`, `NextActionsPanel`, `MobileFilterSheet`, `MobileInquireBar`, `VehicleImagePlaceholder`, `StateEmpty` / `StateError` / `CardSkeleton`.

The last four are not optional extras. **A marketplace is judged on its worst screen**, so empty, loading, error, and missing-photo states are part of the component spec and are implemented in the mockup's dedicated States screen.

---

## 8. What the States screen proves

Built specifically to stop the states being hand-waved:

- **No results** with three one-tap escape routes plus "save this search", and it names the filter excluding the most results.
- **Skeletons** that mirror real card geometry, so nothing shifts on arrival.
- **Error** in plain language, confirming filters are preserved.
- **Missing photo** — branded "Photos coming soon", never a broken-image glyph.
- **Photography stress test** — the same card under underexposed, blown-out, badly cropped, and absent imagery.
- **The measured contrast table**, rendered in the interface itself rather than claimed in a document.

---

## 9. Verification standard

This is the part the earlier research under-specified, and it is where the real defects were found.

**Every screen is screenshotted at 1440px and 390px** and checked for horizontal overflow, console errors, and overlap. Applied to Discover, Vehicle, Storefront, Dashboard, States, and System, this found and forced fixes for:

- Four separate mobile overflow failures, all caused by the default `min-width:auto` on flex and grid children.
- A table that widened the whole page instead of scrolling inside its card.
- A tenant storefront header with no mobile treatment at all.
- A stray-character bug in a badge, visible only in a screenshot.

**Contrast is computed, never asserted.** A first pass "fixed" four colours that did not exist in the stylesheet while missing a real failure at 3.20:1. The rule now is that the checker **parses the actual tokens from the stylesheet** and recomputes. That caught `--text-3` and darkened it to `#6D727B` (4.63:1).

**Lesson worth keeping: a design document that asserts its own compliance is worth less than a script that measures it.**

---

## 10. Open questions

1. **Real photography.** Every image in the mockup is AI-generated placeholder, and some frames resemble real marques. Nothing ships externally until real dealer photography replaces them.
2. **RTL and long content.** Urdu labels, long showroom names, and 40-character trim strings are untested.
3. **Dark mode.** Deliberately out of scope; see `showroom/MASTER.md` §14.
4. **Finance display.** Whether `/mo` figures should appear on cards depends on regulatory wording, which is unresolved.
