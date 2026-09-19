import { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "Studio", href: "#studio" },
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "Materials", href: "#materials" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // lock body scroll when mobile sidebar is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between
          transition-all duration-500 ease-out border-b
          ${scrolled
            ? "py-3 px-6 md:px-12 bg-[#0E0D0C]/85 backdrop-blur-xl border-[#2A2621]"
            : "py-5 px-6 md:px-12 bg-transparent border-transparent"
          }`}
      >
        {/* Brand */}
        <a
          href="#"
          className="flex items-baseline gap-2 rounded-sm outline-none
            focus-visible:ring-1 focus-visible:ring-[#C9A66B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0D0C]"
        >
          <span className="font-serif text-lg md:text-xl leading-none tracking-wide text-[#EDE7DD]">
            FORMA
          </span>
          <span className="hidden sm:inline text-[0.6rem] leading-none tracking-[0.16em] text-[#8C8579] font-sans">
            INTERIORS &amp; CONSTRUCTION
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="relative pb-1.5 text-sm font-medium text-[#EDE7DD] hover:text-[#C9A66B]
                  outline-none rounded-sm
                  focus-visible:ring-1 focus-visible:ring-[#C9A66B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0D0C]
                  transition-colors duration-300 motion-reduce:transition-none
                  before:content-[''] before:absolute before:bottom-0 before:left-1/2 before:w-0 before:h-px before:bg-[#C9A66B]
                  after:content-[''] after:absolute after:bottom-0 after:right-1/2 after:w-0 after:h-px after:bg-[#C9A66B]
                  hover:before:w-1/2 hover:after:w-1/2 focus-visible:before:w-1/2 focus-visible:after:w-1/2
                  before:transition-all after:transition-all before:duration-500 after:duration-500
                  motion-reduce:before:transition-none motion-reduce:after:transition-none"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-6">
          <button
            className="hidden md:inline-block relative overflow-hidden z-[1] rounded-sm
              border border-[#8A7048] text-[#C9A66B] px-6 py-2.5 text-sm font-semibold
              outline-none focus-visible:ring-1 focus-visible:ring-[#C9A66B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0D0C]
              transition-colors duration-500 motion-reduce:transition-none hover:text-[#0E0D0C] hover:border-[#C9A66B]
              before:content-[''] before:absolute before:inset-0 before:-z-10 before:bg-[#C9A66B]
              before:translate-y-[101%] before:transition-transform before:duration-500 motion-reduce:before:transition-none
              hover:before:translate-y-0"
          >
            Book a Consultation
          </button>

          {/* Hamburger (mobile only) */}
          <button
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden z-[200] p-1.5 flex flex-col gap-[5px] rounded-sm
              outline-none focus-visible:ring-1 focus-visible:ring-[#C9A66B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0D0C]"
          >
            <span
              className={`block w-6 h-px bg-[#EDE7DD] transition-transform duration-300 ease-out
                ${menuOpen ? "translate-y-[6px] rotate-45" : ""}`}
            />
            <span
              className={`block w-6 h-px bg-[#EDE7DD] transition-opacity duration-300
                ${menuOpen ? "opacity-0" : "opacity-100"}`}
            />
            <span
              className={`block w-6 h-px bg-[#EDE7DD] transition-transform duration-300 ease-out
                ${menuOpen ? "-translate-y-[6px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </nav>

      {/* Overlay */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 bg-black/55 z-[150] transition-opacity duration-300
          ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />

      {/* Mobile sidebar */}
      <aside
        className={`fixed top-0 right-0 h-screen w-[82vw] max-w-[320px] z-[160]
          bg-[#15130F] border-l border-[#2A2621] flex flex-col
          pt-24 px-9 pb-10 transition-transform duration-500 ease-out
          before:content-[''] before:absolute before:top-0 before:left-0 before:w-px before:h-full
          before:bg-gradient-to-b before:from-[#C9A66B]/50 before:to-transparent
          ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <ul className="flex flex-col">
          {NAV_LINKS.map((link, i) => (
            <li key={link.label} className="border-b border-[#2A2621]">
              <a
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{ transitionDelay: menuOpen ? `${i * 60 + 120}ms` : "0ms" }}
                className={`block font-serif text-xl py-4 text-[#EDE7DD] hover:text-[#C9A66B]
                  hover:pl-2 outline-none rounded-sm
                  focus-visible:ring-1 focus-visible:ring-[#C9A66B]
                  transition-all duration-300 motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-x-0
                  ${menuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          className="mt-8 self-start relative overflow-hidden z-[1] rounded-sm
            border border-[#8A7048] text-[#C9A66B] px-6 py-2.5 text-sm font-semibold
            transition-colors duration-500 hover:text-[#0E0D0C] hover:border-[#C9A66B]
            before:content-[''] before:absolute before:inset-0 before:-z-10 before:bg-[#C9A66B]
            before:translate-y-[101%] before:transition-transform before:duration-500
            hover:before:translate-y-0"
        >
          Book a Consultation
        </button>
      </aside>
    </>
  );
}