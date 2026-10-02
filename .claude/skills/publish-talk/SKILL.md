---
name: publish-talk
description: Publishes an HTML slide deck to the Acid Talks repo (GitHub Pages) and returns its link. Use when someone asks to publish, upload or share the HTML of a talk.
---

# Publish a talk

The argument is the path to the deck's HTML file. If it is missing, ask for it.

1. **Read the whole HTML.** The repo and the site are public: if you see client data, internal
   information, credentials or sensitive screenshots, stop and flag it before going any further.
2. **Check it is self-contained.** Look for `src=` and `href=` pointing at local files. If there are
   any, embed them in the HTML (inline CSS and JS, base64 images) or copy them into the talk folder
   using relative paths. Links to public CDNs can stay, but warn that the deck will not work
   offline.
3. **Fill in the metadata** if it is missing, asking for whatever you do not know: `<title>`,
   `<meta name="author">` and `<meta name="description">`. The index is generated from them.
4. **Create the folder** `YYYY-MM-DD-short-title/` at the repo root, using the date of the talk (ask
   if you do not know it) and a lowercase, accent-free, hyphenated slug. Save the deck inside as
   `index.html`.
5. **Verify** with `node scripts/build.mjs` that the talk shows up in `_site/index.html`.
6. **Publish**: `git pull --rebase`, commit only the new folder and push to `main`. If direct pushes
   are blocked, open a PR.
7. **Return the link**: `https://acidtango.github.io/acid-talks/YYYY-MM-DD-short-title/`. It takes a
   minute or two to go live; you can follow the deployment with `gh run watch`.
