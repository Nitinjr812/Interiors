"use client";

/**
 * ASRANI INTERIORS — gallery page (dark theme) · v1
 * --------------------------------------------------------------------------
 * Same design system as landingpage.jsx (fonts, colours, cursor, GSAP motion).
 *
 * Install :  npm i gsap            (Flip + ScrollTrigger ship inside gsap)
 * Use     :  app/gallery/page.jsx  ->  import GalleryPage from "./gallerypage";
 *                                       export default () => <GalleryPage />;
 *
 * What it does
 *  - Hero with the same grid / spotlight / line-rise intro as the home page
 *  - Mosaic gallery: tiles wipe in on scroll
 *  - Hover  : 3D tilt following the mouse, image zoom + parallax, warm glare,
 *             drafting-style corner brackets, caption slides up
 *  - Click  : the photo flies out of the grid into a full-screen viewer
 *             (arrow keys, swipe, prev / next, Esc or swipe-down to close);
 *             on close it flies back to its exact tile
 *  - Filter : chips re-flow the mosaic with GSAP Flip
 * -------------------------------------------------------------------------- */

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(Flip, ScrollTrigger);

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;
const reduce = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

/* Links back to the landing page. Change "/" and "/gallery" to your routes. */
const NAV = [
  ["About us", "/#about"],
  ["Portfolio", "/#portfolio"],
  ["Gallery", "#top", true],
  ["Services", "/#services"],
  ["Journal", "/#journal"],
];
const CONTACT = "/#contact";

/* Unsplash placeholders. Replace with your own project photos:
 *   - put files in /public/gallery/ and set  src: "/gallery/amber-1.jpg"
 *   - or keep using Unsplash by editing the ids below.
 * Any photo that fails to load is dropped from the gallery automatically. */
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
  "1600210492493-0946911123ea",
  "1600607687644-c7171b42498f",
  "1600566753376-12c8ab7fb75b",
  "1600607688969-a5bfcd646154",
  "1600585154526-990dced4db0d",
  "1600573472550-8090b5e0745e",
];
const ph = (i, w = 1200) =>
  `https://images.unsplash.com/photo-${PH[i % PH.length]}?auto=format&fit=crop&w=${w}&q=80`;

const HERO = ph(2, 2200);

/* p = index into PH. Titles / places / categories are placeholders: match them
 * to the real photo you put in each slot. */
const WORKS = [
  { p: 0, title: "Amber House", place: "Ahmedabad", year: 2024, cat: "Living", desc: "Warm timber and lime plaster give a family home its slow, sunlit rhythm." },
  { p: 1, title: "Quiet Study", place: "Mumbai", year: 2024, cat: "Living", desc: "Neutral tones and honest materials shape a focused, reflective room." },
  { p: 2, title: "Salt & Stone", place: "Goa", year: 2023, cat: "Living", desc: "Textured walls and open sightlines let a coastal home breathe with the light." },
  { p: 3, title: "Golden Hour", place: "Udaipur", year: 2024, cat: "Living", desc: "A living room arranged to catch the last hour of daylight." },
  { p: 8, title: "The Long Table", place: "Delhi", year: 2023, cat: "Kitchen & Dining", desc: "A dining room built around one generous table and the conversations it holds." },
  { p: 5, title: "Hush", place: "Bengaluru", year: 2023, cat: "Bedroom", desc: "A bedroom designed for slow mornings, soft light and deep rest." },
  { p: 6, title: "North Light", place: "Hyderabad", year: 2022, cat: "Bedroom", desc: "A bright bedroom where every corner follows the day’s best light." },
  { p: 7, title: "Reading Corner", place: "Chennai", year: 2023, cat: "Living", desc: "One good chair, one good lamp, and a corner that asks you to stay." },
  { p: 4, title: "Cast Iron", place: "Kolkata", year: 2024, cat: "Kitchen & Dining", desc: "A kitchen in dark, honest materials, made for daily cooking." },
  { p: 9, title: "Sunday Table", place: "Chandigarh", year: 2022, cat: "Kitchen & Dining", desc: "An easy dining nook for long breakfasts and slow weekends." },
  { p: 10, title: "Slow Mornings", place: "Kochi", year: 2024, cat: "Bedroom", desc: "Layered linen and low light for a bedroom that lets you sleep in." },
  { p: 11, title: "Courtyard", place: "Pune", year: 2022, cat: "Outdoor", desc: "An inner courtyard brings green, air and daylight into the centre of the home." },
  { p: 12, title: "Linen & Oak", place: "Surat", year: 2024, cat: "Living", desc: "Soft textiles against pale oak in a calm, open living room." },
  { p: 13, title: "Open Plan", place: "Gurugram", year: 2023, cat: "Kitchen & Dining", desc: "Kitchen, dining and lounge shaped as one connected, sociable space." },
  { p: 14, title: "Stone Counter", place: "Indore", year: 2023, cat: "Kitchen & Dining", desc: "A kitchen anchored by a single slab of stone and simple joinery." },
  { p: 15, title: "Afternoon Room", place: "Lucknow", year: 2022, cat: "Living", desc: "A sitting room made for tea, company and unhurried conversation." },
  { p: 16, title: "The Veranda", place: "Alibaug", year: 2023, cat: "Outdoor", desc: "A shaded veranda that extends the living space into the garden." },
  { p: 17, title: "Garden Wing", place: "Mysuru", year: 2022, cat: "Outdoor", desc: "A quiet wing opening onto planting, water and open sky." },
].map((w, id) => ({ ...w, id }));

const CATS = ["All", "Living", "Bedroom", "Kitchen & Dining", "Outdoor"];

/* Tile shapes repeat in this order, so any filtered list still packs neatly
 * into the 4-column grid (big = 2x2, tall = 1x2, wide = 2x1, sq = 1x1). */
const SEQ = [
  "big", "tall", "tall",
  "wide", "sq", "sq",
  "tall", "big", "tall",
  "sq", "sq", "sq", "sq",
  "tall", "wide", "tall", "sq", "sq",
];

const hi = (w) => ph(w.p, 1800);
const lo = (w) => ph(w.p, 1000);

/* ========================================================================== */
/*  ANIMATION BUILDING BLOCKS                                                 */
/* ========================================================================== */

const has = (t) => t && t.length > 0;

const rise = (tl, t, at = 0, stagger = 0.12, dur = 1.15) =>
  has(t) &&
  tl.fromTo(t, { yPercent: 118 }, { yPercent: 0, duration: dur, ease: "power4.out", stagger }, at);

const fade = (tl, t, at = 0, dur = 0.9, y = 20, stagger = 0.08) =>
  has(t) &&
  tl.fromTo(
    t,
    { autoAlpha: 0, y },
    { autoAlpha: 1, y: 0, duration: dur, ease: "power3.out", stagger },
    at
  );

const pad2 = (n) => String(n).padStart(2, "0");
const pad4 = (n) => String(Math.max(0, Math.round(n))).padStart(4, "0");

