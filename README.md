# May Foundation — site rebuild

This branch holds a finished rebuild of mayfoundation.in. **It is not live.**
The public site (`main`) shows a closing notice; nothing here publishes on its
own.

## Branches

| Branch | Contents |
| --- | --- |
| `main` | The closing notice. This is what mayfoundation.in serves. |
| `legacy-site` | The original site exactly as it was live. |
| `redesign` | This rebuild — complete and verified, waiting. |

## Running it

```bash
npm install
npm run dev
```

`npm run build` writes `dist/`. `npm run images` regenerates the responsive
photo sets from `raw/` (only needed when photos change; the output is committed).

## Going live, when you want to

1. Repo **Settings → Pages → Source**: switch from *Deploy from a branch* to
   *GitHub Actions*.
2. Merge `redesign` into `main`.
3. Run the **Deploy to GitHub Pages** workflow from the Actions tab.

Step 3 is manual by design — `.github/workflows/deploy.yml` has no `push`
trigger, so merging alone will not publish. Add one back if you want every push
to deploy.

## How it is built

Vite · React 18 · TypeScript · Tailwind v4 · Framer Motion · Lenis · Radix.

- All copy, stats, programmes and photo ordering live in `src/data/site.ts`.
  Editing content should never mean opening a component.
- Colours come from the logo: blush `#FFF4F2`, royal `#2445A0`, coral `#FA7268`.
  Fraunces for display, Inter Tight for everything else, both self-hosted.
- Photos are pre-built to AVIF/WebP/JPEG at three widths with intrinsic
  dimensions and blur placeholders, so there is no layout shift and the 18 MB of
  original JPEGs never reach a visitor.
- Sections below the fold are code-split; the Instagram embed script only loads
  when that section approaches the viewport, and falls back to plain links if
  Instagram is blocked.
- Every animation is gated on `prefers-reduced-motion`, including the smooth
  scrolling and the pinned photo rail.
