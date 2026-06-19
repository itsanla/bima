function FacebookIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
function TwitterIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
function ArrowRightSmIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#252525" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

const footerLinks: Record<string, string[]> = {
  Services: ["Email Marketing", "Campaigns", "Branding", "Offline"],
  About: ["Our Story", "Benefits", "Team", "Careers"],
  Help: ["FAQs", "Contact Us"],
};

export default function Footer() {
  return (
    <footer className="bg-[#1d1d1d] shadow-[inset_0px_4px_4px_rgba(0,0,0,0.25)]">
      {/* Row 1: Logo + CTA */}
      <div className="px-24 pt-14 pb-8 flex items-center justify-between">
        <div className="text-[#f6f6f6] font-bold flex items-baseline gap-0.5">
          <span className="text-[40px] leading-none tracking-tight">Bookme.</span>
          <span className="text-[20px] leading-none">com</span>
        </div>
        <div className="flex items-center gap-8">
          <p className="text-white text-[20px] font-normal tracking-tight">Ready to get started?</p>
          <button className="bg-[#c49c74] text-[#252525] font-semibold text-[18px] px-12 py-5 rounded-xl hover:bg-[#b68d65] transition-colors shadow-[inset_0px_4px_4px_rgba(0,0,0,0.25)]">
            Get started
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-24 h-px bg-white/10" />

      {/* Row 2: Newsletter + Links */}
      <div className="px-24 py-14 flex gap-20 items-start">
        {/* Newsletter */}
        <div className="w-[340px] shrink-0">
          <h4 className="text-white text-[20px] font-medium mb-8 leading-snug">
            Subscribe to our
            <br />
            newsletter
          </h4>
          <div className="border-b border-white/20 flex items-center pb-3 gap-3">
            <span className="text-white/50 text-[14px] flex-1">Email address</span>
            <button className="bg-[#c49c74] rounded-lg p-2 hover:bg-[#b68d65] transition-colors shrink-0 shadow-[inset_0px_4px_4px_rgba(0,0,0,0.25)]">
              <ArrowRightSmIcon />
            </button>
          </div>
        </div>

        {/* Links */}
        <div className="flex gap-20 flex-1 justify-end">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h5 className="text-[#c49c74] text-[16px] font-medium mb-6 tracking-tight">
                {category}
              </h5>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-white text-[14px] hover:text-[#c49c74] transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Row 3: Legal + Social */}
      <div className="px-24 pb-10 flex items-center justify-between">
        <div className="flex gap-10">
          <a href="#" className="text-white text-[14px] hover:text-[#c49c74] transition-colors">
            Terms &amp; Conditions
          </a>
          <a href="#" className="text-white text-[14px] hover:text-[#c49c74] transition-colors">
            Privacy Policy
          </a>
        </div>
        <div className="flex gap-6 items-center">
          <a href="#" className="hover:opacity-70 transition-opacity"><FacebookIcon /></a>
          <a href="#" className="hover:opacity-70 transition-opacity"><TwitterIcon /></a>
          <a href="#" className="hover:opacity-70 transition-opacity"><InstagramIcon /></a>
        </div>
      </div>
    </footer>
  );
}
