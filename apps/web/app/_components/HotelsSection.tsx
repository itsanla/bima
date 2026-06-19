import Image from "next/image";

function StarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1.5">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
function BedIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v6H2" /><path d="M6 8v1M10 8a2 2 0 0 1 4 0" />
    </svg>
  );
}
function SquareFootIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 3v18" />
    </svg>
  );
}
function ArrowLeftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
function ArrowRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

const hotels = [
  { id: 1, name: "Villa, Kemah Tinggi", price: "$ 990", bedrooms: 2, size: 214, rating: 4.93 },
  { id: 2, name: "Villa, Kemah Tinggi", price: "$ 990", bedrooms: 2, size: 214, rating: 4.93 },
  { id: 3, name: "Villa, Kuta Premiere", price: "$ 920", bedrooms: 5, size: 214, rating: 4.93 },
  { id: 4, name: "Villa, Kuta Premiere", price: "$ 920", bedrooms: 5, size: 214, rating: 4.93 },
];

const compareFeatures = [
  {
    title: "See it all",
    desc: "From local hotels to global brands, discover millions of rooms all around the world.",
  },
  {
    title: "Compare right here",
    desc: "No need to search anywhere else. The biggest names in travel are right here.",
  },
  {
    title: "Get exclusive rates",
    desc: "We've special deals with the world's leading hotels and we pass these savings with you.",
  },
];

function HotelCard({ hotel }: { hotel: (typeof hotels)[0] }) {
  return (
    <div className="shrink-0 w-[300px]">
      {/* Card image */}
      <div className="relative h-[336px] rounded-3xl overflow-hidden shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
        <Image src="/placeholder.webp" alt={hotel.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-black/10" />

        {/* Rating badge */}
        <div
          className="absolute top-5 left-5 flex items-center gap-1.5 rounded-full px-2.5 py-1"
          style={{ backdropFilter: "blur(20px)", background: "rgba(255,255,255,0.3)" }}
        >
          <StarIcon />
          <span className="text-white text-[14px] font-medium">{hotel.rating}</span>
        </div>

        {/* Favorite */}
        <button className="absolute top-5 right-5 hover:scale-110 transition-transform">
          <HeartIcon />
        </button>

        {/* Slider dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 items-center">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${i === 2 ? "w-6 bg-white" : "w-2 bg-white/50"}`}
            />
          ))}
        </div>
      </div>

      {/* Details row */}
      <div className="mt-3 flex items-baseline justify-between gap-2">
        <p className="text-[#252525] font-bold text-[18px] leading-6">{hotel.name}</p>
        <p className="text-[#c49c74] font-extrabold text-[18px] leading-6 shrink-0">{hotel.price}</p>
      </div>
      <div className="mt-1.5 flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-[#c9beb3]">
          <BedIcon />
          <span className="text-[14px] font-medium">{hotel.bedrooms} bedrooms</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#c9beb3]">
          <SquareFootIcon />
          <span className="text-[14px] font-medium">{hotel.size}m²</span>
        </div>
        <span className="text-[#a1a7b0] text-[10px] ml-auto">per month</span>
      </div>
    </div>
  );
}

export default function HotelsSection() {
  return (
    <div className="bg-[#f0efef]">
      {/* Hotels carousel */}
      <section className="pt-20 pb-14 px-24">
        <h2
          className="text-[40px] font-bold text-center mb-14 tracking-tight"
          style={{
            background: "linear-gradient(to right, #252525, #6a6a6a)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Hotels in your area
        </h2>

        <div className="relative">
          {/* Left arrow */}
          <button className="absolute -left-5 top-[168px] -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/80 shadow-md flex items-center justify-center hover:bg-white transition-colors">
            <ArrowLeftIcon />
          </button>

          {/* Cards */}
          <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory">
            {hotels.map((hotel) => (
              <div key={hotel.id} className="snap-start">
                <HotelCard hotel={hotel} />
              </div>
            ))}
          </div>

          {/* Right arrow */}
          <button className="absolute -right-5 top-[168px] -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/80 shadow-md flex items-center justify-center hover:bg-white transition-colors">
            <ArrowRightIcon />
          </button>
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center gap-2 mt-10 items-center">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-2.5 rounded-full transition-all ${i === 2 ? "w-10 bg-[#1d1d1d]" : "w-5 bg-[#ccc]"}`}
            />
          ))}
        </div>
      </section>

      {/* Compare us strip */}
      <div className="bg-[#1d1d1d] py-20 px-24">
        <div className="grid grid-cols-3 gap-20 text-center">
          {compareFeatures.map((f) => (
            <div key={f.title}>
              <h3 className="text-[#f6f6f6] text-[28px] font-bold mb-4 tracking-tight">{f.title}</h3>
              <p className="text-[#ccc] text-[18px] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