const rectOf = (el) => {
  const r = el.getBoundingClientRect();
  return { left: r.left, top: r.top, width: r.width, height: r.height };
};
const inView = (r) =>
  r.top + r.height > 0 && r.top < window.innerHeight && r.left + r.width > 0 && r.left < window.innerWidth;

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

/* ========================================================================== */
/*  CONSTRUCTION / DRAFTING CURSOR  (same as landing page)                    */
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
/*  NAVBAR                                                                    */
/* ========================================================================== */

const Nav = ({ menu, setMenu, glass }) => (
  <>
    <nav className={`nav ${glass ? "nav-glass" : ""}`} aria-label="Primary">
      <a className="brand" href="/" data-cur="Home">
        {SITE.name}
      </a>
      <ul className="nav-l">
        {NAV.map(([label, href, current]) => (
          <li key={label}>
            <a href={href} data-cur={current ? "Top" : "Go"} aria-current={current ? "page" : undefined}>
              {label}
            </a>
          </li>
        ))}
      </ul>
      <a className="nav-c" href={CONTACT} data-cur="Talk">
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
        <li>
          <a href="/" onClick={() => setMenu(false)}>
            Home
          </a>
        </li>
        {NAV.map(([label, href]) => (
          <li key={label}>
            <a href={href} onClick={() => setMenu(false)}>
              {label}
            </a>
          </li>
        ))}
        <li>
          <a href={CONTACT} onClick={() => setMenu(false)}>
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

export default function GalleryPage() {
  const rootRef = useRef(null);
  const gridRef = useRef(null);
  const progRef = useRef(null);
  const flipRef = useRef(null);

  const lbRef = useRef(null);
  const figRef = useRef(null);
  const l0 = useRef(null);
  const l1 = useRef(null);
  const ghostsRef = useRef(null);
  const closeRef = useRef(null);
  const top = useRef(0);
  const busy = useRef(false);
  const meta = useRef({ tile: null, r: null, first: false });
  const api = useRef({});

  const [menu, setMenu] = useState(false);
  const [glass, setGlass] = useState(false);
  const [filter, setFilter] = useState("All");
  const [bad, setBad] = useState(() => new Set());
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  const live = useMemo(() => WORKS.filter((w) => !bad.has(w.id)), [bad]);
  const shown = useMemo(
    () => live.filter((w) => filter === "All" || w.cat === filter),
    [live, filter]
  );
  const pos = useMemo(() => new Map(shown.map((w, i) => [w.id, i])), [shown]);
  const counts = useMemo(() => {
    const c = { All: live.length };
    live.forEach((w) => {
      c[w.cat] = (c[w.cat] || 0) + 1;
    });
    return c;
  }, [live]);

  const curK = Math.min(idx, Math.max(shown.length - 1, 0));
  const cur = shown[curK] || live[0] || WORKS[0];

  const onBad = (id) =>
    setBad((s) => {
      if (s.has(id)) return s;
      const n = new Set(s);
      n.add(id);
      return n;
    });

  const tileOf = (w) =>
    gridRef.current ? gridRef.current.querySelector(`.tile[data-id="${w.id}"]`) : null;

  /* ---------------------------------------------------------------- filter */
  const setCat = (c) => {
    if (c === filter || busy.current) return;
    const grid = gridRef.current;
    flipRef.current = {
      state: Flip.getState(grid.querySelectorAll(".tile")),
      h: grid.offsetHeight,
    };
    setFilter(c);
  };

  useIso(() => {
    const st = flipRef.current;
    if (!st) return;
    flipRef.current = null;
    if (reduce()) return;

    const grid = gridRef.current;
    grid.style.minHeight = "";
    const newH = grid.offsetHeight;
    grid.style.minHeight = st.h + "px";
    gsap.to(grid, {
      minHeight: newH,
      duration: 0.9,
      ease: "power3.inOut",
      onComplete: () => {
        grid.style.minHeight = "";
        ScrollTrigger.refresh();
      },
    });

    Flip.from(st.state, {
      duration: 0.9,
      ease: "power3.inOut",
      absolute: true,
      stagger: 0.03,
      onEnter: (els) => {
        els.forEach((t) => {
          t.dataset.rv = "1";
          const mask = t.querySelector(".tile-mask");
          const img = t.querySelector(".tile-mask img");
          gsap.killTweensOf([mask, img]);
          gsap.set(mask, { clipPath: "inset(0% 0% 0% 0%)" });
          gsap.set(img, { scale: 1 });
        });
        return gsap.fromTo(
          els,
          { autoAlpha: 0, scale: 0.7 },
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.8,
            delay: 0.25,
            ease: "power3.out",
            stagger: 0.05,
            clearProps: "scale,opacity,visibility",
          }
        );
      },
      onLeave: (els) =>
        gsap.to(els, { autoAlpha: 0, scale: 0.7, duration: 0.45, ease: "power2.in", stagger: 0.02 }),
    });
  }, [filter]);

  /* ------------------------------------------------------------ page motion */
  useIso(() => {
    const root = rootRef.current;
    const calm = reduce();
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const q = gsap.utils.selector(root);
    const cleanups = [];

    /* nav glass + progress line */
    const onScroll = () => {
      const y = window.scrollY;
      setGlass(y > 60);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progRef.current)
        progRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    cleanups.push(() => window.removeEventListener("scroll", onScroll));

    const ctx = gsap.context(() => {
      if (!calm) {
        /* marquee */
        const track = q(".mq-track")[0];
        if (track) gsap.to(track, { xPercent: -50, duration: 38, ease: "none", repeat: -1 });

        /* hero intro */
        const tl = gsap.timeline({ paused: true });
        const bgImg = q(".gh-bg .im img");
        has(bgImg) &&
          tl.fromTo(bgImg, { scale: 1.3 }, { scale: 1.04, duration: 2.8, ease: "power3.out" }, 0);
        fade(tl, q(".nav .brand, .nav-l li, .nav-c, .menu-btn"), 0.15, 0.8, -10, 0.07);
        fade(tl, q(".gh-lbl"), 0.3, 0.8, 10, 0);
        rise(tl, q(".gh-h .ln-i"), 0.35, 0.14, 1.3);
        fade(tl, q(".gh-b > *"), 1.0, 0.95, 22, 0.14);
        fade(tl, q(".gh-scroll"), 1.5, 0.9, 12, 0);

        let dead = false;
        const fontsReady =
          document.fonts && document.fonts.load
            ? Promise.all([
                document.fonts.load('600 1em "Cormorant Garamond"'),
                document.fonts.load('1em "Bilbo Swash Caps"'),
              ])
            : Promise.resolve();
        Promise.race([fontsReady, new Promise((r) => setTimeout(r, 1600))]).then(() => {
          if (!dead) tl.play();
        });
        cleanups.push(() => {
          dead = true;
        });

        /* hero parallax on scroll */
        const gh = q(".gh")[0];
        gsap.to(q(".gh-bg")[0], {
          yPercent: 14,
          ease: "none",
          scrollTrigger: { trigger: gh, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(q(".gh-h-wrap")[0], {
          yPercent: -10,
          autoAlpha: 0.15,
          ease: "none",
          scrollTrigger: { trigger: gh, start: "top top", end: "bottom top", scrub: true },
        });

        /* tiles: wipe in as they enter the screen */
        const tiles = q(".tile");
        const masks = tiles.map((t) => t.querySelector(".tile-mask"));
        const imgs = tiles.map((t) => t.querySelector(".tile-mask img"));
        gsap.set(masks, { clipPath: "inset(100% 0% 0% 0%)" });
        gsap.set(imgs, { scale: 1.35 });
        const bt = ScrollTrigger.batch(tiles, {
          start: "top 94%",
          once: true,
          onEnter: (batch) => {
            const els = batch.filter((t) => !t.dataset.rv);
            els.forEach((t) => {
              t.dataset.rv = "1";
            });
            gsap.to(
              els.map((t) => t.querySelector(".tile-mask")),
              { clipPath: "inset(0% 0% 0% 0%)", duration: 1.25, ease: "power3.inOut", stagger: 0.11 }
            );
            gsap.to(
              els.map((t) => t.querySelector(".tile-mask img")),
              { scale: 1, duration: 1.7, ease: "power3.out", stagger: 0.11 }
            );
          },
        });
        cleanups.push(() => bt.forEach((s) => s.kill()));

        /* headings + small fades further down the page */
        q(".rv").forEach((el) => {
          gsap.fromTo(
            el.querySelectorAll(".ln-i"),
            { yPercent: 118 },
            {
              yPercent: 0,
              duration: 1.15,
              ease: "power4.out",
              stagger: 0.12,
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            }
          );
        });
        q(".fd").forEach((el) => {
          gsap.fromTo(
            el,
            { autoAlpha: 0, y: 20 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.9,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 92%", once: true },
            }
          );
        });

        /* hero spotlight + mouse parallax */
        const spot = q(".gh-spot")[0];
        const bgim = q(".gh-bg .im")[0];
        if (fine && gh && spot && bgim) {
          gsap.set(spot, { x: window.innerWidth * 0.62, y: window.innerHeight * 0.72 });
          const sx = gsap.quickTo(spot, "x", { duration: 0.9, ease: "power3.out" });
          const sy = gsap.quickTo(spot, "y", { duration: 0.9, ease: "power3.out" });
          const qx = gsap.quickTo(bgim, "x", { duration: 1.6, ease: "power3.out" });
          const qy = gsap.quickTo(bgim, "y", { duration: 1.6, ease: "power3.out" });
          const onMove = (e) => {
            sx(e.clientX);
            sy(e.clientY);
            qx((0.5 - e.clientX / window.innerWidth) * 34);
            qy((0.5 - e.clientY / window.innerHeight) * 24);
          };
          gh.addEventListener("pointermove", onMove, { passive: true });
          cleanups.push(() => gh.removeEventListener("pointermove", onMove));
        }
      }
    }, root);

    /* tile hover: 3D tilt + image parallax + glare (mouse only) */
    const grid = gridRef.current;
    if (!calm && fine && grid) {
      const cache = new WeakMap();
      let hot = null;

      const rig = (tile) => {
        let c = cache.get(tile);
        if (c) return c;
        const inner = tile.querySelector(".tile-in");
        const img = tile.querySelector(".tile-mask img");
        gsap.set(inner, { transformPerspective: 1100 });
        c = {
          inner,
          img,
          rx: gsap.quickTo(inner, "rotationX", { duration: 0.7, ease: "power3.out" }),
          ry: gsap.quickTo(inner, "rotationY", { duration: 0.7, ease: "power3.out" }),
          ix: gsap.quickTo(img, "x", { duration: 0.9, ease: "power3.out" }),
          iy: gsap.quickTo(img, "y", { duration: 0.9, ease: "power3.out" }),
        };
        cache.set(tile, c);
        return c;
      };
      const enter = (t) => {
        const c = rig(t);
        gsap.to(c.img, { scale: 1.13, duration: 1.2, ease: "power3.out", overwrite: "auto" });
      };
      const leave = (t) => {
        const c = rig(t);
        c.rx(0);
        c.ry(0);
        c.ix(0);
        c.iy(0);
        gsap.to(c.img, { scale: 1, duration: 1, ease: "power3.out", overwrite: "auto" });
      };
      const move = (t, e) => {
        const r = t.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const c = rig(t);
        c.ry((px - 0.5) * 10);
        c.rx((0.5 - py) * 8);
        c.ix((0.5 - px) * 30);
        c.iy((0.5 - py) * 30);
        c.inner.style.setProperty("--mx", px * 100 + "%");
        c.inner.style.setProperty("--my", py * 100 + "%");
      };
      const onMove = (e) => {
        if (e.pointerType && e.pointerType !== "mouse") return;
        const t = e.target.closest ? e.target.closest(".tile") : null;
        if (t !== hot) {
          if (hot) leave(hot);
          hot = t;
          if (t) enter(t);
        }
        if (t) move(t, e);
      };
      const onOut = () => {
        if (hot) leave(hot);
        hot = null;
      };
      grid.addEventListener("pointermove", onMove, { passive: true });
      grid.addEventListener("pointerleave", onOut);
      cleanups.push(() => {
        grid.removeEventListener("pointermove", onMove);
        grid.removeEventListener("pointerleave", onOut);
      });
    }

    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  /* -------------------------------------------------------------- lightbox */
  const makeGhost = (src, r) => {
    const g = document.createElement("div");
    g.className = "lb-ghost";
    const im = document.createElement("img");
    im.src = src;
    im.alt = "";
    im.draggable = false;
    g.appendChild(im);
    Object.assign(g.style, {
      left: r.left + "px",
      top: r.top + "px",
      width: r.width + "px",
      height: r.height + "px",
    });
    ghostsRef.current.appendChild(g);
    return g;
  };

  const openLb = (k, tile) => {
    if (busy.current) return;
    busy.current = true;
    const w = shown[k];
    const pre = new Image();
    pre.src = hi(w);
    meta.current = { tile, r: rectOf(tile.querySelector(".tile-mask")), first: true };
    setIdx(k);
    setOpen(true);
  };

  /* open: the photo flies from its tile into the viewer */
  useIso(() => {
    if (!open) return;
    const m = meta.current;
    const w = shown[Math.min(idx, shown.length - 1)];
    if (!w || !m.r) {
      busy.current = false;
      return;
    }
    const lb = lbRef.current;
    const fig = figRef.current;
    const q = gsap.utils.selector(lb);
    const calm = reduce();
    const fr = rectOf(fig);
    const A = l0.current;
    const B = l1.current;

    top.current = 0;
    A.src = hi(w);
    B.removeAttribute("src");
    gsap.set(A, { autoAlpha: 1, zIndex: 2, scale: 1, xPercent: 0, clipPath: "inset(0% 0% 0% 0%)" });
    gsap.set(B, { autoAlpha: 0, zIndex: 1, scale: 1, xPercent: 0 });
    gsap.set(fig, { autoAlpha: 0 });
    gsap.fromTo(q(".lb-bg"), { autoAlpha: 0 }, { autoAlpha: 1, duration: calm ? 0 : 0.7, ease: "power2.out" });
    gsap.fromTo(
      q(".lb-top"),
      { autoAlpha: 0, y: -12 },
      { autoAlpha: 1, y: 0, duration: calm ? 0 : 0.7, delay: calm ? 0 : 0.45, ease: "power3.out" }
    );
    if (m.tile) m.tile.style.visibility = "hidden";

    const ghost = makeGhost(lo(w), m.r);
    let landed = false;
    const land = () => {
      if (landed) return;
      landed = true;
      gsap.set(fig, { autoAlpha: 1 });
      ghost.remove();
      busy.current = false;
      if (closeRef.current) closeRef.current.focus({ preventScroll: true });
    };
    gsap.to(ghost, {
      left: fr.left,
      top: fr.top,
      width: fr.width,
      height: fr.height,
      duration: calm ? 0 : 1.1,
      ease: "power4.inOut",
      onComplete: () => {
        const p = A.decode ? A.decode().catch(() => {}) : Promise.resolve();
        Promise.race([p, new Promise((r) => setTimeout(r, 1500))]).then(land);
      },
    });
  }, [open]);

  /* text in the viewer rises in whenever the photo changes */
  useIso(() => {
    if (!open) return;
    const q = gsap.utils.selector(lbRef.current);
    const first = meta.current.first;
    meta.current.first = false;
    gsap.fromTo(
      q(".lb-txt"),
      { autoAlpha: 0, y: 18 },
      {
        autoAlpha: 1,
        y: 0,
        duration: reduce() ? 0 : 0.8,
        delay: reduce() ? 0 : first ? 0.75 : 0.2,
        ease: "power3.out",
        stagger: reduce() ? 0 : 0.07,
      }
    );
  }, [open, idx]);

  /* next / previous: new photo wipes in from the side */
  const step = (d) => {
    if (busy.current || !open || shown.length < 2) return;
    busy.current = true;
    const n = shown.length;
    const ni = (idx + d + n) % n;
    const nw = shown[ni];
    const A = top.current === 0 ? l0.current : l1.current;
    const B = top.current === 0 ? l1.current : l0.current;
    const m = meta.current;
    if (m.tile) m.tile.style.visibility = "";
    const nt = tileOf(nw);
    if (nt) nt.style.visibility = "hidden";
    m.tile = nt;
    B.src = hi(nw);

    let started = false;
    const run = () => {
      if (started) return;
      started = true;
      const calm = reduce();
      gsap.set(B, {
        zIndex: 3,
        autoAlpha: 1,
        scale: calm ? 1 : 1.14,
        xPercent: 0,
        clipPath: d > 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)",
      });
      gsap.set(A, { zIndex: 2 });
      gsap.to(B, { clipPath: "inset(0% 0% 0% 0%)", duration: calm ? 0 : 1.05, ease: "power3.inOut" });
      gsap.to(B, { scale: 1, duration: calm ? 0 : 1.5, ease: "power3.out" });
      gsap.to(A, {
        xPercent: d > 0 ? -8 : 8,
        scale: 1.06,
        duration: calm ? 0 : 1.05,
        ease: "power3.inOut",
        onComplete: () => {
          gsap.set(A, { autoAlpha: 0, xPercent: 0, scale: 1 });
          top.current = top.current === 0 ? 1 : 0;
          busy.current = false;
        },
      });
      setIdx(ni);
    };
    const p = B.decode ? B.decode().catch(() => {}) : Promise.resolve();
    Promise.race([p, new Promise((r) => setTimeout(r, 1200))]).then(run);
  };

  /* close: the photo flies back to its tile */
  const close = () => {
    if (busy.current || !open) return;
    busy.current = true;
    const calm = reduce();
    const w = shown[Math.min(idx, shown.length - 1)];
    const tile = (w && tileOf(w)) || meta.current.tile;
    const fig = figRef.current;
    const A = top.current === 0 ? l0.current : l1.current;
    const q = gsap.utils.selector(lbRef.current);
    const ghost = makeGhost(A.currentSrc || A.src, rectOf(fig));
    gsap.set(fig, { autoAlpha: 0 });
    gsap.to(q(".lb-txt, .lb-top"), { autoAlpha: 0, duration: calm ? 0 : 0.35, stagger: 0.02 });
    gsap.to(q(".lb-bg"), { autoAlpha: 0, duration: calm ? 0 : 0.8, delay: calm ? 0 : 0.2, ease: "power2.inOut" });

    const finish = () => {
      ghost.remove();
      if (tile) tile.style.visibility = "";
      meta.current.tile = null;
      setOpen(false);
      busy.current = false;
      if (tile) {
        const b = tile.querySelector(".tile-b");
        if (b) b.focus({ preventScroll: true });
      }
    };
    const tr = tile ? rectOf(tile.querySelector(".tile-mask")) : null;
    if (tr && inView(tr)) {
      gsap.to(ghost, {
        left: tr.left,
        top: tr.top,
        width: tr.width,
        height: tr.height,
        duration: calm ? 0 : 1,
        ease: "power4.inOut",
        onComplete: finish,
      });
    } else {
      gsap.to(ghost, { autoAlpha: 0, scale: 0.96, duration: calm ? 0 : 0.5, onComplete: finish });
    }
  };

  api.current = { step, close };

  /* lock page scroll while the viewer is open */
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  /* keyboard + focus trap */
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        api.current.close();
      } else if (e.key === "ArrowRight") {
        api.current.step(1);
      } else if (e.key === "ArrowLeft") {
        api.current.step(-1);
      } else if (e.key === "Tab") {
        const f = Array.from(lbRef.current.querySelectorAll("button, a[href]")).filter(
          (n) => n.offsetParent !== null
        );
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  /* swipe left / right for next / previous, swipe down to close */
  useEffect(() => {
    if (!open) return;
    const el = figRef.current;
    if (!el) return;
    let sx = 0;
    let sy = 0;
    let on = false;
    const st = (e) => {
      const t = e.touches[0];
      sx = t.clientX;
      sy = t.clientY;
      on = true;
    };
    const en = (e) => {
      if (!on) return;
      on = false;
      const t = e.changedTouches[0];
      const dx = t.clientX - sx;
      const dy = t.clientY - sy;
      if (Math.abs(dx) > 46 && Math.abs(dx) > Math.abs(dy) * 1.3) api.current.step(dx < 0 ? 1 : -1);
      else if (dy > 90 && Math.abs(dy) > Math.abs(dx) * 1.3) api.current.close();
    };
    el.addEventListener("touchstart", st, { passive: true });
    el.addEventListener("touchend", en, { passive: true });
    return () => {
      el.removeEventListener("touchstart", st);
      el.removeEventListener("touchend", en);
    };
  }, [open]);

  /* preload neighbours so next / prev feel instant */
  useEffect(() => {
    if (!open || !shown.length) return;
    [1, -1].forEach((d) => {
      const w = shown[(curK + d + shown.length) % shown.length];
      if (w) {
        const im = new Image();
        im.src = hi(w);
      }
    });
  }, [open, curK, shown]);

  const repeat = Array.from({ length: 4 });

  return (
    <div className="ai" ref={rootRef} id="top">
      <style>{CSS}</style>

      <i className="prog" ref={progRef} aria-hidden="true" />
      <Nav menu={menu} setMenu={setMenu} glass={glass} />

      <main>
        {/* ------------------------------------------------------------ HERO */}
        <header className="gh">
          <div className="gh-bg">
            <Img src={HERO} alt="" eager tone={1} />
          </div>
          <div className="gh-shade" />
          <div className="gh-grid" />
          <div className="gh-spot" />

          <div className="gh-h-wrap">
            <p className="lbl gh-lbl">Gallery</p>
            <Hd
              as="h1"
              size="xl"
              className="gh-h"
              lines={["SPACES", { t: "~CAPTURED", c: "l2" }]}
            />
          </div>

          <div className="gh-b">
            <p>
              A closer look at the rooms we have designed. Filter by space, hover to explore, and
              open any frame to see it full size.
            </p>
            <span className="gh-count">{pad2(live.length)} frames</span>
          </div>

          <div className="gh-scroll" aria-hidden="true">
            <span>Scroll</span>
            <i />
          </div>
        </header>

        {/* ---------------------------------------------------------- FILTERS */}
        <div className="fbar">
          <div className="fbar-in">
            <div className="chips" role="group" aria-label="Filter by room type">
              {CATS.filter((c) => c === "All" || counts[c]).map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`chip ${filter === c ? "on" : ""}`}
                  aria-pressed={filter === c}
                  data-cur="Filter"
                  onClick={() => setCat(c)}
                >
                  {c}
                  <sup>{counts[c] || 0}</sup>
                </button>
              ))}
            </div>
            <span className="fbar-n" aria-live="polite">
              Showing {pad2(shown.length)}
            </span>
          </div>
        </div>

        {/* ------------------------------------------------------------- GRID */}
        <section className="gl" aria-label="Project photos">
          <div className="gl-grid" ref={gridRef}>
            {live.map((w) => {
              const k = pos.get(w.id);
              const on = k !== undefined;
              const size = on ? SEQ[k % SEQ.length] : "sq";
              return (
                <figure key={w.id} className={`tile t-${size} ${on ? "" : "is-off"}`} data-id={w.id}>
                  <button
                    type="button"
                    className="tile-b"
                    data-cur="View"
                    data-free=""
                    aria-label={`Open ${w.title}, ${w.place}`}
                    tabIndex={on ? 0 : -1}
                    onClick={(e) => openLb(k, e.currentTarget.closest(".tile"))}
                  >
                    <span className="tile-in">
                      <span className="tile-mask">
                        <img
                          src={lo(w)}
                          alt={`${w.title}, ${w.place}`}
                          loading="lazy"
                          decoding="async"
                          draggable="false"
                          onError={() => onBad(w.id)}
                        />
                        <span className="tile-shade" />
                        <span className="tile-glare" />
                        <span className="tile-no">{on ? pad2(k + 1) : ""}</span>
                        <i className="tb tb1" />
                        <i className="tb tb2" />
                        <i className="tb tb3" />
                        <i className="tb tb4" />
                        <span className="tile-cap">
                          <span className="tile-cat">{w.cat}</span>
                          <span className="tile-t">{w.title}</span>
                          <span className="tile-pl">
                            {w.place}, {w.year}
                          </span>
                        </span>
                        <span className="tile-plus">
                          <i />
                          <i />
                        </span>
                      </span>
                    </span>
                  </button>
                </figure>
              );
            })}
          </div>
        </section>

        {/* -------------------------------------------------------------- CTA */}
        <section className="cta">
          <p className="lbl fd">Have a space in mind?</p>
          <div className="rv">
            <Hd size="l" lines={["LIKE WHAT YOU SEE?", "LET’S ~BUILD YOURS"]} />
          </div>
          <a className="lnk fd" href={CONTACT} data-cur="Talk">
            Start a project <Arrow />
          </a>
        </section>
      </main>

      {/* ------------------------------------------------------------ FOOTER */}
      <footer className="ft">
        <div className="ft-top">
          <a className="ft-logo" href="#top" data-cur="Top">
            {SITE.name}
          </a>
          <div className="ft-cols">
            <div className="ft-col">
              <span className="ft-h">Menu</span>
              <ul>
                {NAV.map(([label, href]) => (
                  <li key={label}>
                    <a href={href}>{label}</a>
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

      {/* ---------------------------------------------------------- VIEWER */}
      <div
        className={`lb ${open ? "open" : ""}`}
        ref={lbRef}
        role="dialog"
        aria-modal="true"
        aria-label="Photo viewer"
        aria-hidden={!open}
      >
        <div className="lb-bg" onClick={close} />

        <div className="lb-top">
          <span className="lb-brand">{SITE.name}</span>
          <button type="button" className="lb-x" ref={closeRef} data-cur="Close" onClick={close}>
            Close <i />
          </button>
        </div>

        <div className="lb-main">
          <div className="lb-fig" ref={figRef} role="img" aria-label={`${cur.title}, ${cur.place}`}>
            <img className="lb-l" ref={l0} alt="" draggable="false" />
            <img className="lb-l" ref={l1} alt="" draggable="false" />
          </div>

          <aside className="lb-info">
            <div className="lb-head">
              <p className="lb-txt lb-cnt">
                {pad2(curK + 1)} / {pad2(shown.length)}
              </p>
              <span className="lb-txt lb-bar">
                <b style={{ transform: `scaleX(${(curK + 1) / Math.max(shown.length, 1)})` }} />
              </span>
            </div>

            <div className="lb-body">
              <p className="lb-txt lbl">
                {cur.cat} — {cur.place}, {cur.year}
              </p>
              <h3 className="lb-txt lb-t">{cur.title}</h3>
              <p className="lb-txt lb-d">{cur.desc}</p>
            </div>

            <div className="lb-foot">
              <a className="lb-txt lnk" href={CONTACT} data-cur="Talk">
                Start a project <Arrow />
              </a>
              <div className="lb-txt lb-ctl">
                <button
                  type="button"
                  className="rb"
                  aria-label="Previous photo"
                  data-cur="Prev"
                  onClick={() => step(-1)}
                >
                  <span className="rb-a rb-flip">
                    <Arrow />
                  </span>
                </button>
                <button
                  type="button"
                  className="rb rb-on"
                  aria-label="Next photo"
                  data-cur="Next"
                  onClick={() => step(1)}
                >
                  <span className="rb-a">
                    <Arrow />
                  </span>
                </button>
              </div>
            </div>
          </aside>
        </div>

        <div className="lb-ghosts" ref={ghostsRef} />
      </div>

      <Cursor rootRef={rootRef} />
    </div>
  );
}

/* ========================================================================== */
/*  STYLES                                                                    */
/* ========================================================================== */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bilbo+Swash+Caps&family=Cormorant+Garamond:wght@500;600;700&family=Instrument+Sans:wght@400;500;600&display=swap');

html{scroll-behavior:smooth;scrollbar-gutter:stable}

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
  position:relative;overscroll-behavior-y:none;
}
.ai *,.ai *::before,.ai *::after{box-sizing:border-box}
/* :where() keeps these resets at zero specificity so component classes always win */
.ai :where(h1,h2,h3,h4,p,ul,figure){margin:0;padding:0}
.ai :where(ul){list-style:none}
.ai :where(a){color:inherit;text-decoration:none}
.ai :where(button){font:inherit;color:inherit;background:none;border:0;cursor:pointer;padding:0;text-align:inherit}
.ai img{display:block;max-width:none}
.ai :focus-visible{outline:1px solid var(--acc);outline-offset:4px}

.prog{position:fixed;left:0;right:0;top:0;height:2px;background:var(--acc);transform:scaleX(0);transform-origin:left center;z-index:300;pointer-events:none}

/* ---- type ---- */
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

/* ---- nav ---- */
.nav{position:fixed;left:0;right:0;top:0;height:var(--nav-h);min-height:52px;display:flex;align-items:center;
  padding:0 var(--pad);z-index:200;background:linear-gradient(180deg,rgba(10,7,5,.5),rgba(10,7,5,0));
  -webkit-backdrop-filter:blur(0px);backdrop-filter:blur(0px);border-bottom:1px solid transparent;
  transition:background .5s ease,border-color .5s ease,backdrop-filter .5s ease,box-shadow .5s ease}
.nav.nav-glass{background:rgba(20,16,13,.52);-webkit-backdrop-filter:blur(18px) saturate(150%);backdrop-filter:blur(18px) saturate(150%);
  border-bottom:1px solid rgba(242,233,220,.12);box-shadow:0 8px 32px rgba(0,0,0,.28)}
.brand{font-family:var(--serif);font-weight:700;font-size:1.4em;letter-spacing:.09em;text-transform:uppercase;width:calc(50vw - var(--pad));white-space:nowrap;flex:none}
.nav-l{display:flex;gap:2.65vw;flex:1;text-transform:uppercase;font-weight:500}
.nav-l li{position:relative}
.nav-l a{position:relative;display:inline-block;padding:.15em 0;transition:opacity .35s,color .35s}
.nav-l a::after{content:"";position:absolute;left:0;right:100%;bottom:-.1em;height:1px;background:var(--acc);transition:right .4s cubic-bezier(.2,.7,.2,1)}
.nav-l:hover a{opacity:.45}
.nav-l a:hover{opacity:1}
.nav-l a:hover::after{right:0}
.nav-l a[aria-current]{color:var(--acc)}
.nav-l a[aria-current]::after{right:0}
.nav-c{text-transform:uppercase;font-weight:500;flex:none;transition:color .35s}
.nav-c:hover{color:var(--acc)}
.menu-btn{display:none;flex:none;width:34px;height:34px;place-items:center}
.menu-btn .bg{position:relative;width:22px;height:14px;display:block}
.menu-btn .bg i{position:absolute;left:0;right:0;height:1.5px;background:var(--ink);transition:transform .4s cubic-bezier(.2,.7,.2,1),top .4s cubic-bezier(.2,.7,.2,1),opacity .3s}
.menu-btn .bg i:first-child{top:0}
.menu-btn .bg i:last-child{top:100%;transform:translateY(-100%)}
.menu-btn .bg.open i:first-child{top:50%;transform:translateY(-50%) rotate(45deg)}
.menu-btn .bg.open i:last-child{top:50%;transform:translateY(-50%) rotate(-45deg)}

.mnav{position:fixed;inset:0;z-index:190;background:rgba(14,10,8,.86);-webkit-backdrop-filter:blur(22px) saturate(140%);backdrop-filter:blur(22px) saturate(140%);
  display:none;align-items:center;justify-content:center;opacity:0;visibility:hidden;transform:translateY(-8px);
  transition:opacity .45s cubic-bezier(.2,.7,.2,1),visibility .45s,transform .45s cubic-bezier(.2,.7,.2,1)}
.mnav.open{opacity:1;visibility:visible;transform:none}
.mnav ul{display:grid;gap:2.4vh;text-align:center}
.mnav a{font-family:var(--serif);font-weight:600;text-transform:uppercase;font-size:11vw;line-height:1.1;transition:color .3s}
.mnav a:hover{color:var(--acc)}

/* ---- hero ---- */
.gh{position:relative;height:100vh;height:100svh;min-height:560px;overflow:hidden;background:#0d0907}
.gh-bg{position:absolute;inset:-5% 0;z-index:1;will-change:transform}
.gh-bg .im{position:absolute;inset:-3%}
.gh-shade{position:absolute;inset:0;z-index:2;
  background:linear-gradient(180deg,rgba(12,8,6,.62) 0%,rgba(12,8,6,.3) 38%,rgba(12,8,6,.78) 100%),rgba(22,14,9,.3)}
.gh-grid{position:absolute;inset:0;z-index:3;pointer-events:none;
  background-image:linear-gradient(rgba(242,233,220,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(242,233,220,.05) 1px,transparent 1px);
  background-size:8vw 8vw;background-position:center center;
  -webkit-mask-image:linear-gradient(180deg,transparent 0,#000 22%,#000 70%,transparent 100%);
  mask-image:linear-gradient(180deg,transparent 0,#000 22%,#000 70%,transparent 100%)}
.gh-spot{position:absolute;left:0;top:0;width:46vw;height:46vw;margin:-23vw 0 0 -23vw;z-index:4;pointer-events:none;will-change:transform;
  transform:translate(62vw,72vh);
  background:radial-gradient(circle,rgba(255,214,160,.26),rgba(255,214,160,.09) 42%,rgba(255,214,160,0) 68%)}
.gh-h-wrap{position:absolute;z-index:5;left:11vw;right:var(--pad);top:24vh;max-width:82vw}
.gh-lbl{margin-bottom:2vh}
.gh-h .l2{margin-left:clamp(0px,22vw,420px)}
.gh-b{position:absolute;z-index:5;left:50vw;bottom:13vh;width:min(24vw,440px)}
.gh-b p{line-height:1.5;font-size:1.02em}
.gh-count{display:block;margin-top:4vh;font-family:var(--mono);font-size:.78em;letter-spacing:.12em;text-transform:uppercase;color:var(--acc)}
.gh-scroll{position:absolute;z-index:5;left:var(--pad);bottom:4.4vh;display:flex;align-items:center;gap:1.1em;color:var(--mute);
  text-transform:uppercase;font-size:.85em;letter-spacing:.06em}
.gh-scroll i{display:block;width:1px;height:5.4vh;background:rgba(242,233,220,.22);position:relative;overflow:hidden}
.gh-scroll i::after{content:"";position:absolute;left:0;top:0;width:100%;height:45%;background:var(--acc);animation:scrollcue 2.2s cubic-bezier(.6,0,.3,1) infinite}
@keyframes scrollcue{0%{transform:translateY(-110%)}70%,100%{transform:translateY(240%)}}

/* ---- filter bar ---- */
.fbar{position:sticky;top:max(var(--nav-h),52px);z-index:120;background:rgba(20,16,13,.74);
  -webkit-backdrop-filter:blur(16px) saturate(140%);backdrop-filter:blur(16px) saturate(140%);
  border-top:1px solid rgba(242,233,220,.06);border-bottom:1px solid rgba(242,233,220,.1)}
.fbar-in{display:flex;align-items:center;justify-content:space-between;gap:2vw;padding:1.5vh var(--pad)}
.chips{display:flex;gap:.7vw;overflow-x:auto;scrollbar-width:none;padding:2px}
.chips::-webkit-scrollbar{display:none}
.chip{position:relative;isolation:isolate;flex:none;padding:.7em 1.3em;border:1px solid var(--line);border-radius:99px;
  text-transform:uppercase;font-weight:500;font-size:.88em;letter-spacing:.03em;overflow:hidden;white-space:nowrap;
  transition:color .4s,border-color .4s}
.chip::before{content:"";position:absolute;inset:0;z-index:-1;background:var(--acc);transform:translateY(101%);
  transition:transform .55s cubic-bezier(.2,.7,.2,1)}
.chip:hover{border-color:var(--acc)}
.chip.on{color:#1a120c;border-color:var(--acc)}
.chip.on::before{transform:none}
.chip sup{margin-left:.55em;font-family:var(--mono);font-size:.78em;opacity:.7}
.fbar-n{flex:none;font-family:var(--mono);font-size:.78em;letter-spacing:.1em;text-transform:uppercase;color:var(--mute)}

/* ---- grid ---- */
.gl{position:relative;padding:2.4vh var(--pad) 10vh;background:var(--bg2)}
.gl-grid{position:relative;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));
  grid-auto-rows:clamp(150px,13.6vw,320px);grid-auto-flow:row dense;gap:1.1vw}
.t-tall{grid-row:span 2}
.t-wide{grid-column:span 2}
.t-big{grid-column:span 2;grid-row:span 2}
.tile{position:relative;min-width:0;min-height:0}
.tile.is-off{display:none}
.tile:hover{z-index:4}
.tile-b{position:absolute;inset:0;display:block;width:100%;height:100%;-webkit-tap-highlight-color:transparent}
.tile-b:focus-visible{outline:1px solid var(--acc);outline-offset:3px}
.tile-in{position:absolute;inset:0;display:block;will-change:transform}
.tile-mask{position:absolute;inset:0;display:block;overflow:hidden;
  background:linear-gradient(155deg,#3a2a1f,#140e0a);box-shadow:0 0 0 rgba(0,0,0,0);
  transition:box-shadow .6s ease}
.tile:hover .tile-mask{box-shadow:0 34px 70px rgba(0,0,0,.5)}
.tile-mask img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;will-change:transform;transform-origin:50% 50%}
.tile-shade{position:absolute;inset:0;display:block;opacity:0;transition:opacity .6s ease;
  background:linear-gradient(180deg,rgba(12,8,6,.22) 0%,rgba(12,8,6,0) 32%,rgba(12,8,6,.82) 100%)}
.tile-glare{position:absolute;inset:0;display:block;opacity:0;transition:opacity .5s ease;mix-blend-mode:soft-light;
  background:radial-gradient(circle at var(--mx,50%) var(--my,50%),rgba(255,222,180,.9),rgba(255,222,180,0) 55%)}
.tile-no{position:absolute;left:1.1vw;top:1.1vw;font-family:var(--mono);font-size:.72em;letter-spacing:.1em;
  color:rgba(242,233,220,.9);text-shadow:0 0 10px rgba(10,7,5,.7);opacity:.75;transition:opacity .4s,transform .6s cubic-bezier(.2,.7,.2,1)}
.tile:hover .tile-no{opacity:1;transform:translate(6px,6px)}
.tb{position:absolute;display:block;width:14px;height:14px;border:1px solid var(--acc);opacity:0;
  transition:opacity .4s ease,transform .6s cubic-bezier(.2,.7,.2,1)}
.tb1{left:12px;top:12px;border-right:0;border-bottom:0;transform:translate(8px,8px)}
.tb2{right:12px;top:12px;border-left:0;border-bottom:0;transform:translate(-8px,8px)}
.tb3{left:12px;bottom:12px;border-right:0;border-top:0;transform:translate(8px,-8px)}
.tb4{right:12px;bottom:12px;border-left:0;border-top:0;transform:translate(-8px,-8px)}
.tile:hover .tb,.tile-b:focus-visible .tb{opacity:1;transform:none}
.tile-cap{position:absolute;left:1.3vw;right:4.6vw;bottom:1.3vw;display:block;transform:translateY(16px);opacity:0;
  transition:transform .7s cubic-bezier(.2,.7,.2,1),opacity .5s ease}
.tile-cat{display:block;font-family:var(--mono);font-size:.7em;letter-spacing:.12em;text-transform:uppercase;color:var(--acc)}
.tile-t{display:block;margin-top:.55em;font-family:var(--serif);font-weight:600;text-transform:uppercase;
  font-size:clamp(18px,1.9vw,36px);line-height:1}
.tile-pl{display:block;margin-top:.6em;color:var(--mute);font-size:.88em}
.tile-plus{position:absolute;right:1.1vw;bottom:1.1vw;display:block;width:2.6vw;height:2.6vw;min-width:34px;min-height:34px;max-width:46px;max-height:46px;
  border-radius:50%;border:1px solid rgba(242,233,220,.55);opacity:0;transform:scale(.5) rotate(-90deg);
  transition:opacity .4s ease,transform .7s cubic-bezier(.2,.7,.2,1),background .4s,border-color .4s}
.tile-plus i{position:absolute;left:50%;top:50%;width:38%;height:1px;background:var(--ink);transform:translate(-50%,-50%);transition:background .4s}
.tile-plus i:last-child{transform:translate(-50%,-50%) rotate(90deg)}
.tile:hover .tile-shade,.tile-b:focus-visible .tile-shade,.tile:hover .tile-glare{opacity:1}
.tile:hover .tile-cap,.tile-b:focus-visible .tile-cap{transform:none;opacity:1}
.tile:hover .tile-plus,.tile-b:focus-visible .tile-plus{opacity:1;transform:none}
.tile:hover .tile-plus{background:var(--acc);border-color:var(--acc)}
.tile:hover .tile-plus i{background:#1a120c}

/* ---- CTA ---- */
.cta{padding:16vh var(--pad) 14vh;background:var(--bg);display:flex;flex-direction:column;align-items:flex-start}
.cta .rv{margin:2vh 0 7vh}
.cta .lnk{min-width:min(20vw,360px)}

/* ---- footer ---- */
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
.mq{overflow:hidden;white-space:nowrap;padding:4vh 0 2vh}
.mq-track{display:flex;width:max-content;will-change:transform}
.mq-half{display:flex;flex:none}
.mq-i{display:inline-flex;align-items:center;flex:none}
.mq-t{font-family:var(--serif);font-weight:600;text-transform:uppercase;font-size:clamp(40px,6.4vw,124px);line-height:1;color:#43362b}
.mq-t .sw{color:#43362b}
.mq-s{font-size:1.6vw;color:#43362b;margin:0 2.6vw}

/* ---- round buttons ---- */
.rb{width:4.1vw;height:4.1vw;min-width:44px;min-height:44px;max-width:58px;max-height:58px;border-radius:50%;border:1px solid var(--line);display:grid;place-items:center;
  transition:background .45s cubic-bezier(.2,.7,.2,1),color .45s,border-color .45s,transform .35s cubic-bezier(.2,.7,.2,1)}
.rb .arw{width:1.5em}
.rb-a{display:grid;place-items:center}
.rb-flip{transform:scaleX(-1)}
.rb:hover{background:var(--ink);color:var(--bg);border-color:var(--ink);transform:scale(1.06)}
.rb-on{background:var(--acc);color:#1a120c;border-color:var(--acc)}
.rb-on:hover{background:var(--ink);border-color:var(--ink)}
.rb:hover .arw{transform:none}

/* ---- viewer ---- */
.lb{position:fixed;inset:0;z-index:500;visibility:hidden;pointer-events:none}
.lb.open{visibility:visible;pointer-events:auto}
.lb-bg{position:absolute;inset:0;background:rgba(12,8,6,.95);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px)}
.lb-top{position:absolute;left:0;right:0;top:0;height:max(var(--nav-h),56px);display:flex;align-items:center;justify-content:space-between;
  padding:0 var(--pad);z-index:30}
.lb-brand{font-family:var(--serif);font-weight:700;font-size:1.4em;letter-spacing:.09em;text-transform:uppercase}
.lb-x{display:inline-flex;align-items:center;gap:.8em;text-transform:uppercase;font-weight:500;letter-spacing:.02em;padding:.6em 0;transition:color .35s}
.lb-x:hover{color:var(--acc)}
.lb-x i{position:relative;display:block;width:20px;height:20px;transition:transform .5s cubic-bezier(.2,.7,.2,1)}
.lb-x:hover i{transform:rotate(90deg)}
.lb-x i::before,.lb-x i::after{content:"";position:absolute;left:0;right:0;top:50%;height:1.5px;background:currentColor;transform:rotate(45deg)}
.lb-x i::after{transform:rotate(-45deg)}
.lb-main{position:absolute;inset:0;z-index:10;padding:calc(max(var(--nav-h),56px) + 1vh) var(--pad) 3.4vh;
  display:grid;grid-template-columns:minmax(0,1fr) min(25vw,420px);grid-template-rows:minmax(0,1fr);gap:2.4vw}
.lb-fig{position:relative;min-height:0;overflow:hidden;background:#0d0907;touch-action:pan-y}
.lb-l{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;will-change:transform,clip-path}
.lb-info{position:relative;display:flex;flex-direction:column;justify-content:space-between;min-height:0;padding:.5vh 0 0}
.lb-cnt{font-family:var(--mono);font-size:.82em;letter-spacing:.12em;color:var(--acc)}
.lb-bar{display:block;position:relative;height:1px;margin-top:1.6vh;background:var(--line)}
.lb-bar b{position:absolute;inset:0;background:var(--acc);transform-origin:left center;transition:transform .8s cubic-bezier(.2,.7,.2,1)}
.lb-t{margin-top:1.6vh;font-family:var(--serif);font-weight:600;text-transform:uppercase;font-size:clamp(30px,3.6vw,70px);line-height:.98}
.lb-d{margin-top:3vh;max-width:34ch;color:var(--mute);line-height:1.55}
.lb-foot{display:flex;flex-direction:column;align-items:flex-start;gap:4vh}
.lb-ctl{display:flex;gap:.9vw}
.lb-ghosts{position:absolute;inset:0;z-index:40;pointer-events:none}
.lb-ghost{position:fixed;overflow:hidden;background:#0d0907;will-change:left,top,width,height}
.lb-ghost img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}

/* ---- cursor ---- */
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

/* ---- mobile ---- */
@media (max-width:900px){
  .ai{font-size:15px;--pad:5.6vw;--nav-h:60px}
  .hd-xl{font-size:16vw}.hd-l{font-size:12vw}.hd-m{font-size:10vw}
  .lnk{min-width:min(60vw,340px)}
  .mnav{display:flex}
  .menu-btn{display:grid}
  .nav{background:rgba(20,16,13,.4);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);border-bottom:1px solid rgba(242,233,220,.08)}
  .brand{width:auto;flex:1;font-size:1.2em}
  .nav-l,.nav-c{display:none}

  .gh-spot,.gh-scroll{display:none}
  .gh-grid{background-size:16vw 16vw}
  .gh-h-wrap{left:var(--pad);right:var(--pad);top:22svh;max-width:none}
  .gh-h .l2{margin-left:clamp(0px,9vw,80px)}
  .gh-b{left:var(--pad);right:var(--pad);bottom:9svh;width:auto}
  .gh-b p{max-width:36ch}

  .fbar-n{display:none}
  .fbar-in{padding:1.1vh var(--pad)}
  .chips{gap:8px}

  .gl{padding:1.6vh var(--pad) 8vh}
  .gl-grid{grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-rows:44vw;gap:2.4vw}
  .tile-no{left:3vw;top:3vw}
  .tile-cap{left:3vw;right:3vw;bottom:3vw}

  .cta{padding:10vh var(--pad) 9vh}
  .cta .lnk{min-width:min(60vw,340px)}

  .ft{min-height:auto;padding-bottom:1vh}
  .ft-top{flex-direction:column;gap:5vh;padding:6vh var(--pad) 5vh}
  .ft-cols{grid-template-columns:1fr;row-gap:4vh}
  .ft-col{grid-template-columns:28vw 1fr}
  .ft-col ul{max-width:none}
  .mq-t{font-size:14vw}.mq-s{font-size:5vw;margin:0 6vw}

  .lb-main{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr) auto;gap:2vh;padding:calc(56px + 1vh) var(--pad) 3vh}
  .lb-info{gap:1.6vh;justify-content:flex-start}
  .lb-head{display:none}
  .lb-t{margin-top:.8vh;font-size:9vw}
  .lb-d{display:none}
  .lb-foot{flex-direction:row;align-items:center;justify-content:space-between;gap:4vw}
  .lb-foot .lnk{min-width:0;gap:1.4em}
  .lb-ctl{gap:10px}
  .rb{width:50px;height:50px}
}

/* touch: no hover, so show the caption straight away */
@media (hover:none){
  .tile-shade{opacity:1}
  .tile-cap{opacity:1;transform:none}
  .tile-pl,.tile-plus,.tb{display:none}
  .tile-cap{right:3vw}
}

@media (prefers-reduced-motion:reduce){
  .ai *,.ai *::before,.ai *::after{transition-duration:.01ms!important;animation:none!important}
}
`;