# VSW SVG Path for Webstudio

Attribute-driven SVG path draw animations for Webstudio. Add one CDN script, paste an SVG into an HTML Embed, and control the animation with custom attributes.

## CDN

Use the `main` branch while testing:

```html
<script src="https://cdn.jsdelivr.net/gh/marksagangms-debug/vsw-svg-path-webstudio@main/dist/svg-path-webstudio.js"></script>
```

For production, create a GitHub release and pin to the release tag:

```html
<script src="https://cdn.jsdelivr.net/gh/marksagangms-debug/vsw-svg-path-webstudio@v1.0.0/dist/svg-path-webstudio.js"></script>
```

## Webstudio Setup

1. Open `Project Settings`.
2. Go to `Custom Code`.
3. Paste the CDN script in `Before </body>`.
4. Add your SVG in an HTML Embed.
5. Put `dv-path` on the SVG `<path>` you want to animate.

The script auto-loads GSAP and ScrollTrigger from jsDelivr.

## Basic Embed

```html
<div class="dv-path-layer" aria-hidden="true">
  <svg viewBox="0 0 1440 1000" preserveAspectRatio="none">
    <defs>
      <linearGradient id="scroll-gradient" x1="420" y1="80" x2="650" y2="930" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#ffd166"></stop>
        <stop offset="35%" stop-color="#ff6a3d"></stop>
        <stop offset="68%" stop-color="#ff2fb3"></stop>
        <stop offset="100%" stop-color="#d83bd2"></stop>
      </linearGradient>
    </defs>

    <path
      dv-path
      dv-path-trigger=".page"
      dv-path-start="top top"
      dv-path-end="bottom bottom"
      dv-path-scrub="1.1"
      dv-path-gradient="#scroll-gradient"
      dv-path-gradient-center="720 500"
      fill="none"
      stroke="url(#scroll-gradient)"
      stroke-width="12"
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M 420 80 C 540 130, 700 180, 800 280 S 1080 470, 970 610 S 510 760, 650 930"
    ></path>
  </svg>
</div>
```

## CSS

```css
.dv-path-layer {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.dv-path-layer svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.page {
  position: relative;
  z-index: 1;
}
```

## Attributes

- `dv-path`: enables the path draw animation
- `dv-path-trigger=".selector"`: element that controls scroll timing
- `dv-path-start="top top"`: ScrollTrigger start position
- `dv-path-end="bottom bottom"`: ScrollTrigger end position
- `dv-path-scrub="1.1"`: scrub amount
- `dv-path-from="1"`: starting dash offset as a path-length multiplier
- `dv-path-to="0"`: ending dash offset as a path-length multiplier
- `dv-path-gradient="#scroll-gradient"`: optional gradient selector to rotate
- `dv-path-gradient-center="720 500"`: optional SVG center for rotation
- `dv-path-gradient-duration="5"`: seconds for one gradient rotation

## Content Reveal

Use `dv-reveal` on any element you want to fade up when it enters the viewport:

```html
<section dv-reveal dv-reveal-y="50" dv-reveal-duration="1">...</section>
```

Use `dv-reveal-stagger` to animate child elements:

```html
<div dv-reveal dv-reveal-stagger="0.08">
  <h2>Headline</h2>
  <p>Paragraph</p>
</div>
```

Reveal attributes:

- `dv-reveal`: enables fade-up reveal
- `dv-reveal-y="40"`: starting Y offset in pixels
- `dv-reveal-duration="0.9"`: animation duration in seconds
- `dv-reveal-delay="0.1"`: animation delay in seconds
- `dv-reveal-start="top 88%"`: ScrollTrigger start position
- `dv-reveal-once="false"`: replay instead of running once
- `dv-reveal-stagger="0.08"`: stagger child elements

## Notes

- Respects `prefers-reduced-motion`.
- Exposes `window.dvPathRefresh()` for late-loaded content.
- See `example.html` for a local working demo.
