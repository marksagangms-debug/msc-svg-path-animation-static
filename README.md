# MSC SVG Path Animation for Webstudio

This works like the MnB text background animation setup:

1. Add one CDN script in Webstudio custom code.
2. Add an HTML Embed for the SVG.
3. Add `ms_path`, `ms_path_mode`, `ms_path_repeat`, `ms_path_duration`, `ms_path_tail`, and `ms_path_offset` to the SVG path.
4. Add a small CSS block for positioning.

The script auto-loads GSAP, and it only loads ScrollTrigger when scroll-based path or reveal animations need it. You do not need to add separate GSAP scripts.

## 1) Add the Script in Webstudio

In Webstudio:

1. Open `Project Settings`.
2. Go to `Custom Code`.
3. Paste this in `Before </body>`.
4. Publish.

```html
<script src="https://cdn.jsdelivr.net/gh/marksagangms-debug/msc-svg-path-animation-static@main/dist/svg-path-webstudio.js"></script>
```

For production, create a GitHub release and use a version tag instead of `main`:

```html
<script src="https://cdn.jsdelivr.net/gh/marksagangms-debug/msc-svg-path-animation-static@v1.0.0/dist/svg-path-webstudio.js"></script>
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
      ms_path
      ms_path_mode="static"
      ms_path_repeat="infinite"
      ms_path_duration="2.8"
      ms_path_tail="0.32"
      ms_path_offset="0%"
      ms_path_gradient="#msc-scroll-gradient"
      ms_path_gradient_center="720 500"
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
ms_path
```

Then add the static timing attributes:

```html
ms_path_mode="static"
ms_path_repeat="infinite"
ms_path_duration="2.8"
ms_path_tail="0.32"
ms_path_offset="0%"
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

## 4) Optional Scroll Wrapper

Static mode does not need a page wrapper. If you switch a path back to scroll mode, select the main Webstudio wrapper that contains the sections you want to use for scroll timing and add this class:

```text
msc-page
```

That class must match the path trigger:

```html
ms_path_trigger=".msc-page"
```

## Simple Attribute Setup

Use this as the default:

```html
<path
  ms_path
  ms_path_mode="static"
  ms_path_repeat="once"
  ms_path_duration="2.8"
  ms_path_tail="0.32"
  ms_path_offset="25%"
  ...
></path>
```

In Webstudio attributes, that means:

| Attribute | Value |
|---|---|
| `ms_path` | `true` |
| `ms_path_mode` | `static` |
| `ms_path_repeat` | `once` or `infinite` |
| `ms_path_duration` | `2.8` |
| `ms_path_tail` | `0.32` |
| `ms_path_offset` | `0%`, `25%`, or `0.25` |

For debugging, temporarily add:

| Attribute | Value |
|---|---|
| `ms_path_debug` | `true` |

## Attribute Reference

### Main Path Attribute

- `ms_path`: turns the SVG path into an animated path.
- `ms-path`: dashed alias for `ms_path`.

Legacy `dv_path` and `dv-path` attributes still work, but new embeds should use `ms`.

### Static Timing

- `ms_path_mode="static"`: plays the moving path animation automatically.
- `ms-path-mode="static"`: dashed alias for `ms_path_mode`.
- `ms_path_repeat="once"`: plays the path draw one time.
- `ms_path_repeat="infinite"`: loops the path draw forever.
- `ms_path_duration="2.8"`: seconds for one path draw.
- `ms_path_tail="0.32"`: visible tail length as a fraction of the full path. The head moves first and the tail follows behind it.
- `ms_path_offset="25%"`: where the static animation starts along the path. You can use percentages like `25%` or fractions like `0.25`.
- `ms-path-repeat`, `ms-path-duration`, `ms-path-tail`, and `ms-path-offset`: dashed aliases.

### Scroll Timing

Scroll mode is still available by setting `ms_path_mode="scroll"` or by omitting `ms_path_mode`.

- `ms_path_scrub="1.1"`: smooths the scroll animation.
- `ms-path-scrub="1.1"`: dashed alias for `ms_path_scrub`.
- `ms_path_trigger=".msc-page"`: the wrapper that controls the scroll range.
- `ms-path-trigger=".msc-page"`: dashed alias for `ms_path_trigger`.

These are built-in defaults, so you usually do not need to add them:

- `ms_path_start="top top"`: starts when the trigger top reaches the viewport top.
- `ms_path_end="bottom bottom"`: ends when the trigger bottom reaches the viewport bottom.

Advanced overrides are still supported:

- `ms_path_trigger=".custom-wrapper"`
- `ms_path_start="top center"`
- `ms_path_end="bottom top"`

### Draw Direction

Default direction:

```html
ms_path_from="1"
ms_path_to="0"
```

Reverse direction:

```html
ms_path_from="0"
ms_path_to="1"
```

### Gradient Rotation

```html
ms_path_gradient="#msc-scroll-gradient"
ms_path_gradient_center="720 500"
ms_path_gradient_duration="5"
```

- `ms_path_gradient`: CSS selector for the gradient to rotate.
- `ms_path_gradient_center`: SVG rotation center.
- `ms_path_gradient_duration`: seconds for one full rotation.

## Optional Reveal Animation

You can fade elements up on scroll by adding `ms-reveal`.

For one element:

```html
<section ms-reveal ms-reveal-y="50" ms-reveal-duration="1">
  ...
</section>
```

For child staggering:

```html
<div ms-reveal ms-reveal-stagger="0.08">
  <h2>Headline</h2>
  <p>Paragraph</p>
</div>
```

Reveal attributes:

- `ms-reveal`: enables fade-up reveal.
- `ms-reveal-y="40"`: starting vertical offset in pixels.
- `ms-reveal-duration="0.9"`: animation duration in seconds.
- `ms-reveal-delay="0.1"`: animation delay in seconds.
- `ms-reveal-start="top 88%"`: starts when the element reaches this viewport position.
- `ms-reveal-once="false"`: replays instead of running once.
- `ms-reveal-stagger="0.08"`: staggers child elements.

## Webstudio Checklist

- Script is in `Project Settings > Custom Code > Before </body>`.
- SVG is inside an HTML Embed.
- SVG `<path>` has `ms_path` or `ms-path`.
- Static SVG `<path>` has `ms_path_mode="static"`.
- Static SVG `<path>` has `ms_path_repeat="once"` or `ms_path_repeat="infinite"`.
- Static SVG `<path>` has `ms_path_duration`, for example `2.8`.
- Static SVG `<path>` can set `ms_path_tail`, for example `0.32`.
- Static SVG `<path>` can set `ms_path_offset`, for example `25%`.
- CSS has `.msc-path-layer`.
- The path has a visible `stroke`.

## Troubleshooting

- If nothing animates, confirm the script URL uses `msc-svg-path-animation`.
- If you recently changed the script, add a cache-buster to the CDN URL, for example `?v=latest`.
- Add `ms_path_debug="true"` to the path and check the browser console for a `[ms-path] Initialized` message.
- If the path is invisible, check `stroke`, `stroke-width`, and `z-index`.
- If static mode is too fast or slow, adjust `ms_path_duration`.
- If scroll mode finishes too early, add class `msc-page` to the wrapper that contains all scroll sections.
- If the path appears behind the page background, set your section backgrounds to transparent or raise the path layer `z-index`.
- If Webstudio content loads after the script, run `window.msPathRefresh()` from custom code.

## Local Demo

Open `example.html` locally or run:

```bash
npm run dev
```

Then visit:

```text
http://localhost:4173/example.html
```
