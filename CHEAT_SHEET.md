# Portfolio Hidden Features — Test Cheat Sheet

**Live site:** https://thoriadevelopment.github.io/Portfolio/

Use this sheet to find, trigger, and verify every interactive feature on the page.

---

## 1. Theme Switcher

**Trigger:** Click the theme icon in the sticky nav (next to the sound icon).

**What it does:** Cycles through three themes:
1. **Default** — emerald-on-dark, current portfolio look.
2. **Minecraft** — dirt/stone/grass block textures, pixel font accents, earthy palette.
3. **Light** — clean light professional theme.

**How to verify:**
- Click the icon repeatedly; the page palette and textures change.
- In Minecraft theme, inspect a card — it should have a stone texture and squared corners.
- The hero gradient should change color per theme.

**Persistence:** Choice is saved in `localStorage` under `thoria-theme`.

---

## 2. Sound Toggle

**Trigger:** Click the speaker icon in the sticky nav.

**What it does:**
- Default: **off**.
- On: plays click sounds for buttons/chips/gallery items; in Minecraft theme it plays note-block synth tones; starts ambient background music after first interaction.

**How to verify:**
- Toggle on and click any button or chip. You should hear a sound.
- In Minecraft theme, clicks sound like 8-bit note blocks.
- State is saved in `localStorage` under `thoria-sound`.

---

## 3. Custom Cursor

**Trigger:** Move the mouse on desktop (not touch devices).

**What it does:**
- A ring cursor follows the pointer with a slight delay.
- A small dot follows more tightly.
- The ring expands when hovering over interactive elements (buttons, chips, links, gallery, cards).

**How to verify:**
- Hover over the **GitHub** button — cursor ring should grow.
- Hover over plain text — ring returns to normal size.
- On touch devices, the custom cursor is hidden.

---

## 4. Magnetic Buttons

**Trigger:** Hover over `.btn`, `.chip`, or `.hire-btn` and move the mouse around inside the element.

**What it does:** The button gently leans toward the cursor (max ~15% of its size).

**How to verify:** Hover the **View Experience** button and wiggle the mouse — the button shifts slightly.

---

## 5. Click Ripples

**Trigger:** Click any button, chip, card, proof thumb, gallery thumb, gallery main image, doc card, FAQ summary, or hire bar button.

**What it does:** A small colored ripple burst radiates from the click point.

**How to verify:** Click the **Discord @inrising** chip. A green ripple should expand.

---

## 6. 3D Tilt Cards

**Trigger:** Hover over any card in the **Skills** section and move the mouse.

**What it does:** The card tilts toward the cursor (max ~8° on X/Y axes) and lifts slightly.

**How to verify:** Hover the **Creator & Media Management** card and move the cursor to the corners. The card should tilt.

**Note:** Disabled on touch devices and when `prefers-reduced-motion` is on.

---

## 7. Falling Blocks Canvas (Hero Background)

**Trigger:** Look at the hero section on desktop.

**What it does:**
- Semi-transparent squares drift downward like falling blocks.
- They gently repel away from the cursor.
- Clicking anywhere in the hero/spawn area creates a particle burst.

**How to verify:**
- Move the mouse across the hero — blocks should subtly move away.
- Click in the hero area — a burst of small blocks should explode from the click.
- Scroll down far enough and back up; the animation pauses when the hero leaves the viewport.

**Note:** Disabled when `prefers-reduced-motion` is on or tab is hidden.

---

## 8. Hidden Terminal

### Method A: Konami Code
**Trigger:** Press the classic Konami sequence on the keyboard:
```
↑ ↑ ↓ ↓ ← → ← → B A
```

**What it does:** Opens a dark command terminal overlay.

### Method B: Type `thoria`
**Trigger:** Type the word `thoria` anywhere on the page (not in an input field).

**What it does:** Same terminal overlay opens.

### Method C: Press `~` or `` ` ``
**Trigger:** Press the backtick/tilde key.

**What it does:** Toggles the terminal.

### Terminal Commands
Once the terminal is open, type any of these and press Enter:

| Command | Action |
|---|---|
| `help` | Lists all commands. |
| `hire` | Scrolls to the **Contact** section. |
| `discord` | Copies `@inrising` to clipboard. |
| `experience` | Scrolls to the **Experience** section. |
| `kleos` | Opens the inline **Kleos demo** and scrolls there. |
| `achievements` | Lists your unlocked badges from `localStorage`. |
| `theme` | Cycles the theme switcher. |
| `sound` | Toggles sound. |
| `status` | Scrolls to the server status pills. |
| `whoami` | Prints a short bio. |

**How to verify:**
- Open terminal via Konami code.
- Type `help` — commands list appears.
- Type `discord` — clipboard should contain `@inrising`.
- Press `Escape` or click outside the window to close.

**Achievement:** Opening the terminal unlocks the **Commander** badge.

---

## 9. Achievement Badges

Badges unlock automatically as you explore. A toast appears top-right when one unlocks.

