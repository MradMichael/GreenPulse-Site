# Re-Tire Lebanon — website

Static site. Loads as-is on GitHub Pages (no build step).

## Structure

```
.
├── index.html        # markup
├── css/
│   └── styles.css    # all styling
└── js/
    └── main.js       # contact-form logic
```

## Contact form

The form works immediately: on submit it opens the visitor's e-mail app
with every field pre-filled.

To make it send in the background (no e-mail app, inline "thank you"):

1. Create a free form at https://formspree.io (or Web3Forms / Getform).
2. Copy the endpoint URL, e.g. `https://formspree.io/f/abcdwxyz`.
3. In `js/main.js`, paste it into the `FORM_ENDPOINT` value near the top.

Reply-to and notification address are set in `FALLBACK_EMAIL` (js/main.js)
and in your Formspree dashboard.

## Deploy (GitHub Pages)

Push these files to the repo root, then enable
**Settings → Pages → Deploy from branch → `main` / root**.
