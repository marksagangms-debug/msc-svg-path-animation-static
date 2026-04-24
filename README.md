# MSC SVG Path Animation for Webstudio

This works like the MnB text background animation setup:

1. Add one CDN script in Webstudio custom code.
2. Add an HTML Embed for the SVG.
3. Add `dv-path`, `dv-path-trigger`, and `dv-path-scrub` to the SVG path.
4. Add a small CSS block for positioning.

The script auto-loads GSAP and ScrollTrigger. You do not need to add separate GSAP scripts.

## 1) Add the Script in Webstudio

In Webstudio:

1. Open `Project Settings`.
2. Go to `Custom Code`.
3. Paste this in `Before </body>`.
4. Publish.

```html
<script src="https://cdn.jsdelivr.net/gh/marksagangms-debug/msc-svg-path-animation@main/dist/svg-path-webstudio.js"></script>
```

For production, create a GitHub release and use a version tag instead of `main`:

```html
<script src="https://cdn.jsdelivr.net/gh/marksagangms-debug/msc-svg-path-animation@v1.0.0/dist/svg-path-webstudio.js"></script>
```

## 2) Add the SVG HTML Embed

Add a Webstudio HTML Embed near the top of the page. Paste this:

```html
<div class="msc-path-layer" aria-hidden="true">
  <svg viewBox="0 0 1440 1000" preserveAspectRatio="none">
    <defs>
      <linearGradient
        id="msc-scroll-gradient"
        x1="420"
        y1="80"
        x2="650"
        y2="930"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stop-color="#ffd166"></stop>
        <stop offset="35%" stop-color="#ff6a3d"></stop>
        <stop offset="68%" stop-color="#ff2fb3"></stop>
        <stop offset="100%" stop-color="#d83bd2"></stop>
      </linearGradient>
    </defs>

    <path
      dv-path
      dv-path-trigger=".msc-page"
      dv-path-scrub="1.1"
      dv-path-gradient="#msc-scroll-gradient"
      dv-path-gradient-center="720 500"
      fill="none"
      stroke="url(#msc-scroll-gradient)"
      stroke-width="12"
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M 420 80 C 540 130, 700 180, 800 280 S 1080 470, 970 610 S 510 760, 650 930"
    ></path>
  </svg>
</div>
```

The important part is this attribute on the SVG path:

```html
dv-path
```

Then add the scroll trigger and scrub attributes:

```html
dv-path-trigger=".msc-page"
dv-path-scrub="1.1"
```

That is the equivalent of the MnB typewriter attribute:

```html
dv-typewriter="auto loop"
```

## 3) Add the CSS

Add this in Webstudio custom CSS:

```css
.msc-path-layer {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.msc-path-layer svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}
```

## 4) Add the Page Wrapper Class

Select the main Webstudio wrapper that contains the sections you want to use for scroll timing. Add this class:

```text
msc-page
```

This class must match the path trigger:

```html
dv-path-trigger=".msc-page"
```

## Simple Attribute Setup

Use this as the default:

```html
<path
  dv-path
  dv-path-trigger=".msc-page"
  dv-path-scrub="1.1"
  ...
></path>
```

In Webstudio attributes, that means:

| Attribute | Value |
|---|---|
| `dv-path` | `true` |
| `dv-path-trigger` | `.msc-page` |
| `dv-path-scrub` | `1.1` |

For debugging, temporarily add:

| Attribute | Value |
|---|---|
| `dv-path-debug` | `true` |

## Attribute Reference

### Main Path Attribute

- `dv-path`: turns the SVG path into a scroll-drawn path.
- `dv_path`: underscore alias for backward compatibility.

### Scroll Timing

- `dv-path-scrub="1.1"`: smooths the scroll animation.
- `dv-path-trigger=".msc-page"`: the wrapper that controls the scroll range.
- `dv_path_scrub` and `dv_path_trigger`: underscore aliases kept for backward compatibility.

These are built-in defaults, so you usually do not need to add them:

- `dv-path-start="top top"`: starts when the trigger top reaches the viewport top.
- `dv-path-end="bottom bottom"`: ends when the trigger bottom reaches the viewport bottom.

Advanced overrides are still supported:

- `dv-path-trigger=".custom-wrapper"`
- `dv-path-start="top center"`
- `dv-path-end="bottom top"`

### Full Autoplay Mode

If you want the whole path to animate without scrolling, switch the mode to autoplay:

```html
<path
  dv-path
  dv-path-mode="autoplay"
  dv-path-duration="2.4"
  dv-path-repeat="once"
></path>
```

For an infinite loop:

```html
<path
  dv-path
  dv-path-mode="autoplay"
  dv-path-duration="2.4"
  dv-path-repeat="infinite"
></path>
```

- `dv-path-mode="autoplay"`: ignores scroll and plays the full draw animation automatically.
- `dv-path-duration="2.4"`: seconds for one full path draw.
- `dv-path-repeat="once"`: plays a single iteration.
- `dv-path-repeat="infinite"`: loops forever.
- `dv_path_mode`, `dv_path_duration`, and `dv_path_repeat` remain supported as underscore aliases.

### Draw Direction

Default direction:

```html
dv-path-from="1"
dv-path-to="0"
```

Reverse direction:

```html
dv-path-from="0"
dv-path-to="1"
```

### Gradient Rotation

```html
dv-path-gradient="#msc-scroll-gradient"
dv-path-gradient-center="720 500"
dv-path-gradient-duration="5"
```

- `dv-path-gradient`: CSS selector for the gradient to rotate.
- `dv-path-gradient-center`: SVG rotation center.
- `dv-path-gradient-duration`: seconds for one full rotation.

## Optional Reveal Animation

You can fade elements up on scroll by adding `dv-reveal`.

For one element:

```html
<section dv-reveal dv-reveal-y="50" dv-reveal-duration="1">
  ...
</section>
```

For child staggering:

```html
<div dv-reveal dv-reveal-stagger="0.08">
  <h2>Headline</h2>
  <p>Paragraph</p>
</div>
```

Reveal attributes:

- `dv-reveal`: enables fade-up reveal.
- `dv-reveal-y="40"`: starting vertical offset in pixels.
- `dv-reveal-duration="0.9"`: animation duration in seconds.
- `dv-reveal-delay="0.1"`: animation delay in seconds.
- `dv-reveal-start="top 88%"`: starts when the element reaches this viewport position.
- `dv-reveal-once="false"`: replays instead of running once.
- `dv-reveal-stagger="0.08"`: staggers child elements.

## Webstudio Checklist

- Script is in `Project Settings > Custom Code > Before </body>`.
- SVG is inside an HTML Embed.
- SVG `<path>` has `dv-path`.
- SVG `<path>` has `dv-path-trigger=".msc-page"`.
- Your scroll wrapper has class `msc-page`.
- CSS has `.msc-path-layer`.
- The path has a visible `stroke`.

## Troubleshooting

- If nothing animates, confirm the script URL uses `msc-svg-path-animation`.
- If you recently changed the script, add a cache-buster to the CDN URL, for example `?v=latest`.
- Add `dv-path-debug="true"` to the path and check the browser console for a `[dv-path] Initialized` message.
- If the path is invisible, check `stroke`, `stroke-width`, and `z-index`.
- If the path finishes too early, add class `msc-page` to the wrapper that contains all scroll sections.
- If the path appears behind the page background, set your section backgrounds to transparent or raise the path layer `z-index`.
- If Webstudio content loads after the script, run `window.dvPathRefresh()` from custom code.

## Local Demo

Open `example.html` locally or run:

```bash
npm run dev
```

Then visit:

```text
http://localhost:4173/example.html
```
