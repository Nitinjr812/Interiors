"use client";


import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import { Observer } from "gsap/Observer";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(Observer, ScrollTriggern);

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* ========================================================================== */
/*  CONTENT (edit here)                                                       */
/* ========================================================================== */

const SITE = {
  name: "Asrani Interiors",
  email: "hello@asraniinteriors.com",
  phone: "+91 98765 43210",
  address: ["12 Studio Lane, Design District", "India"],
  socials: [
    ["Instagram", "#"],
    ["Pinterest", "#"],
    ["Behance", "#"],
    ["LinkedIn", "#"],
  ],
};

const PH = [
  "1618221195710-dd6b41faaea6",
  "1586023492125-27b2c045efd7",
  "1616486338812-3dadae4b4ace",
  "1600210492486-724fe5c67fb0",
  "1600607687939-ce8a6c25118c",
  "1540518614846-7eded433c457",
  "1505693416388-ac5ce068fe85",
  "1493663284031-b7e3aefcae8e",
  "1556228453-efd6c1ff04f6",
  "1567016376408-0226e4d0c1ea",
  "1618219908412-a29a1bb7b86e",
  "1600585154340-be6161a56a0c",
];
const ph = (i, w = 1200) =>
  `https://images.unsplash.com/photo-${PH[i % PH.length]}?auto=format&fit=crop&w=${w}&q=80`;

const IMG = {
  hero: ph(3, 2200),
  about: [ph(5, 1000), ph(7, 800)],
  servicesBg: ph(2, 1800),
  services: [ph(8, 700), ph(4, 700), ph(9, 700), ph(11, 700)],
  journal: [ph(1, 900), ph(10, 800), ph(0, 800), ph(6, 800)],
};

const PROJECTS = [
  {
    title: "Amber House",
    place: "Ahmedabad",
    year: 2024,
    desc: "Warm timber and lime plaster give a family home its slow, sunlit rhythm.",
    palette: "amber oak, clay, and soft linen white.",
    brief: "Residential interior for a family home in Ahmedabad.",
    img: ph(0, 1400),
    acc: ph(7, 700),
  },
  {
    title: "Quiet Study",
    place: "Mumbai",
    year: 2024,
    desc: "Neutral tones and honest materials shape a focused, reflective workspace.",
    palette: "ash wood, oat beige, and ivory.",
    brief: "Home office concept for a Mumbai apartment.",
    img: ph(1, 1400),
    acc: ph(9, 700),
  },
  {
    title: "Salt & Stone",
    place: "Goa",
    year: 2023,
    desc: "Textured walls and open sightlines let a coastal villa breathe with the light.",
    palette: "sea-salt white, driftwood, and sage.",
    brief: "Coastal villa interior in North Goa.",
    img: ph(2, 1400),
    acc: ph(4, 700),
  },
  {
    title: "The Long Table",
    place: "Delhi",
    year: 2023,
    desc: "A dining room built around one generous table, and the conversations it holds.",
    palette: "walnut, brass, and warm stone.",
    brief: "Dining and lounge concept for a Delhi residence.",
    img: ph(8, 1400),
    acc: ph(3, 700),
  },
  {
    title: "Hush",
    place: "Bengaluru",
    year: 2023,
    desc: "A bedroom suite designed for slow mornings, soft light and deep rest.",
    palette: "mushroom, bone, and washed linen.",
    brief: "Primary suite for a home in Bengaluru.",
    img: ph(5, 1400),
    acc: ph(6, 700),
  },
  {
    title: "Courtyard",
    place: "Pune",
    year: 2022,
    desc: "An inner courtyard brings green, air and daylight into the centre of the home.",
    palette: "terracotta, fern, and pale plaster.",
    brief: "Courtyard-led residence in Pune.",
    img: ph(11, 1400),
    acc: ph(10, 700),
  },
  {
    title: "The Corner Café",
    place: "Kochi",
    year: 2022,
    desc: "A neighbourhood café with warm joinery, low lighting and an easy, lived-in feel.",
    palette: "teak, cream, and burnt sienna.",
    brief: "Hospitality interior for a café in Kochi.",
    img: ph(4, 1400),
    acc: ph(2, 700),
  },
  {
    title: "North Light",
    place: "Hyderabad",
    year: 2022,
    desc: "A studio-style apartment where every corner is arranged around the day’s best light.",
    palette: "birch, chalk, and pale grey.",
    brief: "Apartment interior in Hyderabad.",
    img: ph(6, 1400),
    acc: ph(1, 700),
  },
];

const SERVICES = [
  {
    title: "Design Project",
    text: "A complete design package with plans, moodboards and working drawings, crafted around your lifestyle.",
    price: "from ₹ 150 / sq ft",
  },
  {
    title: "Sourcing",
    text: "Furniture, fabrics, lighting and finishes, sourced from trusted makers and workshops.",
    price: "from ₹ 60 / sq ft",
  },
  {
    title: "Styling",
    text: "The final layer: art, textiles, objects and greenery that make a space feel finished and personal.",
    price: "from ₹ 40 / sq ft",
  },
  {
    title: "Supervision",
    text: "On-site coordination with contractors and craftsmen, so the finished space matches the design.",
    price: "from ₹ 80 / sq ft",
  },
];

const JOURNAL = [
  {
    title: "Spaces that breathe",
    text: "Designing interiors that invite slow living, gentle movement and mindful rituals.",
  },
  {
    title: "Textures of stillness",
    text: "How lime wash, linen and raw stone quiet a room.",
  },
  {
    title: "Light as a material",
    text: "Shaping shadow, glow and reflection through the course of a day.",
  },
  {
    title: "The beauty of restraint",
    text: "Why the best rooms are edited down, not filled up.",
  },
];

const NAV = [
  ["About us", 1],
  ["Portfolio", 2],
  ["Gallery", "/gallery"],
  ["Services", 3],
  ["Journal", 4],
];

const IDS = ["home", "about", "portfolio", "services", "journal", "contact"];
const LABELS = ["Home", "About", "Portfolio", "Services", "Journal", "Contact"];

const N = 6;
const KIND = ["cover", "push", "cover", "cover", "push", "push"];

/* ========================================================================== */
/*  ANIMATION BUILDING BLOCKS                                                 */
/* ========================================================================== */

const has = (t) => t && t.length > 0;

const rise = (tl, t, at = 0, stagger = 0.12, dur = 1.15) =>
  has(t) &&
  tl.fromTo(
    t,
    { yPercent: 118 },
    { yPercent: 0, duration: dur, ease: "power4.out", stagger },
    at
  );

const fade = (tl, t, at = 0, dur = 0.9, y = 20, stagger = 0.08) =>
  has(t) &&
  tl.fromTo(
    t,
    { autoAlpha: 0, y },
    { autoAlpha: 1, y: 0, duration: dur, ease: "power3.out", stagger },
    at
  );

const wipe = (tl, t, at = 0, dur = 1.2, stagger = 0.14) =>
  has(t) &&
  tl.fromTo(
    t,
    { autoAlpha: 1, clipPath: "inset(0% 0% 100% 0%)" },
    { clipPath: "inset(0% 0% 0% 0%)", duration: dur, ease: "power3.inOut", stagger },
    at
  );

const zoom = (tl, t, at = 0, dur = 1.7, stagger = 0.14) =>
  has(t) &&
  tl.fromTo(t, { scale: 1.32 }, { scale: 1, duration: dur, ease: "power3.out", stagger }, at);

function slideIn(panel, tl = gsap.timeline()) {
  const q = gsap.utils.selector(panel);
  wipe(tl, q(".pf-img"), 0, 1.1, 0);
  zoom(tl, q(".pf-img img"), 0, 1.5, 0);
  fade(tl, q(".pf-txt"), 0.35, 0.8, 22, 0.08);
  wipe(tl, q(".pf-acc"), 0.5, 1, 0);
  zoom(tl, q(".pf-acc img"), 0.5, 1.4, 0);
  fade(tl, q(".pf-cap"), 0.85, 0.7, 14, 0);
  return tl;
}

