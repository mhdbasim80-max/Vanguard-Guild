# Vanguard Guild

A one-page website for **Vanguard Guild**, a private network that connects fighters, traders and gamers through state-based clubs that meet in person. Built for Unit 3 (web development) using plain HTML, CSS and JavaScript.

**Motto:** Honor · Legacy · Knowledge

## What the site does

- Explains the three tribes (Fighters, Traders, Gamers) and what a club looks like.
- Shows a clubhouse gallery of illustrations. Click a picture to enlarge it.
- Walks through how joining works.
- Shows the Guild Card concept: two sample member cards (D-Tier Initiate and A-Tier Elite Captain) and a five-step rank ladder from plain D to foil S, built in CSS and SVG, plus how stamps, links and rare cards work.
- Has an application form. As you choose a tribe and a state, your club appears in the preview and a progress bar fills at the top of the page. The progress is saved in the browser (localStorage), so it survives a refresh.

The application form is a **demo**. Nothing is sent anywhere.

## Files

```
Vanguard Guild/
├── index.html     the page (all sections on one scroll)
├── style.css      all styling
├── script.js      form logic, progress bar, nav highlight, gallery
├── README.md      this file
└── images/
    ├── crest.png        crest used on the page and as the tab icon
    ├── logo.png         original logo
    ├── fight-night.svg  illustration
    ├── garage-meet.svg  illustration
    ├── trading-desk.svg illustration
    ├── lan-night.svg    illustration
    └── the-lounge.svg   illustration
```

## How to run it

1. Open the `Vanguard Guild` folder in VS Code (File > Open Folder).
2. Right-click `index.html` and choose **Open with Live Server**.
3. The site opens in your browser and refreshes every time you save.

## Saving to GitHub

Each time you finish a piece of work:

1. **Save** the file (Ctrl + S).
2. **Commit**: open Source Control, type a short message describing what changed, then click Commit.
3. **Sync Changes**: click the Sync Changes button so the commit reaches GitHub.

## Notes

- The clubhouse pictures are AI-generated or illustrative images and do not show real Guild events. LAN night is still an illustration until a gaming photo is added (see below).
- The car meet photo (`garage-meet.jpg`) comes from another photographer. Credit it or replace it before publishing the site publicly.
- Fonts (Cormorant Garamond, Instrument Sans, JetBrains Mono) load from Google Fonts. Without internet the page falls back to system fonts.

## Technologies

HTML5, CSS3, vanilla JavaScript. No frameworks.

## Changing the pictures

All six pictures are in `images/` as JPG files: `clubhouse.jpg` (the feature picture), `fight-night.jpg`, `garage-meet.jpg`, `trading-desk.jpg`, `lan-night.jpg` and `the-lounge.jpg`. They are AI-generated or illustrative images. To swap one, replace the file with another of the same name, ideally under about 500 KB.

The `.svg` files in `images/` are my earlier drawings. The page no longer uses them, so they can be deleted.

Use images you are allowed to use: free stock sites such as Unsplash and Pexels, or pictures you generate yourself. Do not use film stills, since those are copyrighted. Credit any photo taken by someone else.
