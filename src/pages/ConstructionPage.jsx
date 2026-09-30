"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";

/* ========================================================================== */
/*  CONTENT (edit here)                                                       */
/* ========================================================================== */

const SITE = {
  name: "Asrani Interiors",
  email: "hello@asraniinteriors.com",
  phone: "+91 98765 43210",
  address: ["12 Studio Lane, Design District", "India"],
  socials: [["Instagram", "#"], ["Pinterest", "#"], ["Behance", "#"], ["LinkedIn", "#"]],
};

const NAV = [
  ["About us", "/#about"],
  ["Portfolio", "/#portfolio"],
  ["Gallery", "/gallery"],
  ["Services", "/#services"],
  ["Journal", "/#journal"],
];

/* Same key as the landing page contact form (Web3Forms, safe to be public). */
const WEB3FORMS_KEY = "c8bc3566-dcc7-4816-9eec-7041e99f6ad3";

/* Unsplash placeholders. Replace with real site photos.
 * Any image that fails to load is dropped automatically. */
const u = (id, w = 1400) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const WORKS = [
  { id: "1503387762-592deb58ef4e", title: "Foundation & Planning", place: "Jaipur", year: 2024, desc: "Detailed drawings, layout and foundation work, done right before anything rises." },
  { id: "1504307651254-35680f356dfd", title: "Structure Going Up", place: "Ahmedabad", year: 2024, desc: "Column, beam and slab work with strict quality checks at every stage." },
  { id: "1541888946425-d81bb19240f5", title: "On-Site Supervision", place: "Delhi", year: 2023, desc: "Our engineers on site daily, so the build matches the plan." },
  { id: "1531834685032-c34bf0d84c77", title: "Skilled Craftsmen", place: "Mumbai", year: 2023, desc: "Trusted masons and site teams who treat every wall like their own." },
  { id: "1600585154340-be6161a56a0c", title: "Finished Residence", place: "Udaipur", year: 2024, desc: "A home built from the ground up around how the family lives." },
  { id: "1600607687939-ce8a6c25118c", title: "Modern Villa", place: "Goa", year: 2023, desc: "Open sightlines and honest materials, from structure to finish." },
  { id: "1600566753376-12c8ab7fb75b", title: "Family Home", place: "Pune", year: 2022, desc: "Planning, construction and handover, all under one roof." },
  { id: "1600210492486-724fe5c67fb0", title: "Turnkey Project", place: "Surat", year: 2022, desc: "Construction and interiors delivered as one seamless project." },
].map((w, i) => ({ ...w, k: i }));

/* Tile shapes repeat in this order so the 4-column grid always packs neatly */
const SEQ = ["big", "tall", "tall", "wide", "sq", "sq", "tall", "big", "tall"];

const SERVICES = ["New home construction", "Commercial construction", "Renovation / Remodelling", "Consultancy only", "Other"];

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

function useReveal(ref) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const els = root.querySelectorAll(".rv");
    if (!("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (list) =>
        list.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        }),
      { threshold: 0.08 }
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [ref]);
}

/* ========================================================================== */
/*  CONSTRUCTION / DRAFTING CURSOR  (same as landing + gallery)               */
/* ========================================================================== */

const CUR_SEL = "a, button, input, textarea, select, [data-cur]";
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
/*  CONSULTANCY FORM                                                          */
/* ========================================================================== */

