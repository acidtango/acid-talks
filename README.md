# Acid Talks

HTML slide decks from Acid Tango talks, published with GitHub Pages at
<https://acidtango.github.io/acid-talks/>.

## Publishing a talk

1. Create a root-level folder named `YYYY-MM-DD-short-title` (the date of the talk).
2. Put your deck inside as `index.html`.
3. Push to `main` (or open a PR).

A couple of minutes later it is live at
`https://acidtango.github.io/acid-talks/YYYY-MM-DD-short-title/` and listed on the index. There is
nothing else to edit: the index is generated for you.

With Claude Code, from this repo: `/publish-talk path/to/my-deck.html`.

## Starting a new deck

`template/index.html` is a starter deck in the Acid Tango style: dark night background, striped
yellow sun, perspective grid, Montserrat. It has a cover, two content slides, a closing slide,
arrow-key navigation and speaker notes (press `N`). It is already self-contained.

1. Copy it to `YYYY-MM-DD-short-title/index.html`.
2. Set `<title>`, `<meta name="author">` and `<meta name="description">`.
3. Replace the example slides. Each slide is a `<section class="slide">` with a `data-title` and a
   `<div class="notes">` for your script. The cover and closing slides use
   `class="slide cover" data-mode="cover"`.

With Claude: _"make my slides starting from `template/index.html` in the acid-talks repo, using only
its classes"_. If you have access to the Acid Tango design system on claude.ai, ask Claude to use it:
it is the same template, plus a guide for every component.

The `template/` folder is not a talk, so it is not published on the site.

## What the HTML should look like

- **Self-contained**: a single `index.html` with its CSS, JS and images inside (inline or base64).
  That way it works the same here, locally, and without wifi on the day of the talk. If you need
  separate files (a video, for example), keep them in the same folder and link them with relative
  paths.
- The index reads its data from the deck itself:

  ```html
  <title>Title of the talk</title>
  <meta name="author" content="Your name" />
  <meta name="description" content="One sentence about what it covers." />
  ```

If you generate it with Claude, ask for it like this: _"make it a single self-contained HTML file,
with `<title>`, `<meta name="author">` and `<meta name="description">`"_.

Talks can be in any language; the repo itself is kept in English.

## Heads up: everything here is public

Both the repo and the site are public. Do not upload client material, internal data, credentials
or screenshots with sensitive information.

## Running it locally

```sh
node scripts/build.mjs
npx serve _site
```
