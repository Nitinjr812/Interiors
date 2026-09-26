"use client"; 

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;
const reduce = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 
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

/* Links to the other pages. Change "/" and "/gallery" to your routes. */
const NAV = [
  ["About us", "/#about"],
  ["Portfolio", "#top", true],
  ["Gallery", "/gallery"],
  ["Services", "/#services"],
  ["Journal", "/#journal"],
];
const CONTACT = "/#contact";

/* Unsplash placeholders. Replace with your own project photos:
 *   - put files in /public/portfolio/ and use  "/portfolio/amber-house.jpg"
 *   - or keep Unsplash and change the ids below. */
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

const HERO = ph(0, 2200);

/* p = main photo (index into PH), a = accent photo. Text is placeholder:
 * match it to the real project you put in each slot. */
const PROJECTS = [
  {
    title: "Amber House", place: "Ahmedabad", year: 2024, cat: "Residential", p: 0, a: 7,
    desc: "Warm timber and lime plaster give a family home its slow, sunlit rhythm.",
    brief: "Residential interior for a family home in Ahmedabad.",
    palette: "amber oak, clay, and soft linen white.",
    scope: "Design, sourcing and styling",
  },
  {
    title: "Quiet Study", place: "Mumbai", year: 2024, cat: "Workspace", p: 1, a: 9,
    desc: "Neutral tones and honest materials shape a focused, reflective workspace.",
    brief: "Home office concept for a Mumbai apartment.",
    palette: "ash wood, oat beige, and ivory.",
    scope: "Design and sourcing",
  },
  {
    title: "Salt & Stone", place: "Goa", year: 2023, cat: "Residential", p: 2, a: 4,
    desc: "Textured walls and open sightlines let a coastal villa breathe with the light.",
    brief: "Coastal villa interior in North Goa.",
    palette: "sea-salt white, driftwood, and sage.",
    scope: "Design, sourcing and supervision",
  },
  {
    title: "The Long Table", place: "Delhi", year: 2023, cat: "Residential", p: 8, a: 3,
    desc: "A dining room built around one generous table, and the conversations it holds.",
    brief: "Dining and lounge concept for a Delhi residence.",
    palette: "walnut, brass, and warm stone.",
    scope: "Design and styling",
  },
  {
    title: "Hush", place: "Bengaluru", year: 2023, cat: "Residential", p: 5, a: 6,
    desc: "A bedroom suite designed for slow mornings, soft light and deep rest.",
    brief: "Primary suite for a home in Bengaluru.",
    palette: "mushroom, bone, and washed linen.",
    scope: "Design, sourcing and styling",
  },
  {
    title: "Courtyard", place: "Pune", year: 2022, cat: "Residential", p: 11, a: 10,
    desc: "An inner courtyard brings green, air and daylight into the centre of the home.",
    brief: "Courtyard-led residence in Pune.",
    palette: "terracotta, fern, and pale plaster.",
    scope: "Design and supervision",
  },
  {
    title: "The Corner Café", place: "Kochi", year: 2022, cat: "Hospitality", p: 4, a: 2,
    desc: "A neighbourhood café with warm joinery, low lighting and an easy, lived-in feel.",
    brief: "Hospitality interior for a café in Kochi.",
    palette: "teak, cream, and burnt sienna.",
    scope: "Design, sourcing and supervision",
  },
  {
    title: "North Light", place: "Hyderabad", year: 2022, cat: "Residential", p: 6, a: 1,
    desc: "A studio-style apartment where every corner is arranged around the day’s best light.",
    brief: "Apartment interior in Hyderabad.",
    palette: "birch, chalk, and pale grey.",
    scope: "Design and styling",
  },
];

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

