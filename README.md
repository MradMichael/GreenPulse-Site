# Re-Tire Lebanon — website

Static site deployed via GitHub Pages. No build step required.

## Structure

```
.
├── index.html   # all markup, CSS (inlined <style>), and JS (inlined <script>)
└── CNAME        # greenpulse.earth
```

There are no separate `css/` or `js/` folders. All styling and scripts live inside `index.html`.

## Contact form

The form opens the visitor's email app with every field pre-filled (mailto fallback).

To switch to silent background submission:

1. Create a free form at https://formspree.io
2. Copy the endpoint URL, e.g. `https://formspree.io/f/abcdwxyz`
3. In `index.html`, find the inline `<script>` near the bottom and paste the URL into `FORM_ENDPOINT`

## Deploy (GitHub Pages)

**Settings → Pages → Deploy from branch → `main` / root**

Custom domain: `greenpulse.earth` (set in CNAME)
