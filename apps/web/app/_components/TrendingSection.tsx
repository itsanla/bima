import Image from "next/image";

const destinations = [
  { name: "Dubai",    gridArea: "1 / 1 / 2 / 2", height: 152 },
  { name: "Paris",    gridArea: "1 / 2 / 3 / 3", height: 319 },
  { name: "Tbilisi",  gridArea: "2 / 1 / 3 / 2", height: 152 },
  { name: "Istanbul", gridArea: "3 / 1 / 4 / 2", height: 171 },
  { name: "Taiwan",   gridArea: "3 / 2 / 4 / 3", height: 171 },
];

export default function TrendingSection() {
  return (
    <section className="bg-[#252525] py-24 px-24">
      <div className="flex gap-20 xl:gap-28 items-start">
        {/* Left — newsletter */}
        <div className="flex-1 flex flex-col justify-center pt-6">
          <h2 className="text-[#f6f6f6] text-[40px] font-bold mb-6 tracking-tight">
            Stay in the know
          </h2>
          <p className="text-[#ccc] text-[22px] leading-relaxed mb-12">
            Sign up to get marketing emails from Bookme.com, including promotions, rewards, travel
            experiences, and information about Bookme.com and Booking.com Transport Limited&apos;s
            products and services.
          </p>

          {/* Email input row */}
          <div className="flex gap-4 mb-4">
            <div
              className="flex-1 h-[70px] rounded-xl px-5 flex items-center"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
            >
              <input
                type="email"
                placeholder="Your email address"
                className="w-full bg-transparent text-white text-[18px] placeholder:text-[#ccc] outline-none"
              />
            </div>
            <button className="bg-[#c49c74] text-[#252525] font-semibold text-[18px] px-8 h-[70px] rounded-xl shrink-0 hover:bg-[#b68d65] transition-colors shadow-[inset_2px_0px_4px_rgba(0,0,0,0.25)]">
              Subscribe
            </button>
          </div>

          <p className="text-[#c9beb3] text-[16px]">
            You can opt out anytime. See our{" "}
            <a href="#" className="text-[#c49c74] underline hover:opacity-80 transition-opacity">
              privacy statement.
            </a>
          </p>
        </div>

        {/* Right — trending destinations */}
        <div className="w-[480px] xl:w-[520px] shrink-0">
          <h3 className="text-[#f6f6f6] text-[38px] font-bold mb-1 tracking-tight">
            Trending destinations
          </h3>
          <p className="text-[#ccc] text-[16px] mb-8">Most popular choices for travelers</p>

          {/* Bento grid */}
          <div
            className="grid grid-cols-2 gap-3"
            style={{ gridTemplateRows: "152px 152px 171px" }}
          >
            {destinations.map((d) => (
              <div
                key={d.name}
                className="relative rounded-2xl overflow-hidden cursor-pointer group"
                style={{ gridArea: d.gridArea }}
              >
                <Image
                  src="/placeholder.webp"
                  alt={d.name}
                  fill
                  className="object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <p className="absolute bottom-4 left-4 text-[#f6f6f6] text-[32px] font-bold leading-none">
                  {d.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