export default function PortfolioPage() {
  const rootRef = useRef(null);
  const progRef = useRef(null);
  const ixRef = useRef(null);
  const pvRef = useRef(null);

  const [menu, setMenu] = useState(false);
  const [glass, setGlass] = useState(false);

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

        /* headings + small fades down the page */
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

        /* index rows */
        q(".ix-row").forEach((el) => {
          gsap.fromTo(
            el,
            { autoAlpha: 0, y: 24 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.9,
              ease: "power3.out",
              clearProps: "opacity,visibility,transform",
              scrollTrigger: { trigger: el, start: "top 94%", once: true },
            }
          );
        });

        /* project rows: photo wipes in, text rises, accent photo floats */
        q(".pj").forEach((el) => {
          const main = el.querySelector(".pj-main");
          const img = el.querySelector(".pj-main .im img");
          const acc = el.querySelector(".pj-acc .im");
          const accBox = el.querySelector(".pj-acc");
          const lines = el.querySelectorAll(".pj-txt .ln-i");
          const fds = el.querySelectorAll(".pj-fd");

          const t = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 70%", once: true } });
          t.fromTo(
            main,
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.25, ease: "power3.inOut" },
            0
          );
          has(img) && t.fromTo(img, { scale: 1.35 }, { scale: 1, duration: 1.8, ease: "power3.out" }, 0);
          has(lines) &&
            t.fromTo(
              lines,
              { yPercent: 118 },
              { yPercent: 0, duration: 1.15, ease: "power4.out", stagger: 0.12 },
              0.35
            );
          has(fds) &&
            t.fromTo(
              fds,
              { autoAlpha: 0, y: 20 },
              { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.08 },
              0.6
            );
          acc &&
            t.fromTo(
              acc,
              { clipPath: "inset(100% 0% 0% 0%)" },
              { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "power3.inOut" },
              0.7
            );

          accBox &&
            gsap.fromTo(
              accBox,
              { y: 50 },
              {
                y: -50,
                ease: "none",
                scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
              }
            );
        });
      }
    }, root);

    /* photo hover: zoom from the cursor + glare (mouse only) */
    if (!calm && fine) {
      const st = new WeakMap();
      let hot = null;

      const get = (m) => {
        let s = st.get(m);
        if (!s) {
          s = { im: m.querySelector(".im"), glare: m.querySelector(".pj-glare"), org: { x: 50, y: 50 } };
          st.set(m, s);
        }
        return s;
      };
      const paint = (s) => {
        if (s.im) s.im.style.transformOrigin = `${s.org.x}% ${s.org.y}%`;
      };
      const pos = (m, e) => {
        const r = m.getBoundingClientRect();
        return { x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 };
      };
      const enter = (m, e) => {
        const s = get(m);
        if (!s.im) return;
        const p = pos(m, e);
        s.org.x = p.x;
        s.org.y = p.y;
        paint(s);
        gsap.to(s.im, { scale: 1.1, duration: 1.2, ease: "power3.out", overwrite: "auto" });
        s.glare && gsap.to(s.glare, { autoAlpha: 1, duration: 0.5, overwrite: "auto" });
      };
      const leave = (m) => {
        const s = get(m);
        if (!s.im) return;
        gsap.to(s.im, { scale: 1, duration: 1, ease: "power3.out", overwrite: "auto" });
        s.glare && gsap.to(s.glare, { autoAlpha: 0, duration: 0.5, overwrite: "auto" });
      };
      const move = (m, e) => {
        const s = get(m);
        const p = pos(m, e);
        gsap.to(s.org, {
          x: p.x,
          y: p.y,
          duration: 0.9,
          ease: "power3.out",
          overwrite: true,
          onUpdate: () => paint(s),
        });
        if (s.glare) {
          s.glare.style.setProperty("--mx", p.x + "%");
          s.glare.style.setProperty("--my", p.y + "%");
        }
      };
      const onMove = (e) => {
        if (e.pointerType && e.pointerType !== "mouse") return;
        const m = e.target.closest ? e.target.closest(".pj-main") : null;
        if (m !== hot) {
          if (hot) leave(hot);
          hot = m;
          if (m) enter(m, e);
        }
        if (m) move(m, e);
      };
      const onOut = () => {
        if (hot) leave(hot);
        hot = null;
      };
      root.addEventListener("pointermove", onMove, { passive: true });
      root.addEventListener("pointerleave", onOut);
      cleanups.push(() => {
        root.removeEventListener("pointermove", onMove);
        root.removeEventListener("pointerleave", onOut);
      });
    }

    /* index: a photo preview follows the cursor over each row */
    const ix = ixRef.current;
    const pv = pvRef.current;
    if (!calm && fine && ix && pv) {
      const imgs = Array.from(pv.querySelectorAll(".ix-pi"));
      gsap.set(pv, { autoAlpha: 0 });
      gsap.set(imgs, { autoAlpha: 0 });
      const w = pv.offsetWidth;
      const h = pv.offsetHeight;
      const qx = gsap.quickTo(pv, "x", { duration: 0.55, ease: "power3.out" });
      const qy = gsap.quickTo(pv, "y", { duration: 0.55, ease: "power3.out" });
      let cur = -1;

      const show = (i) => {
        if (i === cur) return;
        const wasHidden = cur === -1;
        cur = i;
        imgs.forEach((im, k) =>
          gsap.to(im, {
            autoAlpha: k === i ? 1 : 0,
            scale: k === i ? 1 : 1.15,
            duration: 0.6,
            ease: "power3.out",
            overwrite: "auto",
          })
        );
        gsap.to(pv, { autoAlpha: i < 0 ? 0 : 1, duration: 0.4, overwrite: "auto" });
        return wasHidden;
      };
      const place = (e) => {
        const left = e.clientX + 28 + w > window.innerWidth;
        const x = left ? e.clientX - w - 28 : e.clientX + 28;
        const y = Math.min(Math.max(e.clientY - h / 2, 8), window.innerHeight - h - 8);
        return { x, y };
      };
      const onMove = (e) => {
        if (e.pointerType && e.pointerType !== "mouse") return;
        const row = e.target.closest ? e.target.closest(".ix-row") : null;
        if (!row) {
          show(-1);
          return;
        }
        const p = place(e);
        if (cur === -1) gsap.set(pv, { x: p.x, y: p.y });
        show(Number(row.dataset.i));
        qx(p.x);
        qy(p.y);
      };
      const hide = () => show(-1);
      ix.addEventListener("pointermove", onMove, { passive: true });
      ix.addEventListener("pointerleave", hide);
      window.addEventListener("scroll", hide, { passive: true });
      cleanups.push(() => {
        ix.removeEventListener("pointermove", onMove);
        ix.removeEventListener("pointerleave", hide);
        window.removeEventListener("scroll", hide);
      });
    }

    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  const repeat = Array.from({ length: 4 });
  const total = PROJECTS.length;

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
            <p className="lbl gh-lbl">Portfolio</p>
            <Hd
              as="h1"
              size="xl"
              className="gh-h"
              lines={["PROJECTS WE", { t: "~CHERISH", c: "l2" }]}
            />
          </div>

          <div className="gh-b">
            <p>
              A selection of homes, workplaces and hospitality spaces we have designed, from the
              first sketch to the last detail.
            </p>
            <span className="gh-count">{pad2(total)} projects</span>
          </div>

          <div className="gh-scroll" aria-hidden="true">
            <span>Scroll</span>
            <i />
          </div>
        </header>

        {/* ----------------------------------------------------------- INDEX */}
        <section className="ix" aria-label="Project index">
          <p className="lbl fd">Index</p>
          <div className="rv ix-hd">
            <Hd size="m" lines={["EVERY ~PROJECT"]} />
          </div>

          <div className="ix-list" ref={ixRef}>
            {PROJECTS.map((p, k) => (
              <a
                key={p.title}
                className="ix-row"
                href={`#p-${k + 1}`}
                data-i={k}
                data-cur="View"
                data-free=""
              >
                <span className="ix-no">{pad2(k + 1)}</span>
                <span className="ix-t">{p.title}</span>
                <span className="ix-pl">{p.place}</span>
                <span className="ix-cat">{p.cat}</span>
                <span className="ix-yr">{p.year}</span>
              </a>
            ))}
          </div>

          <div className="ix-pv" ref={pvRef} aria-hidden="true">
            {PROJECTS.map((p) => (
              <img key={p.title} className="ix-pi" src={ph(p.p, 700)} alt="" draggable="false" />
            ))}
          </div>
        </section>

        {/* -------------------------------------------------------- PROJECTS */}
        <section className="pjs" aria-label="Projects">
          {PROJECTS.map((p, k) => (
            <article key={p.title} className={`pj ${k % 2 ? "pj-r" : ""}`} id={`p-${k + 1}`}>
              <div className="pj-media">
                <div className="pj-main">
                  <Img src={ph(p.p, 1600)} alt={`${p.title}, ${p.place}`} tone={k} />
                  <span className="pj-glare" />
                  <i className="tb tb1" />
                  <i className="tb tb2" />
                  <i className="tb tb3" />
                  <i className="tb tb4" />
                </div>
                <figure className="pj-acc">
                  <Img src={ph(p.a, 700)} alt="" tone={k + 2} />
                </figure>
              </div>

              <div className="pj-txt">
                <div className="pj-meta pj-fd">
                  <span>
                    {pad2(k + 1)}/{pad2(total)}
                  </span>
                  <span>{p.cat}</span>
                </div>
                <Hd size="s" lines={["~" + p.title.toUpperCase()]} />
                <p className="pj-pl pj-fd">
                  {p.place}, {p.year}
                </p>
                <p className="pj-desc pj-fd">{p.desc}</p>
                <dl className="pj-dl pj-fd">
                  <div>
                    <dt>Brief</dt>
                    <dd>{p.brief}</dd>
                  </div>
                  <div>
                    <dt>Palette</dt>
                    <dd>{p.palette}</dd>
                  </div>
                  <div>
                    <dt>Scope</dt>
                    <dd>{p.scope}</dd>
                  </div>
                </dl>
                <a className="lnk pj-fd" href={CONTACT} data-cur="Talk">
                  Start a similar project <Arrow />
                </a>
              </div>
            </article>
          ))}
        </section>

        {/* -------------------------------------------------------------- CTA */}
        <section className="cta">
          <p className="lbl fd">Next project</p>
          <div className="rv">
            <Hd size="l" lines={["YOURS COULD BE", "THE ~NEXT ONE"]} />
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
.ai :where(h1,h2,h3,h4,p,ul,figure,dl,dd){margin:0;padding:0}
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
.hd-s{font-size:clamp(28px,3.7vw,74px)}
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

