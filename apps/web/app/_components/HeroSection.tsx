import Image from "next/image";

function SearchIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function ChevronDownIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
function DownloadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  );
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden flex flex-col">
      {/* Background photo + overlay */}
      <div className="absolute inset-0">
        <Image
          src="/assets/hero-bg.png"
          alt="hero background"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 to-black/65" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-24 pt-10">
        {/* Logo */}
        <div className="text-white font-bold flex items-baseline gap-0.5">
          <span className="text-[40px] leading-none tracking-tight">Bookme.</span>
          <span className="text-[20px] leading-none">com</span>
        </div>

        {/* Nav links — frosted white pill */}
        <div className="bg-white/95 backdrop-blur-md rounded-full px-10 py-3.5 flex gap-16 shadow-sm">
          {["List your property", "Support", "Trips", "Sign in"].map((link) => (
            <a
              key={link}
              href="#"
              className="text-[#1d1d1d] text-[17px] font-medium hover:text-[#c49c74] transition-colors whitespace-nowrap"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Get the app */}
        <button className="flex items-center gap-2.5 border-2 border-[#f6f6f6] text-[#f6f6f6] rounded-full px-6 py-3 text-[18px] font-medium hover:bg-white/10 transition-colors">
          Get the app
          <DownloadIcon />
        </button>
      </nav>

      {/* Hero content */}
      <div className="relative z-10 flex-1 flex flex-col px-24 pt-24 pb-0">
        {/* Headline */}
        <h1
          className="text-[clamp(60px,7.5vw,112px)] font-semibold leading-[0.93] tracking-tight mb-16"
          style={{
            background: "linear-gradient(to right, #ffffff 0%, #cccccc 77%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Explore your place
          <br />
          to stay
        </h1>

        {/* Search bar */}
        <div
          className="rounded-[30px] p-5 flex items-center gap-3 max-w-[1300px]"
          style={{ backdropFilter: "blur(2px)", background: "rgba(29,29,29,0.61)" }}
        >
          {/* Location */}
          <div className="flex items-center gap-3 bg-[#252525] rounded-xl px-5 py-4 flex-[2] min-w-0 shadow-[inset_2px_0px_4px_rgba(0,0,0,0.25),inset_-2px_4px_4px_rgba(0,0,0,0.25)]">
            <span className="text-[#ccc] shrink-0"><SearchIcon /></span>
            <span className="text-[#ccc] text-lg truncate">Stavanger, Norway</span>
          </div>

          {/* Check in / Checkout */}
          <div className="flex items-center gap-2 bg-[#252525] rounded-xl px-5 py-4 flex-[1.5] shadow-[inset_2px_0px_4px_rgba(0,0,0,0.25),inset_-2px_4px_4px_rgba(0,0,0,0.25)]">
            <span className="text-[#ccc] shrink-0"><CalendarIcon /></span>
            <span className="text-[#ccc] text-lg whitespace-nowrap">Check in</span>
            <div className="h-8 w-px bg-white/20 mx-2 shrink-0" />
            <span className="text-[#ccc] text-lg whitespace-nowrap">Checkout</span>
          </div>

          {/* Guests */}
          <div className="flex items-center gap-3 bg-[#252525] rounded-xl px-5 py-4 flex-1 shadow-[inset_2px_0px_4px_rgba(0,0,0,0.25),inset_-2px_4px_4px_rgba(0,0,0,0.25)]">
            <span className="text-[#ccc] shrink-0"><UsersIcon /></span>
            <span className="text-[#ccc] text-lg">Guests</span>
            <span className="text-[#ccc] ml-auto shrink-0"><ChevronDownIcon /></span>
          </div>

          {/* Search/Checkout button */}
          <button className="bg-[#c49c74] text-[#252525] font-semibold text-lg rounded-xl px-8 py-4 shrink-0 hover:bg-[#b68d65] transition-colors shadow-[inset_2px_0px_4px_rgba(0,0,0,0.25),inset_-2px_4px_4px_rgba(0,0,0,0.66)]">
            Search
          </button>
        </div>
      </div>

      {/* Bottom-right text block */}
      <div className="relative z-10 self-end flex items-start gap-4 px-24 pb-16 max-w-[620px]">
        <div className="w-px h-32 bg-white/60 shrink-0 mt-1" />
        <div>
          <p className="text-white text-[28px] font-bold leading-snug mb-2 [text-shadow:0_4px_4px_rgba(0,0,0,0.25)]">
            We provide a variety of the best lodging accommodations for those of you who need it.
          </p>
          <p className="text-white/80 text-sm [text-shadow:0_4px_4px_rgba(0,0,0,0.25)]">
            Don&apos;t worry about the quality of the service.
          </p>
        </div>
      </div>
    </section>
  );
}