const IN = [
  (p) => {
    const q = gsap.utils.selector(p);
    const tl = gsap.timeline({ paused: true });
    has(q(".hero-bg .im img")) &&
      tl.fromTo(
        q(".hero-bg .im img"),
        { scale: 1.3 },
        { scale: 1.04, duration: 2.8, ease: "power3.out" },
        0
      );
    rise(tl, q(".hero-h .ln-i"), 0.25, 0.14, 1.3);
    fade(tl, q(".hero-b p, .hero-b .lnk"), 1.0, 0.95, 22, 0.14);
    fade(tl, q(".hero-scroll"), 1.5, 0.9, 12, 0);
    return tl;
  },
  (p) => {
    const q = gsap.utils.selector(p);
    const tl = gsap.timeline({ paused: true });
    fade(tl, q(".ab-lbl"), 0.5, 0.8, 10, 0);
    rise(tl, q(".ab .ln-i"), 0.5, 0.12, 1.15);
    fade(tl, q(".ab-p, .ab .lnk"), 0.95, 0.9, 22, 0.12);
    wipe(tl, q(".ab-i1"), 0.75, 1.3, 0);
    zoom(tl, q(".ab-i1 img"), 0.75, 1.8, 0);
    wipe(tl, q(".ab-i2"), 1.0, 1.3, 0);
    zoom(tl, q(".ab-i2 img"), 1.0, 1.8, 0);
    return tl;
  },
  (p) => {
    const q = gsap.utils.selector(p);
    const tl = gsap.timeline({ paused: true });
    fade(tl, q(".pf-head .lbl"), 0.4, 0.8, 10, 0);
    rise(tl, q(".pf-head .ln-i"), 0.4, 0.1, 1.15);
    tl.add(slideIn(p, gsap.timeline()), 0.3);
    fade(tl, q(".pf-ctl .rb"), 1.3, 0.7, 12, 0.08);
    return tl;
  },
  (p) => {
    const q = gsap.utils.selector(p);
    const tl = gsap.timeline({ paused: true });
    fade(tl, q(".svc-txt .lbl"), 0.4, 0.8, 10, 0);
    rise(tl, q(".svc .ln-i"), 0.4, 0.12, 1.15);
    fade(tl, q(".svc-txt p, .svc-txt .lnk"), 0.85, 0.9, 20, 0.12);
    wipe(tl, q(".svc-card"), 0.35, 1.15, 0.13);
    zoom(tl, q(".sc-img img"), 0.35, 1.6, 0.13);
    fade(tl, q(".sc-no, .sc-t"), 1.0, 0.7, 12, 0.08);
    fade(tl, q(".svc-note"), 1.4, 0.8, 12, 0);
    return tl;
  },
  (p) => {
    const q = gsap.utils.selector(p);
    const tl = gsap.timeline({ paused: true });
    fade(tl, q(".jr-head .lbl"), 0.4, 0.8, 10, 0);
    rise(tl, q(".jr .ln-i"), 0.4, 0.1, 1.15);
    wipe(tl, q(".jr-pic"), 0.55, 1.2, 0.15);
    zoom(tl, q(".jr-pic .im img"), 0.55, 1.6, 0.15);
    fade(tl, q(".jr-t"), 1.0, 0.7, 12, 0.12);
    return tl;
  },
  (p) => {
    const q = gsap.utils.selector(p);
    const tl = gsap.timeline({ paused: true });
    fade(tl, q(".ct-l .lbl"), 0.4, 0.8, 10, 0);
    rise(tl, q(".ct .ln-i"), 0.4, 0.12, 1.15);
    fade(tl, q(".ct-p"), 0.85, 0.9, 20, 0);
    fade(tl, q(".fld, .cf-send"), 0.7, 0.8, 16, 0.09);
    has(q(".fld-line")) &&
      tl.fromTo(
        q(".fld-line"),
        { scaleX: 0 },
        { scaleX: 1, duration: 1.1, ease: "power3.inOut", stagger: 0.09 },
        0.75
      );
    fade(tl, q(".ft-logo, .ft-col"), 0.9, 0.8, 16, 0.08);
    fade(tl, q(".mq"), 1.1, 1, 0, 0);
    return tl;
  },
];

/* ========================================================================== */
/*  SMALL PIECES                                                              */
/* ========================================================================== */

const Arrow = () => (
  <svg className="arw" viewBox="0 0 26 12" aria-hidden="true" focusable="false">
    <path d="M0 6h24.5M19.5 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.1" />
  </svg>
);

function Line({ text, cls = "" }) {
  const words = text.split(" ");
  return (
    <span className={`ln ${cls}`}>
      <span className="ln-i">
        {words.map((w, i) => {
          const sw = w.startsWith("~");
          const word = sw ? w.slice(1) : w;
          return (
            <React.Fragment key={i}>
              {i > 0 && " "}
              {sw ? (
                <>
                  <span className="sw">{word[0]}</span>
                  {word.slice(1)}
                </>
              ) : (
                word
              )}
            </React.Fragment>
          );
        })}
      </span>
    </span>
  );
}

function Hd({ as: Tag = "h2", lines, size = "m", className = "" }) {
  return (
    <Tag className={`hd hd-${size} ${className}`}>
      {lines.map((l, i) =>
        typeof l === "string" ? <Line key={i} text={l} /> : <Line key={i} text={l.t} cls={l.c} />
      )}
    </Tag>
  );
}

function Img({ src, alt = "", className = "", tone = 0, eager = false }) {
  const [bad, setBad] = useState(false);
  return (
    <div className={`im ${className}`} style={{ "--t": tone }}>
      {!bad && (
        <img
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          draggable="false"
          onError={() => setBad(true)}
        />
      )}
    </div>
  );
}

const Panel = ({ id, cls = "", children }) => (
  <section className={`panel ${cls}`} id={id} data-panel="">
    <div className="pin">{children}</div>
    <div className="veil" aria-hidden="true" />
  </section>
);

const pad2 = (n) => String(n).padStart(2, "0");
const pad4 = (n) => String(Math.max(0, Math.round(n))).padStart(4, "0");

/* ========================================================================== */
/*  CONSTRUCTION / DRAFTING CURSOR                                            */
/* ========================================================================== */

const CUR_SEL = "a, button, input, textarea, [data-cur]";
const CUR_BASE = 30;

function Cursor({ rootRef }) {
  const el = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const host = el.current;
    if (!root || !host) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    root.classList.add("has-cur");

    const q = (s) => host.querySelector(s);
    const hL = q(".cur-h");
    const vL = q(".cur-v");
    const ring = q(".cur-ring");
    const dot = q(".cur-dot");
    const lbl = q(".cur-lbl");
    const pulse = q(".cur-pulse");
    const xy = q(".cur-xy");
    const act = q(".cur-act");

    const mid = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    gsap.set([dot, ring, lbl, pulse], { x: mid.x, y: mid.y });
    gsap.set(hL, { y: mid.y });
    gsap.set(vL, { x: mid.x });
    gsap.set(pulse, { autoAlpha: 0 });

    const dx = gsap.quickTo(dot, "x", { duration: 0.07, ease: "power3.out" });
    const dy = gsap.quickTo(dot, "y", { duration: 0.07, ease: "power3.out" });
    const rx = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3.out" });
    const ry = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3.out" });
    const lx = gsap.quickTo(lbl, "x", { duration: 0.6, ease: "power3.out" });
    const ly = gsap.quickTo(lbl, "y", { duration: 0.6, ease: "power3.out" });
    const hy = gsap.quickTo(hL, "y", { duration: 0.16, ease: "power2.out" });
    const vx = gsap.quickTo(vL, "x", { duration: 0.16, ease: "power2.out" });

    let x = mid.x;
    let y = mid.y;
    let shown = false;
    let current = null;
    let snap = null;
    let raf = 0;

    const size = (w, h) => {
      ring.style.setProperty("--w", w + "px");
      ring.style.setProperty("--h", h + "px");
    };
    size(CUR_BASE, CUR_BASE);

    const paintXY = () => {
      raf = 0;
      xy.textContent = `X ${pad4(x)}  Y ${pad4(y)}`;
    };

    const follow = () => {
      dx(x);
      dy(y);
      hy(y);
      vx(x);
      lx(x);
      ly(y);
      rx(snap ? snap.cx : x);
      ry(snap ? snap.cy : y);
      if (!raf) raf = requestAnimationFrame(paintXY);
    };

    const setTarget = (t) => {
      const c = t && t.closest ? t.closest(CUR_SEL) : null;
      if (c === current) return;
      current = c;
      snap = null;
      host.classList.remove("is-link", "is-text", "is-snap");
      act.textContent = "";
      if (!c) {
        size(CUR_BASE, CUR_BASE);
        return;
      }
      if (c.matches("input, textarea")) {
        host.classList.add("is-text");
        size(2, 28);
        return;
      }
      host.classList.add("is-link");
      act.textContent = c.getAttribute("data-cur") || "Open";
      const r = c.getBoundingClientRect();
      if (r.width <= 380 && r.height <= 100 && !c.hasAttribute("data-free")) {
        snap = { cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
        host.classList.add("is-snap");
        size(r.width + 18, r.height + 12);
      } else {
        size(64, 64);
      }
    };

    const onMove = (e) => {
      x = e.clientX;
      y = e.clientY;
      if (!shown) {
        shown = true;
        gsap.set([dot, ring, lbl], { x, y });
        gsap.set(hL, { y });
        gsap.set(vL, { x });
        host.classList.add("on");
      }
      setTarget(e.target);
      follow();
    };

    const onDown = () => {
      host.classList.add("is-down");
      gsap.killTweensOf(pulse);
      gsap.fromTo(
        pulse,
        { x, y, scale: 0.25, autoAlpha: 0.9 },
        { scale: 2.6, autoAlpha: 0, duration: 0.85, ease: "power3.out" }
      );
    };
    const onUp = () => host.classList.remove("is-down");
    const onLeave = () => host.classList.remove("on");
    const onEnter = () => shown && host.classList.add("on");

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      root.classList.remove("has-cur");
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      gsap.killTweensOf([dot, ring, lbl, pulse, hL, vL]);
    };
  }, [rootRef]);

  return (
    <div className="cur" ref={el} aria-hidden="true">
      <i className="cur-h" />
      <i className="cur-v" />
      <div className="cur-ring">
        <div className="cur-box">
          <b />
          <b />
          <b />
          <b />
          <i />
          <i />
          <i />
          <i />
        </div>
      </div>
      <div className="cur-pulse" />
      <div className="cur-dot" />
      <div className="cur-lbl">
        <div className="cur-txt">
          <span className="cur-act" />
          <span className="cur-xy">X 0000  Y 0000</span>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================== */
/*  SECTION RULE                                                              */
/* ========================================================================== */

const Rule = ({ active, nav }) => (
  <div className="rule" role="navigation" aria-label="Sections">
    {LABELS.map((l, i) => (
      <a
        key={l}
        href={`#${IDS[i]}`}
        className={`rl ${active === i ? "on" : ""}`}
        data-cur={l}
        aria-label={`Go to ${l}`}
        aria-current={active === i ? "true" : undefined}
        onClick={nav(i)}
      >
        <span className="rl-n">{pad2(i + 1)}</span>
        <i className="rl-t" />
        <i className="rl-m" />
      </a>
    ))}
  </div>
);

/* ========================================================================== */
/*  PORTFOLIO SLIDER                                                          */
/* ========================================================================== */

function Portfolio() {
  const ref = useRef(null);
  const busy = useRef(false);
  const prev = useRef(0);
  const [i, setI] = useState(0);
  const p = PROJECTS[i];

  useEffect(() => {
    PROJECTS.forEach((x) => {
      [x.img, x.acc].forEach((s) => {
        const im = new Image();
        im.src = s;
      });
    });
  }, []);

  useIso(() => {
    if (prev.current === i) return;
    prev.current = i;
    const tl = slideIn(ref.current);
    tl.eventCallback("onComplete", () => {
      busy.current = false;
    });
  }, [i]);

  const step = (d) => {
    if (busy.current) return;
    busy.current = true;
    const q = gsap.utils.selector(ref.current);
    gsap.to(q(".pf-swap"), {
      autoAlpha: 0,
      duration: 0.35,
      ease: "power2.in",
      onComplete: () => setI((v) => (v + d + PROJECTS.length) % PROJECTS.length),
    });
  };

  /* ---- finger-swipe support: left/right on the slide changes the project.
   *  Only reacts to gestures that are clearly more horizontal than vertical,
   *  so page scrolling on mobile is never hijacked. ---------------------- */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let sx = 0,
      sy = 0,
      tracking = false,
      lock = null; // "x" | "y" | null

    const onStart = (e) => {
      if (e.target.closest("input, textarea, button")) return;
      const t = e.touches[0];
      sx = t.clientX;
      sy = t.clientY;
      tracking = true;
      lock = null;
    };
    const onMove = (e) => {
      if (!tracking) return;
      const t = e.touches[0];
      const dx = t.clientX - sx;
      const dy = t.clientY - sy;
      if (!lock && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
        lock = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      }
      // once we know it's a horizontal swipe, stop the page from scrolling
      if (lock === "x" && e.cancelable) e.preventDefault();
    };
    const onEnd = (e) => {
      if (!tracking) return;
      tracking = false;
      if (lock !== "x") return;
      const t = e.changedTouches[0];
      const dx = t.clientX - sx;
      if (Math.abs(dx) > 42) step(dx < 0 ? 1 : -1);
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
    };
  }, []);

  return (
    <div className="pf" ref={ref}>
      <header className="pf-head">
        <p className="lbl">Portfolio</p>
        <Hd lines={["PROJECTS WE ~CHERISH"]} size="m" />
      </header>

      <div className="pf-body">
        <div className="pf-l dp" data-depth="0.5" data-cur="View" data-free="">
          <Img
            key={p.img}
            src={p.img}
            alt={`${p.title}, ${p.place}`}
            className="pf-img pf-swap"
            tone={i}
          />
        </div>

        <div className="pf-r">
          <div className="pf-meta pf-txt pf-swap">
            <span>
              {p.place}, {p.year}
            </span>
            <span>
              {pad2(i + 1)}/{pad2(PROJECTS.length)}
            </span>
          </div>

          <div className="pf-mid">
            <div className="pf-copy dp" data-depth="0.15">
              <h3 className="pf-title pf-txt pf-swap">{p.title}</h3>
              <p className="pf-desc pf-txt pf-swap">{p.desc}</p>
            </div>
            <figure className="pf-accw dp" data-depth="0.35">
              <Img key={p.acc} src={p.acc} alt="" className="pf-acc pf-swap" tone={i + 2} />
              <figcaption className="pf-cap pf-swap">Accent palette: {p.palette}</figcaption>
            </figure>
          </div>

          <div className="pf-foot">
            <p className="pf-brief pf-txt pf-swap">{p.brief}</p>
            <div className="pf-ctl">
              <button
                className="rb pf-prev"
                aria-label="Previous project"
                data-cur="Prev"
                onClick={() => step(-1)}
              >
                <span className="rb-a rb-flip">
                  <Arrow />
                </span>
              </button>
              <button
                className="rb rb-on pf-next"
                aria-label="Next project"
                data-cur="Next"
                onClick={() => step(1)}
              >
                <span className="rb-a">
                  <Arrow />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================== */
/*  CONTACT FORM                                                              */
/* ========================================================================== */

function ContactForm() {
  const [sent, setSent] = useState(false);
  const onSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };
  return (
    <form className="cf" onSubmit={onSubmit}>
      <label className="fld">
        <input name="name" placeholder="Name" aria-label="Name" autoComplete="name" required />
        <i className="fld-line" />
      </label>
      <div className="cf-2">
        <label className="fld">
          <input name="phone" type="tel" placeholder="Phone" aria-label="Phone" autoComplete="tel" />
          <i className="fld-line" />
        </label>
        <label className="fld">
          <input
            name="email"
            type="email"
            placeholder="Email"
            aria-label="Email"
            autoComplete="email"
            required
          />
          <i className="fld-line" />
        </label>
      </div>
      <label className="fld fld-ta">
        <textarea name="message" rows={3} placeholder="Message" aria-label="Message" />
      </label>
      <button type="submit" className="lnk cf-send" data-cur="Send">
        Send request <Arrow />
      </button>
      <p className={`cf-ok ${sent ? "show" : ""}`} role="status" aria-live="polite">
        {sent ? "Thank you. We’ll get back to you within one working day." : ""}
      </p>
    </form>
  );
}