function ConsultForm() {
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const d = Object.fromEntries(new FormData(form).entries());
    if (d.botcheck) {
      setStatus("sent");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Construction consultancy enquiry from ${d.name} — ${SITE.name}`,
          from_name: SITE.name,
          name: d.name,
          phone: d.phone || "-",
          email: d.email || "-",
          service: d.service || "-",
          city_plot: d.city || "-",
          message: d.message || "-",
          botcheck: "",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setStatus("sent");
        form.reset();
      } else setStatus("error");
    } catch {
      setStatus("error");
    }
  };
  const busy = status === "sending";
  return (
    <form className="cf" onSubmit={onSubmit}>
      <input type="text" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" className="cf-hp" />
      <label className="fld">
        <input name="name" placeholder="Name" aria-label="Name" autoComplete="name" required />
      </label>
      <div className="cf-2">
        <label className="fld">
          <input name="phone" type="tel" placeholder="Phone" aria-label="Phone" autoComplete="tel" required />
        </label>
        <label className="fld">
          <input name="email" type="email" placeholder="Email (optional)" aria-label="Email" autoComplete="email" />
        </label>
      </div>
      <div className="cf-2">
        <label className="fld">
          <select name="service" defaultValue="" aria-label="Service needed" data-cur="Choose" required>
            <option value="" disabled>What do you need?</option>
            {SERVICES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className="fld">
          <input name="city" placeholder="City / plot size" aria-label="City or plot size" />
        </label>
      </div>
      <label className="fld fld-ta">
        <textarea name="message" rows={4} placeholder="Tell us about your project, budget and timeline" aria-label="Message" />
      </label>
      <button type="submit" className="lnk cf-send" data-cur="Send" disabled={busy} aria-busy={busy}>
        {busy ? "Sending…" : "Book consultation"} <Arrow />
      </button>
      <p className={`cf-ok ${status === "sent" || status === "error" ? "show" : ""} ${status === "error" ? "cf-bad" : ""}`} role="status" aria-live="polite">
        {status === "sent"
          ? "Thank you. Our team will call you within one working day."
          : status === "error"
            ? `Couldn’t send right now. Please try again or email ${SITE.email}.`
            : ""}
      </p>
    </form>
  );
}

/* ========================================================================== */
/*  PAGE                                                                      */
/* ========================================================================== */

export default function ConstructionPage() {
  const rootRef = useRef(null);
  const [menu, setMenu] = useState(false);
  const [glass, setGlass] = useState(false);
  const [bad, setBad] = useState(() => new Set());
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const touch = useRef({ x: 0, y: 0 });

  useReveal(rootRef);

  const live = useMemo(() => WORKS.filter((w) => !bad.has(w.k)), [bad]);
  const cur = live[Math.min(idx, Math.max(live.length - 1, 0))];

  const onBad = (k) =>
    setBad((s) => {
      if (s.has(k)) return s;
      const n = new Set(s);
      n.add(k);
      return n;
    });

  useEffect(() => {
    window.scrollTo(0, 0);
    const onScroll = () => setGlass(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const step = (d) => setIdx((i) => (i + d + live.length) % live.length);
  const close = () => setOpen(false);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, live.length]);

  useEffect(() => {
    if (!open || live.length < 2) return;
    [1, -1].forEach((d) => {
      const w = live[(idx + d + live.length) % live.length];
      if (w) new Image().src = u(w.id, 1800);
    });
  }, [open, idx, live]);

  const onTS = (e) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTE = (e) => {
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    if (Math.abs(dx) > 46 && Math.abs(dx) > Math.abs(dy) * 1.3) step(dx < 0 ? 1 : -1);
    else if (dy > 90 && Math.abs(dy) > Math.abs(dx) * 1.3) close();
  };

  return (
    <div className="ai" ref={rootRef}>
      <style>{CSS}</style>

      {/* NAV */}
      <nav className={`nav ${glass ? "nav-glass" : ""}`} aria-label="Primary">
        <a className="brand" href="/" data-cur="Home">{SITE.name}</a>
        <ul className="nav-l">
          {NAV.map(([label, href]) => (
            <li key={label}><a href={href} data-cur="Go">{label}</a></li>
          ))}
        </ul>
        <a className="nav-c" href="#consult" data-cur="Talk">Consult</a>
        <button className="menu-btn" aria-expanded={menu} aria-label={menu ? "Close menu" : "Open menu"} onClick={() => setMenu((v) => !v)}>
          <span className={`bg ${menu ? "open" : ""}`}><i /><i /></span>
        </button>
      </nav>
      <div className={`mnav ${menu ? "open" : ""}`} aria-hidden={!menu}>
        <ul>
          <li><a href="/" onClick={() => setMenu(false)}>Home</a></li>
          {NAV.map(([label, href]) => (
            <li key={label}><a href={href} onClick={() => setMenu(false)}>{label}</a></li>
          ))}
          <li><a href="#consult" onClick={() => setMenu(false)}>Consult</a></li>
        </ul>
      </div>

      <main>
        {/* CONSULTANCY: HERO + FORM */}
        <section className="ch" id="consult">
          <div className="ch-shade" />
          <div className="ch-grid" />
          <div className="ch-in">
            <div className="ch-l">
              <p className="lbl">01 — Construction</p>
              <h1 className="hd">
                BUILD IT<br />
                <span className="sw">R</span>IGHT,<br />
                <span className="sw">F</span>ROM DAY ONE
              </h1>
              <p className="ch-p">
                From plot planning and structure to the final finish, our engineers and site teams
                build your home around how you live. Share a few details and book a free
                consultation. We will call you back within one working day.
              </p>
              <ul className="ch-pts">
                <li>Planning &amp; design approvals</li>
                <li>Civil work &amp; daily site supervision</li>
                <li>Turnkey: construction + interiors</li>
              </ul>
            </div>
            <div className="cf-card">
              <ConsultForm />
            </div>
          </div>
        </section>

        {/* GALLERY */}
        <section className="gl" aria-label="Construction photos">
          <header className="gl-head rv">
            <p className="lbl">Our Work</p>
            <h2 className="hd hd-m">CONSTRUCTION <span className="sw">G</span>ALLERY</h2>
            <span className="gl-n">{pad2(live.length)} frames</span>
          </header>
          <div className="gl-grid">
            {live.map((w, k) => (
              <figure key={w.k} className={`tile t-${SEQ[k % SEQ.length]} rv`}>
                <button
                  type="button"
                  className="tile-b"
                  data-cur="View"
                  data-free=""
                  aria-label={`Open ${w.title}, ${w.place}`}
                  onClick={() => {
                    setIdx(k);
                    setOpen(true);
                  }}
                >
                  <img src={u(w.id, 1000)} alt={`${w.title}, ${w.place}`} loading="lazy" decoding="async" draggable="false" onError={() => onBad(w.k)} />
                  <span className="tile-shade" />
                  <span className="tile-no">{pad2(k + 1)}</span>
                  <i className="tb tb1" />
                  <i className="tb tb2" />
                  <i className="tb tb3" />
                  <i className="tb tb4" />
                  <span className="tile-cap">
                    <span className="tile-cat">Construction</span>
                    <span className="tile-t">{w.title}</span>
                    <span className="tile-pl">{w.place}, {w.year}</span>
                  </span>
                </button>
              </figure>
            ))}
          </div>
          <div className="gl-cta rv">
            <a
              className="lnk"
              href="#consult"
              data-cur="Talk"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("consult")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Book a free consultation <Arrow />
            </a>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="ft">
        <div className="ft-top">
          <a className="ft-logo" href="/" data-cur="Home">{SITE.name}</a>
          <div className="ft-cols">
            <div className="ft-col">
              <span className="ft-h">Follow us</span>
              <ul>{SITE.socials.map(([l, h]) => (<li key={l}><a href={h}>{l}</a></li>))}</ul>
            </div>
            <div className="ft-col">
              <span className="ft-h">Contact</span>
              <ul>
                <li>{SITE.address.join(", ")}</li>
                <li><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
                <li><a href={`tel:${SITE.phone.replace(/\s/g, "")}`}>{SITE.phone}</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* VIEWER */}
      {open && cur && (
        <div className="lb" role="dialog" aria-modal="true" aria-label="Photo viewer">
          <div className="lb-bg" onClick={close} />
          <div className="lb-top">
            <span className="lb-brand">{SITE.name}</span>
            <button type="button" className="lb-x" data-cur="Close" onClick={close}>Close <i /></button>
          </div>
          <div className="lb-main">
            <div className="lb-fig" onTouchStart={onTS} onTouchEnd={onTE}>
              <img key={cur.k} src={u(cur.id, 1800)} alt={cur.title} draggable="false" />
            </div>
            <aside className="lb-info">
              <p className="lb-cnt">{pad2(Math.min(idx, live.length - 1) + 1)} / {pad2(live.length)}</p>
              <p className="lbl">Construction — {cur.place}, {cur.year}</p>
              <h3 className="lb-t">{cur.title}</h3>
              <p className="lb-d">{cur.desc}</p>
              <div className="lb-ctl">
                <button type="button" className="rb" aria-label="Previous photo" data-cur="Prev" onClick={() => step(-1)}>
                  <span className="rb-flip"><Arrow /></span>
                </button>
                <button type="button" className="rb rb-on" aria-label="Next photo" data-cur="Next" onClick={() => step(1)}>
                  <Arrow />
                </button>
              </div>
            </aside>
          </div>
        </div>
      )}

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
.ai{--bg:#14100d;--bg2:#191310;--card:#221a14;--ink:#f2e9dc;--mute:rgba(242,233,220,.58);--line:rgba(242,233,220,.17);--acc:#d2a679;
  --pad:2.1vw;--nav-h:6.5vh;
  --serif:"Cormorant Garamond",Georgia,serif;--sans:"Instrument Sans",system-ui,sans-serif;--swash:"Bilbo Swash Caps","Cormorant Garamond",cursive;
  --mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  color:var(--ink);background:var(--bg);font-family:var(--sans);font-size:clamp(12.5px,1.05vw,17px);line-height:1.4;
  -webkit-font-smoothing:antialiased;position:relative}
.ai *,.ai *::before,.ai *::after{box-sizing:border-box}
.ai :where(h1,h2,h3,p,ul,figure){margin:0;padding:0}
.ai :where(ul){list-style:none}
.ai :where(a){color:inherit;text-decoration:none}
.ai :where(button){font:inherit;color:inherit;background:none;border:0;cursor:pointer;padding:0;text-align:inherit}
.ai img{display:block;max-width:none}
.ai :focus-visible{outline:1px solid var(--acc);outline-offset:4px}

.hd{font-family:var(--serif);font-weight:600;text-transform:uppercase;line-height:.98;font-size:clamp(34px,5.6vw,108px)}
.hd-m{font-size:clamp(30px,4.6vw,90px)}
.sw{font-family:var(--swash);font-weight:400;font-size:1.3em;line-height:0;text-transform:none;margin-right:-.045em}
.lbl{font-size:.95em;color:var(--mute);text-transform:uppercase;letter-spacing:.01em}
.lnk{display:inline-flex;align-items:center;justify-content:space-between;gap:2em;min-width:min(20vw,340px);padding-bottom:.6em;
  border-bottom:1px solid currentColor;text-transform:uppercase;font-weight:500;transition:color .45s,transform .45s cubic-bezier(.2,.7,.2,1)}
.lnk:hover{color:var(--acc);transform:translateX(.25em)}
.arw{width:1.7em;height:.85em;flex:none}

.rv{opacity:0;transform:translateY(24px);transition:opacity .9s ease,transform .9s cubic-bezier(.2,.7,.2,1)}
.rv.in{opacity:1;transform:none}

/* nav */
.nav{position:fixed;left:0;right:0;top:0;height:var(--nav-h);min-height:52px;display:flex;align-items:center;padding:0 var(--pad);z-index:200;
  background:linear-gradient(180deg,rgba(10,7,5,.5),rgba(10,7,5,0));border-bottom:1px solid transparent;transition:background .5s,border-color .5s,box-shadow .5s}
.nav.nav-glass{background:rgba(20,16,13,.6);-webkit-backdrop-filter:blur(18px) saturate(150%);backdrop-filter:blur(18px) saturate(150%);
  border-bottom:1px solid rgba(242,233,220,.12);box-shadow:0 8px 32px rgba(0,0,0,.28)}
.brand{font-family:var(--serif);font-weight:700;font-size:1.4em;letter-spacing:.09em;text-transform:uppercase;width:calc(50vw - var(--pad));white-space:nowrap;flex:none}
.nav-l{display:flex;gap:2.65vw;flex:1;text-transform:uppercase;font-weight:500}
.nav-l a{display:inline-block;padding:.15em 0;transition:color .35s}
.nav-l a:hover,.nav-c:hover{color:var(--acc)}
.nav-c{text-transform:uppercase;font-weight:500;flex:none;transition:color .35s}
.menu-btn{display:none;flex:none;width:34px;height:34px;place-items:center}
.menu-btn .bg{position:relative;width:22px;height:14px;display:block}
.menu-btn .bg i{position:absolute;left:0;right:0;height:1.5px;background:var(--ink);transition:transform .4s,top .4s}
.menu-btn .bg i:first-child{top:0}
.menu-btn .bg i:last-child{top:100%;transform:translateY(-100%)}
.menu-btn .bg.open i:first-child{top:50%;transform:translateY(-50%) rotate(45deg)}
.menu-btn .bg.open i:last-child{top:50%;transform:translateY(-50%) rotate(-45deg)}
.mnav{position:fixed;inset:0;z-index:190;background:rgba(14,10,8,.9);-webkit-backdrop-filter:blur(22px);backdrop-filter:blur(22px);
  display:none;align-items:center;justify-content:center;opacity:0;visibility:hidden;transition:opacity .45s,visibility .45s}
.mnav.open{opacity:1;visibility:visible}
.mnav ul{display:grid;gap:2.4vh;text-align:center}
.mnav a{font-family:var(--serif);font-weight:600;text-transform:uppercase;font-size:11vw;line-height:1.1}

/* consult hero */
.ch{position:relative;min-height:100vh;min-height:100svh;background:#0d0907;overflow:hidden;display:flex;align-items:center}
.ch-shade{position:absolute;inset:0;background:radial-gradient(ellipse at 20% 30%,rgba(210,166,121,.14),transparent 60%),linear-gradient(180deg,rgba(12,8,6,.4),rgba(12,8,6,.85))}
.ch-grid{position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(rgba(242,233,220,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(242,233,220,.05) 1px,transparent 1px);
  background-size:8vw 8vw;-webkit-mask-image:linear-gradient(180deg,transparent,#000 25%,#000 75%,transparent);mask-image:linear-gradient(180deg,transparent,#000 25%,#000 75%,transparent)}
.ch-in{position:relative;z-index:2;width:100%;display:grid;grid-template-columns:1.1fr 1fr;gap:4vw;align-items:center;padding:calc(var(--nav-h) + 5vh) var(--pad) 6vh}
.ch-l .lbl{margin-bottom:2vh}
.ch-p{margin-top:4vh;max-width:min(34vw,520px);color:var(--mute);line-height:1.55}
.ch-pts{margin-top:3vh;display:grid;gap:1vh;color:var(--ink);text-transform:uppercase;font-size:.88em;letter-spacing:.03em}
.ch-pts li::before{content:"✦";color:var(--acc);margin-right:.8em}

/* form */
.cf-card{background:rgba(242,233,220,.05);border:1px solid rgba(242,233,220,.1);border-radius:14px;padding:clamp(20px,2.2vw,40px);max-width:640px;width:100%;justify-self:end;
  -webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}
.cf{position:relative}
.cf-2{display:grid;grid-template-columns:1fr 1fr;gap:1.6vw}
.fld{display:block;margin-top:1.6vh}
.fld input,.fld textarea,.fld select{width:100%;display:block;background:transparent;border:0;border-bottom:1px solid rgba(242,233,220,.42);color:var(--ink);
  font:inherit;padding:.85em .15em;outline:none;border-radius:0;transition:border-color .3s,box-shadow .3s}
.fld select{appearance:none;-webkit-appearance:none;cursor:pointer}
.fld select option{background:#221a14;color:var(--ink)}
.fld select:invalid{color:var(--mute)}
.fld input::placeholder,.fld textarea::placeholder{color:var(--mute)}
.fld input:focus,.fld textarea:focus,.fld select:focus{border-color:var(--acc);box-shadow:0 1px 8px rgba(210,166,121,.35)}
.fld-ta textarea{border:1px solid rgba(242,233,220,.42);padding:.9em .85em;resize:none;border-radius:6px}
.cf-send{margin-top:3.4vh;min-width:min(20vw,340px)}
.cf-send:disabled{opacity:.55;cursor:progress}
.cf-hp{position:absolute;left:-9999px;width:1px;height:1px;opacity:0;pointer-events:none}
.cf-ok{margin-top:1.4vh;color:var(--acc);min-height:1.4em;opacity:0;transition:opacity .5s}
.cf-ok.show{opacity:1}
.cf-ok.cf-bad{color:#e39a89}

/* gallery */
.gl{position:relative;padding:12vh var(--pad) 10vh;background:var(--bg2)}
.gl-head{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:2vh 2vw;margin-bottom:5vh}
.gl-head .lbl{flex-basis:100%;margin-bottom:-1vh}
.gl-n{font-family:var(--mono);font-size:.78em;letter-spacing:.12em;text-transform:uppercase;color:var(--acc)}
.gl-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));grid-auto-rows:clamp(150px,13.6vw,320px);grid-auto-flow:row dense;gap:1.1vw}
.t-tall{grid-row:span 2}.t-wide{grid-column:span 2}.t-big{grid-column:span 2;grid-row:span 2}
.tile{position:relative;min-width:0;min-height:0;overflow:hidden;background:linear-gradient(155deg,#3a2a1f,#140e0a)}
.tile-b{position:absolute;inset:0;display:block;width:100%;height:100%;-webkit-tap-highlight-color:transparent}
.tile-b img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform 1.2s cubic-bezier(.2,.7,.2,1)}
.tile:hover .tile-b img{transform:scale(1.08)}
.tile-shade{position:absolute;inset:0;opacity:0;transition:opacity .6s;background:linear-gradient(180deg,rgba(12,8,6,.22),rgba(12,8,6,0) 32%,rgba(12,8,6,.82))}
.tile-no{position:absolute;left:1.1vw;top:1.1vw;font-family:var(--mono);font-size:.72em;letter-spacing:.1em;text-shadow:0 0 10px rgba(10,7,5,.7);opacity:.8}
.tb{position:absolute;display:block;width:14px;height:14px;border:1px solid var(--acc);opacity:0;transition:opacity .4s ease,transform .6s cubic-bezier(.2,.7,.2,1)}
.tb1{left:12px;top:12px;border-right:0;border-bottom:0;transform:translate(8px,8px)}
.tb2{right:12px;top:12px;border-left:0;border-bottom:0;transform:translate(-8px,8px)}
.tb3{left:12px;bottom:12px;border-right:0;border-top:0;transform:translate(8px,-8px)}
.tb4{right:12px;bottom:12px;border-left:0;border-top:0;transform:translate(-8px,-8px)}
.tile:hover .tb,.tile-b:focus-visible .tb{opacity:1;transform:none}
.tile-cap{position:absolute;left:1.3vw;right:1.3vw;bottom:1.3vw;display:block;transform:translateY(16px);opacity:0;transition:transform .7s cubic-bezier(.2,.7,.2,1),opacity .5s}
.tile-cat{display:block;font-family:var(--mono);font-size:.7em;letter-spacing:.12em;text-transform:uppercase;color:var(--acc)}
.tile-t{display:block;margin-top:.55em;font-family:var(--serif);font-weight:600;text-transform:uppercase;font-size:clamp(18px,1.9vw,36px);line-height:1}
.tile-pl{display:block;margin-top:.6em;color:var(--mute);font-size:.88em}
.tile:hover .tile-shade,.tile-b:focus-visible .tile-shade{opacity:1}
.tile:hover .tile-cap,.tile-b:focus-visible .tile-cap{transform:none;opacity:1}
.gl-cta{margin-top:8vh}

/* footer */
.ft{background:#1b1511}
.ft-top{display:flex;flex-wrap:wrap;justify-content:space-between;gap:4vh;padding:6vh var(--pad)}
.ft-logo{font-family:var(--serif);font-weight:700;letter-spacing:.09em;text-transform:uppercase;font-size:1.3em;transition:color .35s}
.ft-logo:hover,.ft-col a:hover{color:var(--acc)}
.ft-cols{display:grid;grid-template-columns:repeat(2,auto);column-gap:4.2vw}
.ft-col{display:grid;grid-template-columns:auto 1fr;column-gap:2.6vw;align-items:start;font-weight:500;text-transform:uppercase;font-size:.92em;line-height:1.6}
.ft-h{color:var(--mute);font-weight:400}
.ft-col ul{display:grid;gap:.8em;max-width:min(16vw,240px)}

/* round buttons */
.rb{width:4.1vw;height:4.1vw;min-width:44px;min-height:44px;max-width:58px;max-height:58px;border-radius:50%;border:1px solid var(--line);display:grid;place-items:center;transition:background .45s,color .45s,border-color .45s}
.rb .arw{width:1.5em}
.rb-flip{display:grid;place-items:center;transform:scaleX(-1)}
.rb:hover{background:var(--ink);color:var(--bg);border-color:var(--ink)}
.rb-on{background:var(--acc);color:#1a120c;border-color:var(--acc)}

/* viewer */
.lb{position:fixed;inset:0;z-index:500;animation:lbin .5s ease both}
@keyframes lbin{from{opacity:0}to{opacity:1}}
.lb-bg{position:absolute;inset:0;background:rgba(12,8,6,.96);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px)}
.lb-top{position:absolute;left:0;right:0;top:0;height:max(var(--nav-h),56px);display:flex;align-items:center;justify-content:space-between;padding:0 var(--pad);z-index:30}
.lb-brand{font-family:var(--serif);font-weight:700;font-size:1.4em;letter-spacing:.09em;text-transform:uppercase}
.lb-x{display:inline-flex;align-items:center;gap:.8em;text-transform:uppercase;font-weight:500;padding:.6em 0;transition:color .35s}
.lb-x:hover{color:var(--acc)}
.lb-x i{position:relative;display:block;width:20px;height:20px}
.lb-x i::before,.lb-x i::after{content:"";position:absolute;left:0;right:0;top:50%;height:1.5px;background:currentColor;transform:rotate(45deg)}
.lb-x i::after{transform:rotate(-45deg)}
.lb-main{position:absolute;inset:0;z-index:10;padding:calc(max(var(--nav-h),56px) + 1vh) var(--pad) 3.4vh;display:grid;grid-template-columns:minmax(0,1fr) min(25vw,420px);grid-template-rows:minmax(0,1fr);gap:2.4vw}
.lb-fig{position:relative;min-height:0;overflow:hidden;background:#0d0907;touch-action:pan-y}
.lb-fig img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;animation:lbimg 1s cubic-bezier(.2,.7,.2,1) both}
@keyframes lbimg{from{opacity:0;transform:scale(1.08)}to{opacity:1;transform:none}}
.lb-info{display:flex;flex-direction:column;justify-content:center;gap:1.6vh;min-height:0}
.lb-cnt{font-family:var(--mono);font-size:.82em;letter-spacing:.12em;color:var(--acc)}
.lb-t{font-family:var(--serif);font-weight:600;text-transform:uppercase;font-size:clamp(30px,3.6vw,70px);line-height:.98}
.lb-d{max-width:34ch;color:var(--mute);line-height:1.55}
.lb-ctl{display:flex;gap:.9vw;margin-top:3vh}

/* cursor */
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

/* mobile */
@media (max-width:900px){
  .ai{font-size:15px;--pad:5.6vw;--nav-h:60px}
  .hd{font-size:12vw}.hd-m{font-size:10vw}
  .lnk,.cf-send{min-width:min(70vw,340px)}
  .mnav{display:flex}.menu-btn{display:grid}
  .nav{background:rgba(20,16,13,.55);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);border-bottom:1px solid rgba(242,233,220,.08)}
  .brand{width:auto;flex:1;font-size:1.2em}.nav-l,.nav-c{display:none}
  .ch{min-height:auto}
  .ch-in{grid-template-columns:1fr;gap:5vh;padding:calc(var(--nav-h) + 4vh) var(--pad) 6vh}
  .ch-p{max-width:none}
  .ch-grid{background-size:16vw 16vw}
  .cf-card{padding:6vw;max-width:none;justify-self:stretch}
  .cf-2{grid-template-columns:1fr;gap:0}
  .gl{padding:8vh var(--pad) 8vh}
  .gl-grid{grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-rows:44vw;gap:2.4vw}
  .tile-no{left:3vw;top:3vw}
  .tile-cap{left:3vw;right:3vw;bottom:3vw}
  .ft-top{flex-direction:column}
  .ft-cols{grid-template-columns:1fr;row-gap:4vh}
  .ft-col{grid-template-columns:28vw 1fr}.ft-col ul{max-width:none}
  .lb-main{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr) auto;gap:2vh;padding:calc(56px + 1vh) var(--pad) 3vh}
  .lb-info{justify-content:flex-start;gap:1vh}
  .lb-d{display:none}.lb-t{font-size:9vw}
  .lb-ctl{gap:10px;margin-top:1vh}
  .rb{width:50px;height:50px}
}
@media (hover:none){
  .tile-shade{opacity:1}
  .tile-cap{opacity:1;transform:none}
  .tile-pl,.tb{display:none}
}
@media (prefers-reduced-motion:reduce){
  .ai *,.ai *::before,.ai *::after{transition-duration:.01ms!important;animation:none!important}
  .rv{opacity:1;transform:none}
}
`;