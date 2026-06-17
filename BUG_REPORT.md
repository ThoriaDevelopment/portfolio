# Portfolio Audit & Bug Report

**Project:** `ThoriaDevelopment/Portfolio`  
**Live URL:** https://thoriadevelopment.github.io/Portfolio/  
**Audit date:** 2026-06-17  
**Auditor:** Claude Code  
**Scope:** HTML structure, CSS integrity, JavaScript runtime behavior, asset availability, GitHub Pages deployment correctness.

---

## Executive Summary

The portfolio deployed successfully and serves all files with correct HTTP 200 and MIME types. One critical runtime bug has already been fixed and deployed (unescaped backticks inside a template literal in `js/terminal.js`). Two additional issues remain that can break functionality on the live site. The most severe remaining issue is a case-sensitivity mismatch that will cause a 404 when a user clicks the **Resume** button.

---

## 1. FIXED — Unescaped Backticks in Template Literal

**Severity:** Critical  
**File:** `js/terminal.js`  
**Status:** Fixed and pushed in commit `414ae28`.

**Description:**  
The hidden terminal was built using a JavaScript template literal:

```js
terminal.innerHTML = `
  ...
  <div class="terminal-line out">Welcome ... Type a command or \`help\`.</div>
  ...
`;
```

The inner `` `help` `` backticks terminated the template literal early. The browser then tried to parse `help` as JavaScript, throwing:

```
Uncaught SyntaxError: Unexpected identifier 'help'
```

Because `app.js` imports `terminal.js` early in the module graph, this error prevented the rest of the application from initializing, leaving the page blank (all `.reveal` elements stayed at `opacity: 0`).

**Fix:** Replaced literal backticks with HTML entities:

```js
<div class="terminal-line out">Welcome ... Type a command or &#96;help&#96;.</div>
```

---

## 2. OPEN — Case-Sensitive Asset Path Mismatch

**Severity:** High  
**File:** `js/hireBar.js` line 3  
**Status:** Not fixed.

**Description:**  
```js
const RESUME_PATH = 'assets/Thoria/Resume.pdf';
```

The actual directory on disk and in the repo is `Assets/` with a capital **A**. Windows and the local Python server are case-insensitive, so this works locally. **GitHub Pages is case-sensitive**, so clicking **Resume** in the Hire Command Bar will request:

```
https://thoriadevelopment.github.io/Portfolio/assets/Thoria/Resume.pdf
```

and receive a **404**, even if the file `Assets/Thoria/Resume.pdf` is added later.

**Recommendation:** Change to:

```js
const RESUME_PATH = 'Assets/Thoria/Resume.pdf';
```

Additionally, the file `Assets/Thoria/Resume.pdf` does not currently exist, so the button will still show "Resume not uploaded yet." Add the PDF or remove the button.

---

## 3. OPEN — Unidentified 404 on `Portfolio/:1`

**Severity:** Medium  
**Status:** Not investigated.

**Description:**  
Browser console showed:

```
Portfolio/:1  Failed to load resource: the server responded with a status of 404 ()
```

Likely candidates:

1. The Resume PDF path above (only triggered on click, unlikely at page load).
2. A missing `favicon.ico` fallback even though `<link rel="icon">` is present.
3. A browser extension or preload scanner requesting an unreferenced resource.
4. The `og:image` / `twitter:image` paths are relative and resolve correctly on Pages.

**Recommendation:** Open DevTools → Network tab → filter by **Status: 404** and identify the exact URL.

---

## 4. OPEN — Form Submission Endpoint Not Configured

**Severity:** Medium  
**Status:** Expected / requires user action.

**Description:**  
`js/contactTicket.js` has:

```js
const FORM_ENDPOINT = ''; // TODO: set your Formspree endpoint or EmailJS config
```

The ticket form validates and submits correctly, but without an endpoint it only displays:

> "Ticket form endpoint not configured yet. Email officialthoria@gmail.com directly."

**Recommendation:** Add a Formspree form endpoint or EmailJS public key. If intentional, acceptable.

---

## 5. OPEN — `og:image` / `twitter:image` Are Relative

**Severity:** Low  
**Status:** Not fixed.

**Description:**  
```html
<meta property="og:image" content="Assets/Kleos/Kleos.png" />
```

Resolves correctly on GitHub Pages because the page is at `/Portfolio/`, but some social platforms prefer absolute URLs for previews.

**Recommendation:** Use absolute URL:

```html
<meta property="og:image" content="https://thoriadevelopment.github.io/Portfolio/Assets/Kleos/Kleos.png" />
```

---

## 6. OPEN — Velocity Skew Effect May Cause Layout Glitch

**Severity:** Low  
**Status:** Not fixed.

**Description:**  
`js/scrollEffects.js` applies `transform: skewY(...)` to every `<section>` based on scroll velocity. This can cause horizontal scrollbars during fast scrolls and may affect sticky children (e.g., nav).

**Recommendation:** Test on mobile. Reduce skew range (`±1.2deg` → `±0.6deg`) or apply only to a decorative wrapper.

---

## 7. OPEN — Minecraft Theme Uses Hardcoded Emerald Accents in Hero

**Severity:** Low  
**Status:** Design polish.

**Description:**  
The hero background gradient in `base.css` uses hardcoded emerald RGBA values. `light.css` overrides this, but `minecraft.css` does not, so the Minecraft theme still has a green glow.

**Recommendation:** Add a Minecraft-specific `.hero-bg` override in `css/themes/minecraft.css`.

---

## 8. OPEN — Hire Command Bar Auto-Opens on Scroll

**Severity:** Low  
**Status:** Design / UX.

**Description:**  
The Hire Command Bar expands automatically after the user scrolls 50% of the viewport. On mobile this can feel intrusive.

**Recommendation:** Consider disabling auto-open on small screens or show a subtle pulse instead.

---

## 9. OPEN — No Sitemap / robots.txt / 404 Page

**Severity:** Low  
**Status:** Optional.

**Recommendation:** Optional. Add `robots.txt`:

```
User-agent: *
Allow: /
```

---

## 10. OPEN — Console Error Fallback Only Catches Late Errors

**Severity:** Low  
**Status:** Mitigated.

**Description:**  
A global `error` and `unhandledrejection` handler reveals content if JS crashes. However, ES modules will fail entirely if modules are disabled or the browser is very old.

**Recommendation:** Sufficient fallback; no action needed unless analytics show very old browsers.

---

## Verified Good

| Check | Result |
|---|---|
| All local assets referenced in `index.html` return 200 on Pages | ✅ |
| JS modules served as `application/javascript` | ✅ |
| CSS served as `text/css` | ✅ |
| Images served as correct image MIME types | ✅ |
| All JS files pass `node --check` syntax validation | ✅ |
| CSS brace/paren balance in all stylesheets | ✅ |
| Required DOM IDs present in `index.html` | ✅ |
| Theme switcher, sound, gallery, terminal, hire bar, achievements, server status, contact form, Kleos demo wired in `app.js` | ✅ |

---

## Recommended Next Steps

1. Fix the Resume path case sensitivity in `js/hireBar.js`.
2. Identify the live 404 via DevTools → Network and resolve it.
3. Add a Formspree/EmailJS endpoint or remove the ticket form submission promise.
4. Test the Minecraft theme on the live site for visual polish.
5. Upload `Assets/Thoria/Resume.pdf` or remove the resume button until ready.