/* ========================================================================== */
/*  NAVBAR                                                                    */
/* ========================================================================== */

const Nav = ({ menu, setMenu, nav, glass, toGallery }) => (
  <>
    <nav className={`nav ${glass ? "nav-glass" : ""}`} aria-label="Primary">
      <a className="brand" href="#home" data-cur="Home" onClick={nav(0)}>
        {SITE.name}
      </a>
      <ul className="nav-l">
        {NAV.map(([label, i]) => (
          <li key={label}>
            {typeof i === "string" ? (
              <a href={i} data-cur="Open" onClick={toGallery}>
                {label}
              </a>
            ) : (
              <a href={`#${IDS[i]}`} data-cur="Go" onClick={nav(i)}>
                {label}
              </a>
            )}
          </li>
        ))}
      </ul>
      <a className="nav-c" href="#contact" data-cur="Talk" onClick={nav(5)}>
        Contact
      </a>
      <button
        className="menu-btn"
        aria-expanded={menu}
        aria-label={menu ? "Close menu" : "Open menu"}
        onClick={() => setMenu((v) => !v)}
      >
        <span className={`bg ${menu ? "open" : ""}`}>
          <i />
          <i />
        </span>
      </button>
    </nav>

    <div className={`mnav ${menu ? "open" : ""}`} aria-hidden={!menu}>
      <ul>
        {NAV.map(([label, i]) => (
          <li key={label}>
            {typeof i === "string" ? (
              <a href={i} onClick={toGallery}>
                {label}
              </a>
            ) : (
              <a href={`#${IDS[i]}`} onClick={nav(i)}>
                {label}
              </a>
            )}
          </li>
        ))}
        <li>
          <a href="#contact" onClick={nav(5)}>
            Contact
          </a>
        </li>
      </ul>
    </div>
  </>
);

/* ========================================================================== */
/*  PAGE                                                                      */
/* ========================================================================== */

