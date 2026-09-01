# Portfolio site

A static portfolio site — no build step, no dependencies. Open `index.html`
directly in a browser to preview it locally.

## Structure

```
index.html                          Homepage
style.css                           Shared design system (all pages)
script.js                           Scroll-reveal animation (respects
                                     prefers-reduced-motion)
work/career-copilot/
  index.html                        Public, high-level Career Copilot case study
  app-screenshot.png                General product screenshot
  prototype.html                    Public interface prototype using fictional data
```

Adding a new project later: duplicate the `work/career-copilot/` folder
as a template, swap its content and assets, then add a card for it to
the "Featured work" or "Browse by type" section of `index.html`.

## Before you publish

All your info is already filled in — email, LinkedIn, and GitHub are live
on both pages. Nothing left to swap.

Each page (`index.html` and `work/career-copilot/index.html`) is fully
self-contained: styles are built into the page itself, not loaded from
a separate file. That's deliberate — it means either file renders
correctly even if someone opens just that one file on its own, with
nothing else around it. `style.css` and `script.js` are kept in this
folder as the shared source of design tokens for when you add more
project pages later — copy the `<style>` block from an existing page
as your starting point rather than linking to the external files.

## Deploying to GitHub Pages (free)

1. Create a new **public** GitHub repository named exactly
   **`tanyakchai.github.io`** — that exact name is a special case GitHub
   recognizes, and it serves the site at `https://tanyakchai.github.io`
   with no extra path. (Any other repo name still works, it just adds
   `/repo-name/` to the URL.)
2. Upload everything in this folder to the repo — either drag-and-drop
   through GitHub's web UI ("Add file" → "Upload files"), or via git:
   ```
   git init
   git add .
   git commit -m "Initial portfolio site"
   git branch -M main
   git remote add origin https://github.com/tanyakchai/tanyakchai.github.io.git
   git push -u origin main
   ```
3. In the repo, go to **Settings → Pages**.
4. Under "Build and deployment", set **Source** to "Deploy from a
   branch", branch **main**, folder **/ (root)**. Save.
5. GitHub serves it at `https://tanyakchai.github.io` within a minute
   or two. That's the link to send prospective employers.