/* ---- index ---- */
.ix{position:relative;padding:14vh var(--pad) 12vh;background:var(--bg2)}
.ix-hd{margin-top:1.4vh}
.ix-list{margin-top:7vh;border-top:1px solid var(--line)}
.ix-row{display:grid;grid-template-columns:5vw minmax(0,1fr) 14vw 12vw 5vw;align-items:baseline;column-gap:1.4vw;
  padding:2.6vh 0;border-bottom:1px solid var(--line);transition:opacity .45s ease}
.ix-list:hover .ix-row:not(:hover){opacity:.36}
.ix-no{font-family:var(--mono);font-size:.8em;letter-spacing:.1em;color:var(--acc)}
.ix-t{font-family:var(--serif);font-weight:600;text-transform:uppercase;font-size:clamp(24px,3.2vw,62px);line-height:1;
  transition:transform .7s cubic-bezier(.2,.7,.2,1),color .45s}
.ix-row:hover .ix-t{transform:translateX(1.2vw);color:var(--acc)}
.ix-pl,.ix-cat,.ix-yr{color:var(--mute);text-transform:uppercase;letter-spacing:.01em}
.ix-yr{text-align:right}
.ix-pv{position:fixed;left:0;top:0;z-index:400;width:min(19vw,340px);aspect-ratio:4/5;overflow:hidden;pointer-events:none;
  background:#0d0907;box-shadow:0 30px 70px rgba(0,0,0,.5)}
.ix-pi{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}

/* ---- projects ---- */
.pjs{padding:12vh 0 4vh;background:var(--bg)}
.pj{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:2.1vw;padding:0 var(--pad);
  margin-bottom:18vh;scroll-margin-top:calc(max(var(--nav-h),52px) + 2vh)}
.pj:last-child{margin-bottom:8vh}
.pj-media{grid-column:1 / span 7;grid-row:1;position:relative}
.pj-txt{grid-column:9 / span 4;grid-row:1;align-self:start;position:sticky;top:calc(max(var(--nav-h),52px) + 5vh);padding-top:1vh}
.pj-r .pj-media{grid-column:6 / span 7}
.pj-r .pj-txt{grid-column:1 / span 4}

.pj-main{position:relative;height:clamp(420px,84vh,920px);overflow:hidden;background:#0d0907}
.pj-main .im{position:absolute;inset:0}
.pj-glare{position:absolute;inset:0;opacity:0;visibility:hidden;pointer-events:none;mix-blend-mode:soft-light;
  background:radial-gradient(circle at var(--mx,50%) var(--my,50%),rgba(255,222,180,.9),rgba(255,222,180,0) 55%)}
.tb{position:absolute;display:block;width:14px;height:14px;border:1px solid var(--acc);opacity:0;pointer-events:none;
  transition:opacity .4s ease,transform .6s cubic-bezier(.2,.7,.2,1)}
.tb1{left:14px;top:14px;border-right:0;border-bottom:0;transform:translate(8px,8px)}
.tb2{right:14px;top:14px;border-left:0;border-bottom:0;transform:translate(-8px,8px)}
.tb3{left:14px;bottom:14px;border-right:0;border-top:0;transform:translate(8px,-8px)}
.tb4{right:14px;bottom:14px;border-left:0;border-top:0;transform:translate(-8px,-8px)}
.pj-main:hover .tb{opacity:1;transform:none}

.pj-acc{position:absolute;z-index:3;width:30%;aspect-ratio:4/5;right:-9%;bottom:-7vh;box-shadow:0 26px 60px rgba(0,0,0,.45)}
.pj-r .pj-acc{right:auto;left:-9%}
.pj-acc .im{position:absolute;inset:0}

.pj-meta{display:flex;justify-content:space-between;color:var(--mute);margin-bottom:3vh;text-transform:uppercase}
.pj-pl{margin-top:2.4vh;color:var(--acc);text-transform:uppercase;letter-spacing:.02em}
.pj-desc{margin-top:3.2vh;max-width:36ch;color:var(--mute);line-height:1.55}
.pj-dl{margin-top:5vh;border-top:1px solid var(--line);max-width:36ch}
.pj-dl > div{display:grid;grid-template-columns:5.6em 1fr;gap:1em;padding:1.4vh 0;border-bottom:1px solid var(--line);line-height:1.45}
.pj-dl dt{color:var(--mute);text-transform:uppercase;font-size:.86em;letter-spacing:.03em;padding-top:.1em}
.pj-dl dd{color:var(--ink)}
.pj-txt .lnk{margin-top:5vh;min-width:min(19vw,340px)}

/* ---- CTA ---- */
.cta{padding:16vh var(--pad) 14vh;background:var(--bg2);display:flex;flex-direction:column;align-items:flex-start}
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
  .hd-xl{font-size:16vw}.hd-l{font-size:12vw}.hd-m{font-size:10vw}.hd-s{font-size:10vw}
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

  .ix{padding:10vh var(--pad) 8vh}
  .ix-list{margin-top:5vh}
  .ix-row{grid-template-columns:9vw minmax(0,1fr) auto;row-gap:.4em;padding:2.2vh 0}
  .ix-t{font-size:7.4vw}
  .ix-pl,.ix-cat{display:none}
  .ix-yr{grid-column:3}
  .ix-pv{display:none}

  .pjs{padding:8vh 0 2vh}
  .pj{display:block;margin-bottom:11vh}
  .pj-media,.pj-r .pj-media{margin-bottom:8vh}
  .pj-main{height:56vh}
  .pj-acc,.pj-r .pj-acc{width:36%;right:4vw;left:auto;bottom:-5vh}
  .pj-txt,.pj-r .pj-txt{position:static}
  .pj-desc,.pj-dl{max-width:none}
  .pj-txt .lnk{min-width:min(60vw,340px)}

  .cta{padding:10vh var(--pad) 9vh}
  .cta .lnk{min-width:min(60vw,340px)}

  .ft{min-height:auto;padding-bottom:1vh}
  .ft-top{flex-direction:column;gap:5vh;padding:6vh var(--pad) 5vh}
  .ft-cols{grid-template-columns:1fr;row-gap:4vh}
  .ft-col{grid-template-columns:28vw 1fr}
  .ft-col ul{max-width:none}
  .mq-t{font-size:14vw}.mq-s{font-size:5vw;margin:0 6vw}
}

/* touch: no hover, so no cursor-driven extras */
@media (hover:none){
  .pj-glare,.tb{display:none}
  .ix-pv{display:none}
}

@media (prefers-reduced-motion:reduce){
  .ai *,.ai *::before,.ai *::after{transition-duration:.01ms!important;animation:none!important}
}
`;