| Badge | How to unlock |
|---|---|
| **Profiler** | Scroll through all major sections (`#top`, `#bio`, `#experience`, `#kleos`, `#skills`, `#faq`). |
| **Investigator** | Open all proof images for both ArchMC and VoidSentMC. |
| **Kleos Scout** | Click every Kleos gallery thumbnail (6 total). |
| **Signal Boosted** | Click the Discord copy chip (`@inrising`). |
| **Sonic Explorer** | Turn sound **on**. |
| **Block Breaker** | Click anywhere in the hero/section area to interact with falling blocks. |
| **Speedrunner** | Reach the footer/contact section within ~25 seconds of page load. |
| **Commander** | Open the hidden terminal (Konami, type `thoria`, or press `~`). |

**How to verify:**
- Open DevTools → Application → Local Storage → `thoria-achievements`.
- Unlock a badge and check that the array gains the badge ID.
- Or watch for the toast notification.

---

## 10. Hire Command Bar

**Trigger:** Scroll down ~50% of the viewport on desktop, or click the **Hire Me** button floating bottom-right.

**What it does:** A dock expands with one-tap actions:
- **Contact** — scrolls to contact form.
- **Discord** — copies `@inrising`.
- **Resume** — downloads `Assets/Thoria/Resume.pdf` (only works once you upload the PDF).
- **Schedule** — opens your booking URL (configure in `js/hireBar.js`).
- **Sound** — toggles sound.

**How to verify:**
- Scroll down. The dock should auto-expand on desktop.
- Click each button. Resume will warn "not uploaded yet" until the PDF exists.

**Note:** Auto-open is disabled on touch devices.

---

## 11. Live Server Status Pills

**Trigger:** View the **Experience** section.

**What it does:** Shows online/offline status for:
- `arch.mc` (ArchMC)
- `play.voidsent.net` (VoidSentMC)

**How to verify:**
- Look for a green/orange/gray dot next to each server name.
- Click a pill — it copies the IP to clipboard and briefly shows "Copied ...".
- Uses `api.mcstatus.io` with a simulated fallback if the API fails.

---

## 12. Ticket-Style Contact Form

**Trigger:** Scroll to the **Contact** section and fill out the form.

**What it does:**
- Validates email, subject, and message length.
- Shows validation errors with red borders.
- On success, shows a green "ticket resolved" message.

**How to verify:**
- Submit with empty fields — errors appear.
- Submit with valid data — current message says endpoint not configured until you add one in `js/contactTicket.js`.

---

## 13. Inline Kleos Demo

**Trigger:** In the **Kleos** section, click **Try the dashboard ↗**.

**What it does:** Expands a mock dashboard below the screenshots with:
- Search bar for mock creators.
- Role and platform filters.
- **Verify all** button with a progress simulation.
- Upload timeline chart and leaderboard chart (loads Chart.js on first open).
- Payout calculator: enter a budget and click **Calculate payout split**.

**How to verify:**
- Type `Alice` in search — only AlicePlays card remains.
- Select **Twitch Partner** from role filter — only DanaStreams remains.
- Click **Verify all** — progress text updates to 100%, then shows "✓ Verified 6 creators".
- Enter `1500` in budget and click **Calculate payout split** — per-creator dollar amounts appear.

---

## 14. Lightbox / Gallery

**Trigger:** Click any proof image or the main Kleos screenshot, or any Kleos gallery thumbnail.

**What it does:** Opens a full-screen lightbox with prev/next navigation for grouped images.

**How to verify:**
- Click an ArchMC proof image — use left/right arrows or on-screen buttons to cycle through the 3 ArchMC proofs.
- Click the **Community Guidelines** doc card — PDF opens in the lightbox.
- Press `Escape` to close.

---

## 15. Reduced Motion / Accessibility

**Trigger:** Enable `prefers-reduced-motion` in your OS/browser.

**What changes:**
- `.reveal` elements appear instantly.
- Parallax, velocity skew, cursor, and falling blocks are disabled.
- Sound remains opt-in.

**How to verify:**
- Enable reduced motion and reload. Hero typewriter should not animate; sections should be visible immediately.

---

## Quick Test Checklist

| # | Feature | Test |
|---|---|---|
| 1 | Theme switch | Click theme icon 3 times, confirm each look |
| 2 | Sound toggle | Toggle on, click a chip |
| 3 | Custom cursor | Hover button on desktop |
| 4 | Magnetic buttons | Wiggle mouse inside a button |
| 5 | Click ripple | Click a chip |
| 6 | 3D tilt | Hover a Skills card |
| 7 | Falling blocks | Move mouse + click in hero |
| 8 | Terminal | Type `thoria` or press Konami |
| 9 | Achievements | Unlock Commander + one more, check localStorage |
| 10 | Hire bar | Scroll to 50%, dock opens |
| 11 | Server status | Check pills in Experience |
| 12 | Contact form | Submit empty, then valid |
| 13 | Kleos demo | Open demo, search + payout calc |
| 14 | Lightbox | Click proof image, use arrows |
| 15 | Reduced motion | Enable in OS, reload |
