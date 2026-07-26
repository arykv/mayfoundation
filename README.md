# mayfoundation.in

The public site is currently **offline** — `main` serves a blank page.

## Branches

| Branch | Contents |
| --- | --- |
| `main` | Blank page. This is what mayfoundation.in serves. |
| `legacy-site` | The original site exactly as it was live (static HTML, all photos). |
| `redesign` | Unfinished React rebuild — Vite + TypeScript + Tailwind + Framer Motion. |

## Restoring the old site

```
git checkout main
git checkout legacy-site -- .
git commit -m "restore previous site"
git push
```

## Bringing the redesign live

The `redesign` branch includes `.github/workflows/deploy.yml`, which builds and
publishes on every push. It needs **Settings → Pages → Source** switched from
*Deploy from a branch* to *GitHub Actions* before it will publish.

Unfinished on that branch: the Instagram founder embeds need a fallback for when
the embed script is blocked, and the layout has not been checked on mobile.
