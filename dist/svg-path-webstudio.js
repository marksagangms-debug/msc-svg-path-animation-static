(function () {
  "use strict";

  var PATH_ATTR = "dv-path";
  var PATH_ATTR_ALT = "dv_path";
  var REVEAL_ATTR = "dv-reveal";
  var READY_FLAG = "dvPathReady";
  var REVEAL_READY_FLAG = "dvRevealReady";
  var GSAP_URL = "https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js";
  var SCROLL_TRIGGER_URL =
    "https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/ScrollTrigger.min.js";

  function loadScript(url) {
    return new Promise(function (resolve, reject) {
      var existing = document.querySelector('script[src="' + url + '"]');
      if (existing) {
        if (existing.dataset.loaded === "true") {
          resolve();
          return;
        }
        existing.addEventListener("load", resolve);
        existing.addEventListener("error", function () {
          reject(new Error("Failed loading " + url));
        });
        return;
      }

      var script = document.createElement("script");
      script.src = url;
      script.async = true;
      script.addEventListener("load", function () {
        script.dataset.loaded = "true";
        resolve();
      });
      script.addEventListener("error", function () {
        reject(new Error("Failed loading " + url));
      });
      document.head.appendChild(script);
    });
  }

  function ensureGsap() {
    var gsapReady = window.gsap
      ? Promise.resolve()
      : loadScript(GSAP_URL).then(function () {
          if (!window.gsap) {
            throw new Error("GSAP unavailable.");
          }
        });

    return gsapReady.then(function () {
      if (window.ScrollTrigger) {
        return;
      }
      return loadScript(SCROLL_TRIGGER_URL).then(function () {
        if (!window.ScrollTrigger) {
          throw new Error("ScrollTrigger unavailable.");
        }
      });
    });
  }

  function parseTokens(raw) {
    var tokens = {};

    if (!raw) {
      return tokens;
    }

    raw.split(/\s+/).forEach(function (token) {
      var match;

      if (!token) {
        return;
      }

      tokens[token] = true;

      match = token.match(/^([a-z-]+)-(.+)$/);
      if (match) {
        tokens[match[1]] = match[2];
      }
    });

    return tokens;
  }

  function readAttr(el, attrs) {
    var names = Array.isArray(attrs) ? attrs : [attrs];
    var raw;

    for (var i = 0; i < names.length; i += 1) {
      raw = el.getAttribute(names[i]);
      if (raw !== null && raw !== "") {
        return raw;
      }
    }

    return null;
  }

  function readNumber(el, attrs, fallback) {
    var raw = readAttr(el, attrs);
    var value = raw === null ? NaN : Number(raw);
    return Number.isFinite(value) ? value : fallback;
  }

  function readString(el, attrs, fallback) {
    var raw = readAttr(el, attrs);
    return raw === null || raw === "" ? fallback : raw;
  }

  function resolveTarget(el, selector, fallback) {
    if (!selector || selector === "self") {
      return fallback || el;
    }

    if (selector === "parent") {
      return el.parentElement || fallback || el;
    }

    return document.querySelector(selector) || fallback || el;
  }

  function getDefaultTrigger() {
    return (
      document.querySelector(".msc-page") ||
      document.scrollingElement ||
      document.documentElement ||
      document.body
    );
  }

  function getPathOptions(path) {
    var tokens = parseTokens(readAttr(path, [PATH_ATTR, PATH_ATTR_ALT]));
    var triggerSelector =
      readAttr(path, ["dv-path-trigger", "dv_path_trigger"]) ||
      tokens.trigger;
    var trigger = triggerSelector
      ? resolveTarget(path, triggerSelector, getDefaultTrigger())
      : getDefaultTrigger();

    return {
      drawFrom: readNumber(
        path,
        ["dv-path-from", "dv_path_from"],
        tokens.reverse ? 0 : 1
      ),
      drawTo: readNumber(
        path,
        ["dv-path-to", "dv_path_to"],
        tokens.reverse ? 1 : 0
      ),
      scrub: readNumber(path, ["dv-path-scrub", "dv_path_scrub"], 1),
      start: readString(path, ["dv-path-start", "dv_path_start"], "top top"),
      end: readString(path, ["dv-path-end", "dv_path_end"], "bottom bottom"),
      trigger: trigger,
      rotateGradient:
        readAttr(path, ["dv-path-gradient", "dv_path_gradient"]) ||
        tokens.gradient ||
        "",
      rotateDuration: readNumber(
        path,
        ["dv-path-gradient-duration", "dv_path_gradient_duration"],
        5
      ),
      rotateCenter: readString(
        path,
        ["dv-path-gradient-center", "dv_path_gradient_center"],
        ""
      )
    };
  }

  function setPathProgress(path, length, progress) {
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length * progress;
  }

  function initPath(path) {
    var length;
    var options;
    var gradient;
    var rotateCenter;

    if (path.dataset[READY_FLAG] === "true" || !path.getTotalLength) {
      return;
    }

    length = path.getTotalLength();
    options = getPathOptions(path);
    setPathProgress(path, length, options.drawFrom);

    window.gsap.to(path, {
      strokeDashoffset: length * options.drawTo,
      ease: "none",
      scrollTrigger: {
        trigger: options.trigger,
        start: options.start,
        end: options.end,
        scrub: options.scrub,
        invalidateOnRefresh: true
      }
    });

    if (options.rotateGradient) {
      gradient = document.querySelector(options.rotateGradient);
      rotateCenter = options.rotateCenter ? " " + options.rotateCenter : "";

      if (gradient) {
        window.gsap.to(gradient, {
          attr: { gradientTransform: "rotate(360" + rotateCenter + ")" },
          duration: options.rotateDuration,
          ease: "none",
          repeat: -1
        });
      }
    }

    path.dataset[READY_FLAG] = "true";
  }

  function getRevealOptions(el) {
    var tokens = parseTokens(el.getAttribute(REVEAL_ATTR));

    return {
      y: readNumber(el, "dv-reveal-y", tokens.y ? Number(tokens.y) : 40),
      duration: readNumber(el, "dv-reveal-duration", 0.9),
      delay: readNumber(el, "dv-reveal-delay", 0),
      start: readString(el, "dv-reveal-start", "top 88%"),
      once: el.getAttribute("dv-reveal-once") !== "false",
      stagger: readNumber(el, "dv-reveal-stagger", 0)
    };
  }

  function initReveal(el) {
    var options;
    var targets;

    if (el.dataset[REVEAL_READY_FLAG] === "true") {
      return;
    }

    options = getRevealOptions(el);
    targets = el.children.length && options.stagger > 0 ? el.children : el;

    window.gsap.from(targets, {
      y: options.y,
      opacity: 0,
      duration: options.duration,
      delay: options.delay,
      stagger: options.stagger,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: options.start,
        once: options.once
      }
    });

    el.dataset[REVEAL_READY_FLAG] = "true";
  }

  function showReducedMotionFallback(paths, reveals) {
    paths.forEach(function (path) {
      if (!path.getTotalLength) {
        return;
      }
      setPathProgress(path, path.getTotalLength(), 0);
    });

    reveals.forEach(function (el) {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  }

  function initAll() {
    var paths = Array.prototype.slice.call(
      document.querySelectorAll("[" + PATH_ATTR + "],[" + PATH_ATTR_ALT + "]")
    );
    var reveals = Array.prototype.slice.call(
      document.querySelectorAll("[" + REVEAL_ATTR + "]")
    );
    var prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!paths.length && !reveals.length) {
      return;
    }

    if (prefersReducedMotion) {
      showReducedMotionFallback(paths, reveals);
      return;
    }

    ensureGsap()
      .then(function () {
        window.gsap.registerPlugin(window.ScrollTrigger);
        paths.forEach(initPath);
        reveals.forEach(initReveal);
        window.ScrollTrigger.refresh();
      })
      .catch(function (error) {
        console.error("[dv-path] Initialization failed:", error);
      });
  }

  window.dvPathRefresh = function () {
    if (window.ScrollTrigger) {
      window.ScrollTrigger.refresh();
    }
    initAll();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
})();