export default function LandingPage() {
  const rootRef = useRef(null);
  const engine = useRef(null);
  const [menu, setMenu] = useState(false);
  const [glass, setGlass] = useState(false);
  const [active, setActive] = useState(0);



  const navigate = useNavigate();
  const toGallery = (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    setMenu(false);
    navigate("/gallery");
  };
  const nav = (i) => (e) => {
    if (engine.current) {
      e.preventDefault();
      setMenu(false);
      engine.current.goTo(i);
    }
  };

  useEffect(() => {
    const urls = [IMG.hero, ...IMG.about, IMG.servicesBg, ...IMG.services, ...IMG.journal];
    const run = () =>
      urls.forEach((u) => {
        const im = new Image();
        im.decoding = "async";
        im.src = u;
        if (im.decode) im.decode().catch(() => { });
      });
    let id;
    const idle = "requestIdleCallback" in window;
    if (idle) id = window.requestIdleCallback(run, { timeout: 2500 });
    else id = window.setTimeout(run, 1200);
    return () => {
      if (idle) window.cancelIdleCallback(id);
      else window.clearTimeout(id);
    };
  }, []);

  useIso(() => {
    const root = rootRef.current;
    const mm = gsap.matchMedia(root);

    mm.add(
      {
        any: "(min-width: 1px)",
        full: "(min-width: 901px) and (min-height: 540px) and (prefers-reduced-motion: no-preference)",
        calm: "(prefers-reduced-motion: reduce)",
      },
      (ctx) => {
        const { full, calm } = ctx.conditions;
        const q = gsap.utils.selector(root);
        const panels = q("[data-panel]");
        const cleanups = [];

        if (!calm) {
          const track = q(".mq-track")[0];
          if (track) gsap.to(track, { xPercent: -50, duration: 38, ease: "none", repeat: -1 });
        }

        if (calm) {
          root.classList.add("st");
          setGlass(true);
          engine.current = {
            goTo: (i) => panels[i]?.scrollIntoView({ behavior: "auto" }),
          };
          return () => {
            root.classList.remove("st");
            engine.current = null;
          };
        }

        if (!full) {
          root.classList.add("st");
          ScrollTrigger.normalizeScroll({ allowNestedScroll: true });
          ScrollTrigger.config({ ignoreMobileResize: true });
          const tls = panels.map((p, i) => IN[i](p));
          panels.forEach((p, i) => {
            if (i === 0) {
              gsap.delayedCall(0.2, () => tls[0].play());
              return;
            }
            ScrollTrigger.create({
              trigger: p,
              start: "top 78%",
              once: true,
              onEnter: () => tls[i].play(),
            });
          });
          q(".im img").forEach((img) => {
            const wrap = img.closest(".im");
            gsap.fromTo(
              img,
              { yPercent: -4 },
              {
                yPercent: 4,
                ease: "none",
                scrollTrigger: { trigger: wrap, start: "top bottom", end: "bottom top", scrub: true },
              }
            );
          });
          const navSt = ScrollTrigger.create({
            trigger: panels[0],
            start: "bottom top+=64",
            onEnter: () => setGlass(true),
            onLeaveBack: () => setGlass(false),
          });
          cleanups.push(() => navSt.kill());
          engine.current = {
            goTo: (i) => panels[i]?.scrollIntoView({ behavior: "smooth" }),
          };
          return () => {
            cleanups.forEach((fn) => fn());
            root.classList.remove("st");
            ScrollTrigger.normalizeScroll(false);
            engine.current = null;
          };
        }

        root.classList.add("fp");
        panels.forEach((p, k) => p.classList.toggle("is-on", k === 0));
        setGlass(false);
        setActive(0);

        const S = { cur: 0, busy: true, tl: {} };
        const pinOf = (p) => p.querySelector(".pin");
        const veilOf = (p) => p.querySelector(".veil");
        const depthOf = (p) => Array.from(p.querySelectorAll(".dp"));
        const build = (i) => {
          S.tl[i] && S.tl[i].kill();
          S.tl[i] = IN[i](panels[i]);
          return S.tl[i];
        };

        const go = (to, dir) => {
          if (S.busy || to === S.cur) return;
          S.busy = true;
          setGlass(to !== 0);
          setActive(to);

          const from = S.cur;
          const A = panels[from];
          const B = panels[to];
          const adjacent = dir === 1 ? to === (from + 1) % N : from === (to + 1) % N;
          const kind = adjacent ? KIND[dir === 1 ? from : to] : "cover";
          const dur = kind === "push" ? 1.05 : 1.15;
          const ease = kind === "push" ? "power2.inOut" : "power3.inOut";
          const dA = depthOf(A);
          const dB = depthOf(B);
          const off = (el) => parseFloat(el.dataset.depth || 0) * window.innerHeight * 0.24;
          const soft = (el) => off(el) * 0.6;

          const inTl = build(to);
          B.classList.add("is-on");

          const finish = () => {
            A.classList.remove("is-on");
            gsap.set([A, B, pinOf(A), pinOf(B), ...dA, ...dB], {
              clearProps: "transform,clipPath,zIndex",
            });
            gsap.set([veilOf(A), veilOf(B)], { clearProps: "opacity" });
            S.cur = to;
            gsap.delayedCall(0.08, () => {
              S.busy = false;
            });
          };

          const tl = gsap.timeline({
            defaults: { duration: dur, ease, force3D: true },
            onComplete: finish,
          });

          if (kind === "cover") {
            if (dir === 1) {
              gsap.set(A, { zIndex: 2 });
              gsap.set(B, { zIndex: 3, yPercent: 100 });
              gsap.set(pinOf(B), { yPercent: -90 });
              tl.to(B, { yPercent: 0 }, 0)
                .to(pinOf(B), { yPercent: 0 }, 0)
                .to(pinOf(A), { yPercent: -14 }, 0)
                .to(veilOf(A), { opacity: 0.7 }, 0)
                .to(dA, { y: (i, el) => -soft(el) }, 0)
                .fromTo(dB, { y: (i, el) => soft(el) }, { y: 0 }, 0);
            } else {
              gsap.set(B, { zIndex: 2 });
              gsap.set(A, { zIndex: 3 });
              gsap.set(pinOf(B), { yPercent: -14 });
              gsap.set(veilOf(B), { opacity: 0.7 });
              tl.to(A, { yPercent: 100 }, 0)
                .to(pinOf(A), { yPercent: -90 }, 0)
                .to(pinOf(B), { yPercent: 0 }, 0)
                .to(veilOf(B), { opacity: 0 }, 0)
                .to(dA, { y: (i, el) => soft(el) }, 0)
                .fromTo(dB, { y: (i, el) => -soft(el) }, { y: 0 }, 0);
            }
          } else if (dir === 1) {
            gsap.set(A, { zIndex: 1 });
            gsap.set(B, { zIndex: 2, yPercent: 100 });
            tl.to(A, { yPercent: -100 }, 0)
              .to(B, { yPercent: 0 }, 0)
              .to(dA, { y: (i, el) => -off(el) }, 0)
              .fromTo(dB, { y: (i, el) => off(el) }, { y: 0 }, 0);
          } else {
            gsap.set(A, { zIndex: 1 });
            gsap.set(B, { zIndex: 2, yPercent: -100 });
            tl.to(A, { yPercent: 100 }, 0)
              .to(B, { yPercent: 0 }, 0)
              .to(dA, { y: (i, el) => off(el) }, 0)
              .fromTo(dB, { y: (i, el) => -off(el) }, { y: 0 }, 0);
          }

          tl.add(() => inTl.play(0), dur * 0.38);
        };

        const next = () => go((S.cur + 1) % N, 1);
        const prev = () => go((S.cur - 1 + N) % N, -1);

        engine.current = {
          goTo: (i) => {
            if (i !== S.cur) go(i, i > S.cur ? 1 : -1);
          },
        };

        /* ---- wheel: inertia-safe, tuned to trigger sooner for a snappier,
         * smoother feel while still ignoring trackpad inertia tails. ------- */
        let acc = 0;
        let lastT = 0;
        let prevAbs = 0;
        let fresh = true;
        const onWheel = (e) => {
          if (e.ctrlKey) return;
          if (e.target && e.target.closest && e.target.closest("textarea")) return;
          e.preventDefault();

          const now = performance.now();
          const gap = now - lastT;
          lastT = now;
          const dyRaw =
            e.deltaMode === 1
              ? e.deltaY * 32
              : e.deltaMode === 2
                ? e.deltaY * window.innerHeight
                : e.deltaY;
          const a = Math.abs(dyRaw);

          if (gap > 140) {
            fresh = true;
            acc = 0;
          } else if (!fresh && !S.busy && a >= 30 && a > prevAbs * 1.6) {
            fresh = true;
            acc = 0;
          }
          prevAbs = a;

          if (S.busy || !fresh) return;

          if (Math.sign(dyRaw) !== Math.sign(acc)) acc = 0;
          acc += dyRaw;
          if (Math.abs(acc) >= 32) {
            const d = acc > 0 ? 1 : -1;
            acc = 0;
            fresh = false;
            d === 1 ? next() : prev();
          }
        };
        window.addEventListener("wheel", onWheel, { passive: false });
        cleanups.push(() => window.removeEventListener("wheel", onWheel));

        const obs = Observer.create({
          target: window,
          type: "touch",
          tolerance: 14,
          dragMinimum: 10,
          preventDefault: true,
          ignore: "textarea",
          onUp: next,
          onDown: prev,
        });

        const onKey = (e) => {
          const t = e.target;
          const tag = t && t.tagName ? t.tagName.toLowerCase() : "";
          if (tag === "input" || tag === "textarea" || tag === "select") return;
          const k = e.key;
          if (k === "ArrowDown" || k === "PageDown" || (k === " " && tag !== "button" && tag !== "a")) {
            e.preventDefault();
            next();
          } else if (k === "ArrowUp" || k === "PageUp") {
            e.preventDefault();
            prev();
          } else if (k === "Home") {
            e.preventDefault();
            engine.current.goTo(0);
          } else if (k === "End") {
            e.preventDefault();
            engine.current.goTo(N - 1);
          } else if (S.cur === 2 && (k === "ArrowRight" || k === "ArrowLeft")) {
            const btn = root.querySelector(k === "ArrowRight" ? ".pf-next" : ".pf-prev");
            btn && btn.click();
          }
        };
        window.addEventListener("keydown", onKey);
        cleanups.push(() => window.removeEventListener("keydown", onKey));

        const hero = panels[0];
        const spot = q(".hero-spot")[0];
        const bg = q(".hero-bg")[0];
        if (spot && bg && window.matchMedia("(pointer: fine)").matches) {
          gsap.set(spot, { x: window.innerWidth * 0.62, y: window.innerHeight * 0.72 });
          const sx = gsap.quickTo(spot, "x", { duration: 0.9, ease: "power3.out" });
          const sy = gsap.quickTo(spot, "y", { duration: 0.9, ease: "power3.out" });
          const qx = gsap.quickTo(bg, "x", { duration: 1.6, ease: "power3.out" });
          const qy = gsap.quickTo(bg, "y", { duration: 1.6, ease: "power3.out" });
          const onMove = (e) => {
            sx(e.clientX);
            sy(e.clientY);
            qx((0.5 - e.clientX / window.innerWidth) * 34);
            qy((0.5 - e.clientY / window.innerHeight) * 24);
          };
          hero.addEventListener("pointermove", onMove, { passive: true });
          cleanups.push(() => hero.removeEventListener("pointermove", onMove));
        }

        const navTl = gsap.timeline({ paused: true });
        has(q(".nav .brand, .nav-l li, .nav-c, .menu-btn")) &&
          navTl.fromTo(
            q(".nav .brand, .nav-l li, .nav-c, .menu-btn"),
            { autoAlpha: 0, y: -10 },
            { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.07 },
            0.15
          );

        const start = () => {
          build(0).play(0);
          navTl.play(0);
          gsap.delayedCall(1.5, () => {
            S.busy = false;
          });
        };
        let started = false;
        const kick = () => {
          if (started) return;
          started = true;
          start();
        };
        build(0);
        gsap.set(q(".nav .brand, .nav-l li, .nav-c, .menu-btn"), { autoAlpha: 0 });
        const fontsReady =
          document.fonts && document.fonts.load
            ? Promise.all([
              document.fonts.load('600 1em "Cormorant Garamond"'),
              document.fonts.load('1em "Bilbo Swash Caps"'),
            ])
            : Promise.resolve();
        Promise.race([fontsReady, new Promise((r) => setTimeout(r, 1600))]).then(kick);

        return () => {
          started = true;
          cleanups.forEach((fn) => fn());
          obs.kill();
          panels.forEach((p) => p.classList.remove("is-on"));
          root.classList.remove("fp");
          engine.current = null;
        };
      }
    );

    return () => mm.revert();
  }, []);

  const repeat = Array.from({ length: 4 });

  return (
    <div className="ai" ref={rootRef}>
      <style>{CSS}</style>

      <Nav menu={menu} setMenu={setMenu} nav={nav} glass={glass} toGallery={toGallery} />
      <Rule active={active} nav={nav} />

      <main className="stage">
        <Panel id="home" cls="hero">
          <div className="hero-bg">
            <Img src={IMG.hero} alt="" eager tone={1} />
          </div>
          <div className="hero-shade" />
          <div className="hero-grid" />
          <div className="hero-spot" />

          <div className="hero-h-wrap">
            <Hd
              as="h1"
              size="xl"
              className="hero-h"
              lines={["SPACES.", { t: "~STORIES.", c: "l2" }, { t: "SOUL.", c: "l3" }]}
            />
          </div>

          <div className="hero-b">
            <p>
              Asrani Interiors is a design studio creating light-filled, thoughtfully detailed homes
              and workplaces, shaped around how you live.
            </p>
            <a className="lnk" href="#contact" data-cur="Talk" onClick={nav(5)}>
              Get in touch <Arrow />
            </a>
          </div>

          <div className="hero-scroll" aria-hidden="true">
            <span>Scroll</span>
            <i />
          </div>
        </Panel>

        <Panel id="about" cls="ab">
          <div className="ab-l">
            <p className="lbl ab-lbl">About us</p>
            <div className="ab-txt dp" data-depth="0.14">
              <Hd size="l" lines={["~DESIGNED", "FOR LIVING"]} />
              <p className="ab-p">
                At Asrani Interiors, we believe a space should feel as good as it looks. Each
                project begins with how you live and ends with the details you notice every day:
                light, texture, proportion and purpose.
              </p>
              <a className="lnk" href="#portfolio" data-cur="Work" onClick={nav(2)}>
                Learn more <Arrow />
              </a>
            </div>
          </div>
          <div className="ab-r">
            <div className="dp" data-depth="0.6">
              <Img className="ab-i1" src={IMG.about[0]} alt="Bedroom with warm timber and soft light" tone={2} />
            </div>
            <div className="dp" data-depth="0.32">
              <Img className="ab-i2" src={IMG.about[1]} alt="Lounge corner with layered textures" tone={4} />
            </div>
          </div>
        </Panel>

        <Panel id="portfolio" cls="pfp">
          <Portfolio />
        </Panel>

        <Panel id="services" cls="svc">
          <div className="svc-bg dp" data-depth="0.22">
            <Img src={IMG.servicesBg} alt="" tone={0} />
          </div>
          <div className="svc-shade" />
          <div className="svc-txt">
            <p className="lbl">Services</p>
            <Hd size="m" lines={["DESIGN THAT", "~GETS BUILT"]} />
            <p>
              We offer more than design. We shape experiences through clarity, texture, intention,
              and a thoughtful presence on site.
            </p>
            <a className="lnk" href="#contact" data-cur="Talk" onClick={nav(5)}>
              Get in touch <Arrow />
            </a>
          </div>
          <ul className="svc-grid">
            {SERVICES.map((s, k) => (
              <li className={`svc-card c${k + 1}`} key={s.title}>
                <a className="sc" href="#contact" data-cur="Explore" data-free="" onClick={nav(5)}>
                  <span className="sc-no">{pad2(k + 1)}</span>
                  <Img className="sc-img" src={IMG.services[k]} alt="" tone={k + 1} />
                  <div className="sc-bot">
                    <h3 className="sc-t">{s.title}</h3>
                    <div className="sc-more">
                      <div className="sc-more-i">
                        <p>{s.text}</p>
                        <div className="sc-row">
                          <span>{s.price}</span>
                          <Arrow />
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
          <p className="svc-note">Design services crafted for calm, intentional, and meaningful living.</p>
        </Panel>

        <Panel id="journal" cls="jr">
          <header className="jr-head">
            <p className="lbl">Journal</p>
            <Hd size="m" lines={["IDEAS WORTH ~READING"]} />
          </header>
          <div className="jr-grid">
            {JOURNAL.map((j, k) => (
              <article className={`jr-it j${k + 1}`} key={j.title}>
                <a
                  className="jr-a"
                  href="#journal"
                  data-cur="Read"
                  data-free=""
                  onClick={(e) => e.preventDefault()}
                >
                  <div className="jr-pic">
                    <Img src={IMG.journal[k]} alt="" tone={k + 3} />
                    <div className="jr-ov">
                      <h4>{j.title}</h4>
                      <p>{j.text}</p>
                      <span className="lnk lnk-s">
                        Read more <Arrow />
                      </span>
                    </div>
                  </div>
                  <h3 className="jr-t">{j.title}</h3>
                </a>
              </article>
            ))}
          </div>
        </Panel>

        <Panel id="contact" cls="ct">
          <div className="ct-main">
            <div className="ct-l">
              <p className="lbl">Contact us</p>
              <Hd size="m" lines={["LET’S TALK ABOUT", "YOUR ~SPACE"]} />
              <p className="ct-p">
                Tell us about your space, your ideas and your timeline. We’ll guide you through the
                next steps with care and intention.
              </p>
            </div>
            <div className="cf-card">
              <ContactForm />
            </div>
          </div>

          <footer className="ft">
            <div className="ft-top">
              <a className="ft-logo" href="#home" data-cur="Top" onClick={nav(0)}>
                {SITE.name}
              </a>
              <div className="ft-cols">
                <div className="ft-col">
                  <span className="ft-h">Menu</span>
                  <ul>
                    {NAV.map(([label, i]) => (
                      <li key={label}>
                        <a href={`#${IDS[i]}`} onClick={nav(i)}>
                          {label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="ft-col">
                  <span className="ft-h">Follow us</span>
                  <ul>
                    {SITE.socials.map(([label, href]) => (
                      <li key={label}>
                        <a href={href}>{label}</a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="ft-col">
                  <span className="ft-h">Contact</span>
                  <ul>
                    <li>{SITE.address.join(", ")}</li>
                    <li>
                      <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
                    </li>
                    <li>
                      <a href={`tel:${SITE.phone.replace(/\s/g, "")}`}>{SITE.phone}</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="mq" aria-hidden="true">
              <div className="mq-track">
                {[0, 1].map((h) => (
                  <div className="mq-half" key={h}>
                    {repeat.map((_, k) => (
                      <span className="mq-i" key={k}>
                        <span className="mq-t">
                          <span className="sw">S</span>TART A PROJECT
                        </span>
                        <span className="mq-s">✦</span>
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </footer>
        </Panel>
      </main>

      <Cursor rootRef={rootRef} />
    </div>
  );
}

/* ========================================================================== */
/*  STYLES                                                                    */
/* ========================================================================== */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bilbo+Swash+Caps&family=Cormorant+Garamond:wght@500;600;700&family=Instrument+Sans:wght@400;500;600&display=swap');

html{scroll-behavior:smooth}

.ai{
  --bg:#14100d; --bg2:#191310; --card:#221a14; --card2:#2b211a;
  --ink:#f2e9dc; --mute:rgba(242,233,220,.58); --line:rgba(242,233,220,.17); --acc:#d2a679;
  --pad:2.1vw; --nav-h:6.5vh;
  --serif:"Cormorant Garamond","Cormorant",Georgia,"Times New Roman",serif;
  --sans:"Instrument Sans",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  --swash:"Bilbo Swash Caps","Cormorant Garamond",cursive;
  --mono:ui-monospace,"SF Mono","JetBrains Mono",Menlo,Consolas,monospace;
  color:var(--ink);background:var(--bg);font-family:var(--sans);
  font-size:clamp(12.5px,1.05vw,17px);line-height:1.4;
  -webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;
  position:relative;
  -webkit-overflow-scrolling:touch;
  overscroll-behavior-y:none;
}
.ai *,.ai *::before,.ai *::after{box-sizing:border-box}
.ai h1,.ai h2,.ai h3,.ai h4,.ai p,.ai ul,.ai figure{margin:0;padding:0}
.ai ul{list-style:none}
.ai a{color:inherit;text-decoration:none}
.ai button{font:inherit;color:inherit;background:none;border:0;cursor:pointer;padding:0}
.ai img{display:block;max-width:none}
.ai :focus-visible{outline:1px solid var(--acc);outline-offset:4px}

.ai.fp{position:fixed;inset:0;overflow:hidden;overscroll-behavior:none;touch-action:none}
.fp .stage{position:absolute;inset:0}
.fp .panel{position:absolute;inset:0;visibility:hidden;overflow:hidden;backface-visibility:hidden}
.fp .panel.is-on{visibility:visible;will-change:transform}
.fp .pin{position:absolute;inset:0;min-height:0;will-change:transform}
.panel{position:relative;background:var(--bg);overflow:hidden}
.pin{position:relative;min-height:100vh;min-height:100svh;width:100%}
.veil{position:absolute;inset:0;background:#0a0705;opacity:0;pointer-events:none;z-index:60}
.ai.st{scroll-behavior:smooth;-webkit-overflow-scrolling:touch}

.hd{font-family:var(--serif);font-weight:600;text-transform:uppercase;line-height:.96;letter-spacing:-.004em}
.hd-xl{font-size:clamp(40px,7.6vw,150px)}
.hd-l{font-size:clamp(34px,5.6vw,112px)}
.hd-m{font-size:clamp(30px,4.9vw,98px)}
.ln{display:block;overflow:hidden;padding:.22em .22em .12em;margin:-.22em -.22em -.12em}
.ln-i{display:block;will-change:transform}
.sw{font-family:var(--swash);font-weight:400;font-size:1.3em;line-height:0;text-transform:none;margin-right:-.045em;position:relative;top:.035em}
.lbl{font-size:.95em;color:var(--mute);text-transform:uppercase;letter-spacing:.01em}

.lnk{display:inline-flex;align-items:center;justify-content:space-between;gap:2em;min-width:min(17.5vw,320px);
  padding-bottom:.6em;border-bottom:1px solid currentColor;text-transform:uppercase;font-weight:500;
  letter-spacing:.01em;transition:color .45s cubic-bezier(.2,.7,.2,1),border-color .45s,transform .45s cubic-bezier(.2,.7,.2,1);will-change:transform}
.lnk:hover{color:var(--acc);transform:translateX(.25em)}
.arw{width:1.7em;height:.85em;flex:none;transition:transform .55s cubic-bezier(.2,.7,.2,1)}
.lnk:hover .arw{transform:translateX(.45em)}

.im{position:relative;overflow:hidden;
  background:linear-gradient(155deg,hsl(calc(22 + var(--t,0) * 4) 26% calc(24% + var(--t,0) * 1.6%)),hsl(20 30% 10%))}
.im img{width:100%;height:100%;object-fit:cover;transform-origin:50% 50%;will-change:transform}

.nav{position:fixed;left:0;right:0;top:0;height:var(--nav-h);min-height:52px;display:flex;align-items:center;
  padding:0 var(--pad);z-index:200;background:linear-gradient(180deg,rgba(10,7,5,.5),rgba(10,7,5,0));
  -webkit-backdrop-filter:blur(0px);backdrop-filter:blur(0px);
  border-bottom:1px solid transparent;
  transition:background .5s ease,border-color .5s ease,backdrop-filter .5s ease,box-shadow .5s ease;}
.nav.nav-glass{background:rgba(20,16,13,.52);-webkit-backdrop-filter:blur(18px) saturate(150%);backdrop-filter:blur(18px) saturate(150%);
  border-bottom:1px solid rgba(242,233,220,.12);box-shadow:0 8px 32px rgba(0,0,0,.28)}
.brand{font-family:var(--serif);font-weight:700;font-size:1.4em;letter-spacing:.09em;text-transform:uppercase;width:calc(50vw - var(--pad));white-space:nowrap;flex:none}
.nav-l{display:flex;gap:2.65vw;flex:1;text-transform:uppercase;font-weight:500}
.nav-l li{position:relative}
.nav-l a{position:relative;display:inline-block;padding:.15em 0;transition:opacity .35s}
.nav-l a::after{content:"";position:absolute;left:0;right:100%;bottom:-.1em;height:1px;background:var(--acc);transition:right .4s cubic-bezier(.2,.7,.2,1)}
.nav-l:hover a{opacity:.45}
.nav-l a:hover{opacity:1}
.nav-l a:hover::after{right:0}
.nav-c{text-transform:uppercase;font-weight:500;flex:none;transition:color .35s}
.nav-c:hover{color:var(--acc)}
.menu-btn{display:none;flex:none;width:34px;height:34px;place-items:center}
.menu-btn .bg{position:relative;width:22px;height:14px;display:block}
.menu-btn .bg i{position:absolute;left:0;right:0;height:1.5px;background:var(--ink);transition:transform .4s cubic-bezier(.2,.7,.2,1),top .4s cubic-bezier(.2,.7,.2,1),opacity .3s}
.menu-btn .bg i:first-child{top:0}
.menu-btn .bg i:last-child{top:100%;transform:translateY(-100%)}
.menu-btn .bg.open i:first-child{top:50%;transform:translateY(-50%) rotate(45deg)}
.menu-btn .bg.open i:last-child{top:50%;transform:translateY(-50%) rotate(-45deg)}

.rule{position:fixed;right:.8vw;top:50%;transform:translateY(-50%);z-index:150;display:none;flex-direction:column;align-items:flex-end}
.fp .rule{display:flex}
.rl{position:relative;display:flex;flex-direction:column;align-items:flex-end;padding:0 0 0 1.2vw}
.rl-t{display:block;height:1px;width:12px;background:rgba(242,233,220,.5);transition:width .5s cubic-bezier(.2,.7,.2,1),background .4s}
.rl-m{display:block;width:6px;height:34px;margin-top:0;
  background:repeating-linear-gradient(180deg,rgba(242,233,220,.3) 0 1px,transparent 1px 8.5px)}
.rl:last-child .rl-m{display:none}
.rl-n{position:absolute;right:calc(100% - .2vw);top:-.62em;font-family:var(--mono);font-size:.72em;letter-spacing:.08em;color:var(--acc);
  opacity:0;transform:translateX(6px);transition:opacity .35s,transform .5s cubic-bezier(.2,.7,.2,1);pointer-events:none;white-space:nowrap}
.rl.on .rl-t{width:28px;background:var(--acc)}
.rl.on .rl-n{opacity:1;transform:none}
.rl:hover .rl-t{width:22px;background:var(--ink)}
.rl:hover .rl-n{opacity:1;transform:none}
.rule:not(:hover) .rl:not(.on) .rl-n{opacity:0}

.hero{background:#0d0907}
.hero-bg{position:absolute;inset:-3%;z-index:1;will-change:transform}
.hero-bg .im{position:absolute;inset:0}
.hero-shade{position:absolute;inset:0;z-index:2;
  background:linear-gradient(180deg,rgba(12,8,6,.62) 0%,rgba(12,8,6,.3) 38%,rgba(12,8,6,.68) 100%),rgba(22,14,9,.3)}
.hero-grid{position:absolute;inset:0;z-index:3;pointer-events:none;
  background-image:linear-gradient(rgba(242,233,220,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(242,233,220,.05) 1px,transparent 1px);
  background-size:8vw 8vw;background-position:center center;
  -webkit-mask-image:linear-gradient(180deg,transparent 0,#000 22%,#000 70%,transparent 100%);
  mask-image:linear-gradient(180deg,transparent 0,#000 22%,#000 70%,transparent 100%)}
.hero-spot{position:absolute;left:0;top:0;width:46vw;height:46vw;margin:-23vw 0 0 -23vw;z-index:4;pointer-events:none;will-change:transform;
  transform:translate(62vw,72vh);
  background:radial-gradient(circle,rgba(255,214,160,.26),rgba(255,214,160,.09) 42%,rgba(255,214,160,0) 68%)}
.hero-h-wrap{position:absolute;z-index:5;left:11vw;right:var(--pad);top:26vh;max-width:82vw}
.hero-h .l2{margin-left:clamp(0px,32vw,600px)}
.hero-h .l3{margin-left:clamp(0px,37vw,690px)}
.hero-b{position:absolute;z-index:5;left:50vw;top:69.5vh;width:min(22vw,420px)}
.hero-b p{line-height:1.4;font-size:1.02em}
.hero-b .lnk{margin-top:6.4vh;min-width:min(17vw,300px)}
.hero-scroll{position:absolute;z-index:5;left:var(--pad);bottom:4.4vh;display:none;align-items:center;gap:1.1em;color:var(--mute);
  text-transform:uppercase;font-size:.85em;letter-spacing:.06em}
.fp .hero-scroll{display:flex}
.hero-scroll i{display:block;width:1px;height:5.4vh;background:rgba(242,233,220,.22);position:relative;overflow:hidden}
.hero-scroll i::after{content:"";position:absolute;left:0;top:0;width:100%;height:45%;background:var(--acc);animation:scrollcue 2.2s cubic-bezier(.6,0,.3,1) infinite}
@keyframes scrollcue{0%{transform:translateY(-110%)}70%,100%{transform:translateY(240%)}}

.ab{background:var(--bg2)}
.ab-l{position:absolute;left:var(--pad);top:0;bottom:0;width:46vw}
.ab-lbl{position:absolute;top:16vh;left:0}
.ab-txt{position:absolute;left:0;bottom:19vh;width:100%}
.ab-p{max-width:min(35vw,560px);margin:3.6vh 0 5.6vh;color:var(--mute);line-height:1.5}
.ab-r{position:absolute;left:50vw;right:var(--pad);top:14.5vh;display:grid;grid-template-columns:1.55fr 1fr;gap:2vw;align-items:start}
.ab-i1{height:65vh}
.ab-i2{height:32vh}

.pf{position:absolute;inset:0;touch-action:pan-y}
.pf-head{position:absolute;top:9vh;left:0;right:0;text-align:center}
.pf-head .lbl{margin-bottom:.6vh}
.pf-body{position:absolute;left:var(--pad);right:var(--pad);top:26vh;height:69vh;display:grid;grid-template-columns:45.5% 1fr;gap:2.1vw}
.pf-l .im{height:64vh;width:100%}
.pf-r{display:grid;grid-template-rows:auto 1fr auto;min-height:0}
.pf-meta{display:flex;justify-content:space-between;color:var(--mute);padding-top:.7vh}
.pf-mid{display:grid;grid-template-columns:1fr minmax(15vw,20vw);gap:2vw;align-items:start;padding-top:5.5vh}
.pf-copy{padding-top:1.4vh;min-width:0}
.pf-title{font-family:var(--serif);font-weight:600;text-transform:uppercase;font-size:clamp(22px,2.4vw,46px);line-height:1;letter-spacing:.005em}
.pf-desc{margin-top:3.2vh;max-width:100%;color:var(--mute);line-height:1.5}
.pf-acc{height:30vh;width:100%}
.pf-cap{margin-top:1.6vh;color:var(--mute);font-size:.9em;line-height:1.4}
.pf-foot{display:flex;justify-content:space-between;align-items:flex-end;gap:2vw}
.pf-brief{max-width:min(14vw,260px);color:var(--mute);font-size:.9em;line-height:1.4}
.pf-ctl{display:flex;gap:.9vw;flex:none}
.rb{width:4.1vw;height:4.1vw;min-width:44px;min-height:44px;max-width:58px;max-height:58px;border-radius:50%;border:1px solid var(--line);display:grid;place-items:center;
  transition:background .45s cubic-bezier(.2,.7,.2,1),color .45s,border-color .45s,transform .35s cubic-bezier(.2,.7,.2,1)}
.rb .arw{width:1.5em}
.rb-a{display:grid;place-items:center}
.rb-flip{transform:scaleX(-1)}
.rb:hover{background:var(--ink);color:var(--bg);border-color:var(--ink);transform:scale(1.06)}
.rb-on{background:var(--acc);color:#1a120c;border-color:var(--acc)}
.rb-on:hover{background:var(--ink);border-color:var(--ink)}
.rb:hover .arw{transform:none}

.svc{background:#0d0907}
.svc-bg{position:absolute;inset:-6% 0;z-index:1}
.svc-bg .im{position:absolute;inset:0}
.svc-shade{position:absolute;inset:0;z-index:2;background:linear-gradient(90deg,rgba(12,8,6,.9),rgba(12,8,6,.62) 55%,rgba(12,8,6,.76))}
.svc-txt{position:absolute;z-index:6;left:var(--pad);top:9.5vh;width:min(42vw,640px)}
.svc-txt .hd{margin-top:1.4vh}
.svc-txt p:not(.lbl){margin-top:5.2vh;max-width:min(22vw,420px);color:rgba(242,233,220,.86);line-height:1.5}
.svc-txt .lnk{margin-top:7.4vh;min-width:min(17vw,300px)}
.svc-grid{position:absolute;inset:0;z-index:5;display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:1fr 1fr;gap:3.45vh 0;padding:9vh 0 3vh}
.svc-card{position:relative;margin-right:2.07vw;background:var(--card);border:1px solid rgba(242,233,220,.1);min-height:0;transition:background .4s,transform .4s cubic-bezier(.2,.7,.2,1),box-shadow .4s}
.c1{grid-column:3;grid-row:1}.c2{grid-column:4;grid-row:1}.c3{grid-column:2;grid-row:2}.c4{grid-column:3;grid-row:2}
.sc{position:absolute;inset:0;display:block;overflow:hidden}
.sc-no{position:absolute;left:1.65vw;top:3.1vh;color:var(--mute)}
.sc-img{position:absolute;top:2.9vh;right:1.65vw;width:56%;height:62%;transform-origin:100% 0;transition:transform .8s cubic-bezier(.2,.7,.2,1)}
.sc-bot{position:absolute;left:1.65vw;right:1.65vw;bottom:2.9vh}
.sc-t{font-family:var(--serif);font-weight:600;text-transform:uppercase;font-size:clamp(20px,1.95vw,38px);line-height:1;letter-spacing:.005em}
.sc-more{display:grid;grid-template-rows:0fr;opacity:0;transition:grid-template-rows .6s cubic-bezier(.2,.7,.2,1),opacity .5s}
.sc-more-i{overflow:hidden;min-height:0}
.sc-more p{margin-top:2.4vh;color:var(--mute);line-height:1.5;font-size:.98em}
.sc-row{display:flex;justify-content:space-between;align-items:center;margin-top:1.6vh;color:var(--mute);font-size:.86em}
.sc-row .arw{color:var(--ink);width:1.6em}
.sc:hover .sc-img{transform:scale(.72)}
.sc:hover .sc-more{grid-template-rows:1fr;opacity:1}
.svc-card:hover{background:var(--card2);transform:translateY(-4px);box-shadow:0 18px 40px rgba(0,0,0,.32)}
.svc-note{position:absolute;z-index:6;right:var(--pad);bottom:3.4vh;max-width:min(17vw,320px);text-align:right;line-height:1.4}

.jr{background:var(--bg2)}
.jr-head{position:absolute;top:10vh;left:0;right:0;text-align:center}
.jr-head .lbl{margin-bottom:.6vh}
.jr-grid{position:absolute;left:var(--pad);right:var(--pad);top:29vh;display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:2.1vw;align-items:start}
.jr-a{display:block}
.jr-pic{position:relative;height:37vh;transition:transform .5s cubic-bezier(.2,.7,.2,1)}
.jr-pic > .im{position:absolute;inset:0}
.j1 .jr-pic{height:60vh}
.j3{margin-top:22vh}
.jr-t{margin-top:1.2vh;font-family:var(--serif);font-weight:600;text-transform:uppercase;font-size:clamp(18px,1.75vw,34px);line-height:1.05;transition:opacity .4s}
.jr-ov{position:absolute;inset:1.6vw;background:rgba(27,20,15,.94);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:1.6vw;
  opacity:0;transform:scale(.97);transition:opacity .5s,transform .7s cubic-bezier(.2,.7,.2,1);pointer-events:none}
.jr-ov h4{font-family:var(--serif);font-weight:600;text-transform:uppercase;font-size:clamp(20px,2vw,40px);line-height:1.05}
.jr-ov p{margin-top:2.4vh;color:var(--mute);max-width:22ch;line-height:1.5}
.jr-ov .lnk-s{margin-top:3.6vh;min-width:0;border:0;padding:0;gap:.9em}
.j1 .jr-ov p{max-width:26ch}
.jr-a:hover .jr-pic{transform:translateY(-4px)}
.jr-a:hover .jr-ov{opacity:1;transform:none}
.j1 .jr-a:hover .jr-t{opacity:0}

.ct .pin{display:flex;flex-direction:column}
.ct-main{flex:1;min-height:0;padding:calc(var(--nav-h) + 6vh) var(--pad) 2vh;display:grid;grid-template-columns:1fr 1fr;gap:3vw;align-content:start}
.ct-l .hd{margin-top:1.2vh}
.ct-p{margin-top:4.2vh;max-width:min(24vw,460px);color:var(--mute);line-height:1.5}
.cf-card{background:rgba(242,233,220,.045);border:1px solid rgba(242,233,220,.1);border-radius:14px;padding:2.6vw}
.cf{position:relative}
.fld{display:block;position:relative}
.fld input,.fld textarea{width:100%;display:block;background:transparent;border:0;color:var(--ink);font:inherit;padding:.85em .15em;outline:none;transition:color .3s}
.fld input::placeholder,.fld textarea::placeholder{color:var(--mute);transition:color .3s}
.fld:focus-within input::placeholder,.fld:focus-within textarea::placeholder{color:rgba(242,233,220,.32)}
.fld-line{position:absolute;left:0;right:0;bottom:0;height:1px;background:rgba(242,233,220,.42);transform-origin:left center;transition:background .3s,box-shadow .3s}
.fld:focus-within .fld-line{background:var(--acc);box-shadow:0 1px 8px rgba(210,166,121,.4)}
.cf-2{display:grid;grid-template-columns:1fr 1fr;gap:1.6vw;margin-top:1.4vh}
.cf > .fld:first-child{margin-top:0}
.fld-ta{margin-top:2.6vh}
.fld-ta textarea{border:1px solid rgba(242,233,220,.42);padding:.9em .85em;resize:none;min-height:9vh;border-radius:6px;transition:border-color .3s}
.fld-ta textarea:focus{border-color:var(--acc)}
.cf-send{margin-top:4.6vh;min-width:min(17.5vw,320px)}
.cf-ok{margin-top:1.4vh;color:var(--acc);min-height:1.4em;opacity:0;transform:translateY(6px);transition:opacity .5s ease,transform .5s cubic-bezier(.2,.7,.2,1)}
.cf-ok.show{opacity:1;transform:none}

.ft{background:#1b1511;padding:0;min-height:38vh;display:flex;flex-direction:column;justify-content:space-between;overflow:hidden}
.ft-top{display:flex;flex-wrap:wrap;justify-content:space-between;gap:4vh;padding:4.4vh var(--pad) 0}
.ft-logo{font-family:var(--serif);font-weight:700;letter-spacing:.09em;text-transform:uppercase;font-size:1.3em;white-space:nowrap;transition:color .35s}
.ft-logo:hover{color:var(--acc)}
.ft-cols{display:grid;grid-template-columns:repeat(3,auto);column-gap:4.2vw}
.ft-col{display:grid;grid-template-columns:auto 1fr;column-gap:2.6vw;align-items:start;font-weight:500;text-transform:uppercase;font-size:.92em;line-height:1.6}
.ft-h{color:var(--mute);font-weight:400}
.ft-col ul{display:grid;gap:.8em;max-width:min(14vw,220px)}
.ft-col a{transition:color .35s}
.ft-col a:hover{color:var(--acc)}
.mq{overflow:hidden;white-space:nowrap;padding-bottom:2vh}
.mq-track{display:flex;width:max-content;will-change:transform}
.mq-half{display:flex;flex:none}
.mq-i{display:inline-flex;align-items:center;flex:none}
.mq-t{font-family:var(--serif);font-weight:600;text-transform:uppercase;font-size:clamp(40px,6.4vw,124px);line-height:1;color:#43362b}
.mq-t .sw{color:#43362b}
.mq-s{font-size:1.6vw;color:#43362b;margin:0 2.6vw}

.ai.has-cur,.ai.has-cur *{cursor:none!important}
.cur{position:fixed;inset:0;pointer-events:none;z-index:9999;opacity:0;transition:opacity .35s ease}
.cur.on{opacity:1}
.cur > *{position:absolute;left:0;top:0;pointer-events:none;will-change:transform}
.cur-h{width:100vw;height:1px;
  background:repeating-linear-gradient(90deg,rgba(210,166,121,.34) 0 5px,transparent 5px 11px);transition:opacity .35s}
.cur-v{width:1px;height:100vh;
  background:repeating-linear-gradient(180deg,rgba(210,166,121,.34) 0 5px,transparent 5px 11px);transition:opacity .35s}
.cur.is-link .cur-h,.cur.is-link .cur-v,.cur.is-text .cur-h,.cur.is-text .cur-v{opacity:0}
.cur-ring{width:0;height:0}
.cur-box{position:absolute;left:0;top:0;width:var(--w,30px);height:var(--h,30px);
  transform:translate(-50%,-50%) scale(var(--k,1));
  transition:width .5s cubic-bezier(.2,.7,.2,1),height .5s cubic-bezier(.2,.7,.2,1),transform .35s cubic-bezier(.2,.7,.2,1)}
.cur.is-down .cur-box{--k:.82}
.cur-box::before{content:"";position:absolute;inset:0;border:1px solid rgba(242,233,220,.72);border-radius:50%;
  transition:opacity .35s,border-radius .5s,background .3s}
.cur-box b{position:absolute;width:10px;height:10px;border:1px solid var(--acc);opacity:0;transition:opacity .35s}
.cur-box b:nth-of-type(1){left:0;top:0;border-right:0;border-bottom:0}
.cur-box b:nth-of-type(2){right:0;top:0;border-left:0;border-bottom:0}
.cur-box b:nth-of-type(3){left:0;bottom:0;border-right:0;border-top:0}
.cur-box b:nth-of-type(4){right:0;bottom:0;border-left:0;border-top:0}
.cur-box i{position:absolute;background:rgba(242,233,220,.72);transition:opacity .3s}
.cur-box i:nth-of-type(1){left:50%;top:-9px;width:1px;height:6px}
.cur-box i:nth-of-type(2){left:50%;bottom:-9px;width:1px;height:6px}
.cur-box i:nth-of-type(3){top:50%;left:-9px;width:6px;height:1px}
.cur-box i:nth-of-type(4){top:50%;right:-9px;width:6px;height:1px}
.cur.is-link .cur-box::before,.cur.is-link .cur-box i{opacity:0}
.cur.is-link .cur-box b{opacity:1}
.cur.is-text .cur-box i,.cur.is-text .cur-box b{opacity:0}
.cur.is-text .cur-box::before{border:0;border-radius:1px;background:var(--acc)}
.cur-dot{width:0;height:0}
.cur-dot::before{content:"";position:absolute;left:-2.5px;top:-2.5px;width:5px;height:5px;border-radius:50%;background:var(--acc);
  transition:transform .35s cubic-bezier(.2,.7,.2,1),opacity .3s}
.cur.is-link .cur-dot::before{transform:scale(1.5)}
.cur.is-text .cur-dot::before{opacity:0}
.cur-pulse{width:0;height:0}
.cur-pulse::before{content:"";position:absolute;left:-20px;top:-20px;width:40px;height:40px;border-radius:50%;border:1px solid var(--acc)}
.cur-lbl{width:0;height:0}
.cur-txt{position:absolute;left:24px;top:20px;white-space:nowrap;font-family:var(--mono);font-size:10px;line-height:1.55;
  letter-spacing:.1em;text-transform:uppercase;text-shadow:0 0 8px rgba(10,7,5,.8)}
.cur-act{display:block;color:var(--acc);font-weight:600}
.cur-act:empty{display:none}
.cur-xy{display:block;color:rgba(242,233,220,.62);transition:opacity .3s}
.cur.is-link .cur-xy,.cur.is-text .cur-xy{opacity:0}

.mnav{position:fixed;inset:0;z-index:190;background:rgba(14,10,8,.86);-webkit-backdrop-filter:blur(22px) saturate(140%);backdrop-filter:blur(22px) saturate(140%);
  display:none;align-items:center;justify-content:center;opacity:0;visibility:hidden;transform:translateY(-8px);
  transition:opacity .45s cubic-bezier(.2,.7,.2,1),visibility .45s,transform .45s cubic-bezier(.2,.7,.2,1)}
.mnav.open{opacity:1;visibility:visible;transform:none}
.mnav ul{display:grid;gap:2.4vh;text-align:center}
.mnav a{font-family:var(--serif);font-weight:600;text-transform:uppercase;font-size:11vw;line-height:1.1;transition:color .3s}
.mnav a:hover{color:var(--acc)}

@media (max-width:900px){
  .ai{font-size:15px;--pad:5.6vw;--nav-h:60px}
  .hd-xl{font-size:16vw}.hd-l{font-size:12vw}.hd-m{font-size:10vw}
  .lnk{min-width:min(60vw,340px)}
  .mnav{display:flex}
  .menu-btn{display:grid}
  .nav{background:rgba(20,16,13,.4);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);border-bottom:1px solid rgba(242,233,220,.08)}
  .brand{width:auto;flex:1;font-size:1.2em}
  .nav-l,.nav-c{display:none}

  .hero .pin{min-height:100svh}
  .hero-spot{display:none}
  .hero-grid{background-size:16vw 16vw}
  .hero-h-wrap{left:var(--pad);right:var(--pad);top:22svh;max-width:none}
  .hero-h .l2{margin-left:clamp(0px,9vw,80px)}
  .hero-h .l3{margin-left:clamp(0px,18vw,150px)}
  .hero-b{left:var(--pad);right:var(--pad);top:auto;bottom:9svh;width:auto}
  .hero-b p{max-width:34ch}
  .hero-b .lnk{margin-top:4svh;min-width:min(60vw,340px)}

  .ab .pin{padding:calc(var(--nav-h) + 6vh) var(--pad) 9vh;display:flex;flex-direction:column;gap:6vh}
  .ab-l,.ab-r{position:static;width:auto}
  .ab-lbl,.ab-txt{position:static}
  .ab-lbl{margin-bottom:5vh}
  .ab-p{max-width:none;margin:3vh 0 4vh}
  .ab-r{grid-template-columns:1.5fr 1fr;gap:4vw}
  .ab-i1{height:42vh}.ab-i2{height:22vh}

  .pfp .pin{padding-bottom:8vh}
  .pf{position:relative;inset:auto;padding:calc(var(--nav-h) + 4vh) 0 0}
  .pf-head{position:static;padding:0 var(--pad);margin-bottom:5vh}
  .pf-body{position:static;height:auto;display:block;padding:0 var(--pad)}
  .pf-l .im{height:50vh}
  .pf-r{display:block;margin-top:2.4vh}
  .pf-meta{margin-bottom:1.6vh}
  .pf-mid{grid-template-columns:1fr;gap:3vh;padding-top:1.2vh}
  .pf-desc{max-width:none;margin-top:1.6vh}
  .pf-acc{height:22vh}
  .pf-accw{max-width:60vw}
  .pf-foot{margin-top:3vh;gap:4vw;flex-wrap:wrap}
  .pf-brief{max-width:none}
  .rb{width:50px;height:50px}

  .svc .pin{padding:calc(var(--nav-h) + 4vh) var(--pad) 8vh;display:flex;flex-direction:column;gap:5vh}
  .svc-txt,.svc-grid,.svc-note{position:static;width:auto}
  .svc-txt p:not(.lbl){max-width:none;margin-top:3vh}
  .svc-txt .lnk{margin-top:4vh}
  .svc-grid{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:none;gap:3vw;padding:0;z-index:5}
  .svc-card{margin:0;min-height:56vw}
  .c1,.c2,.c3,.c4{grid-column:auto;grid-row:auto}
  .sc{position:absolute}
  .sc-no{left:3.4vw;top:2vh}
  .sc-img{right:3.4vw;top:2vh;width:60%;height:48%}
  .sc-bot{left:3.4vw;right:3.4vw;bottom:2vh}
  .sc-t{font-size:5vw}
  .sc-more{display:none}
  .svc-note{text-align:left;max-width:none}

  .jr .pin{padding:calc(var(--nav-h) + 4vh) var(--pad) 9vh}
  .jr-head{position:static;text-align:left;margin-bottom:5vh}
  .jr-grid{position:static;grid-template-columns:1fr 1fr;gap:6vh 4vw}
  .jr-pic,.j1 .jr-pic{height:30vh}
  .j1{grid-column:1 / -1}.j1 .jr-pic{height:42vh}
  .j3{margin-top:0}
  .jr-t{font-size:5.4vw}
  .jr-ov{display:none}

  .ct .pin{display:block}
  .ct-main{grid-template-columns:1fr;gap:5vh;padding:calc(var(--nav-h) + 6vh) var(--pad) 8vh}
  .ct-p{max-width:none}
  .cf-card{padding:6vw}
  .cf-2{grid-template-columns:1fr;gap:0}
  .cf-2 .fld{margin-top:1.4vh}
  .cf-send{min-width:min(60vw,340px)}
  .ft{min-height:auto;padding-bottom:1vh}
  .ft-top{flex-direction:column;gap:5vh;padding:6vh var(--pad) 5vh}
  .ft-cols{grid-template-columns:1fr;row-gap:4vh}
  .ft-col{grid-template-columns:28vw 1fr}
  .ft-col ul{max-width:none}
  .mq-t{font-size:14vw}.mq-s{font-size:5vw;margin:0 6vw}
}

@media (hover:none){
  .sc-more{grid-template-rows:1fr;opacity:1}
  .sc:hover .sc-img{transform:none}
}

@media (prefers-reduced-motion:reduce){
  .ai *,.ai *::before,.ai *::after{transition-duration:.01ms!important;animation:none!important}
}
`;