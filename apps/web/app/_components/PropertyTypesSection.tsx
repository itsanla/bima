import Image from "next/image";

const propertyTypes = [
  { label: "Hotels",     img: "/assets/prop-hotels.png" },
  { label: "Apartments", img: "/assets/prop-apartments.png" },
  { label: "Resorts",    img: "/assets/prop-resorts.png" },
  { label: "Villas",     img: "/assets/prop-villas.png" },
  { label: "Cottages",   img: "/assets/prop-cottages.png" },
];

export default function PropertyTypesSection() {
  return (
    <section className="bg-[#f0efef] pt-20 pb-16 overflow-hidden">
      <div className="px-24 relative mb-12">
        <p className="absolute right-24 top-0 text-[75px] font-bold text-black/[0.08] tracking-[2.25px] leading-none select-none pointer-events-none">
          2018-2024
        </p>

        <h2
          className="text-[54px] font-bold leading-[0.93] tracking-tight mb-6"
          style={{
            background: "linear-gradient(to right, #252525, #6a6a6a)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Browse by property type
        </h2>

        <p className="text-[#252525] text-[26px] font-medium leading-[1.55] max-w-[1000px] tracking-[0.9px]">
          you can easily browse and filter your search by property type. This feature allows you to
          select hotels or alternative options, such as hostels, vacation rentals, or bed and
          breakfasts, based on your preferences and specific needs for your stay.
        </p>
      </div>

      {/* Tabs */}
      <div className="px-24 flex gap-20 mb-5">
        {propertyTypes.map(({ label }) => (
          <span
            key={label}
            className="text-[26px] font-bold cursor-pointer hover:opacity-80 transition-opacity tracking-tight"
            style={{
              background: "linear-gradient(to right, #252525, #6a6a6a)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Images */}
      <div className="px-24 flex gap-5">
        {propertyTypes.map(({ label, img }) => (
          <div key={label} className="relative flex-1 h-[560px] rounded-2xl overflow-hidden">
            <Image
              src={img}
              alt={label}
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
              sizes="20vw"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-10 items-center">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-2.5 rounded-full ${i === 2 ? "w-10 bg-[#1d1d1d]" : "w-5 bg-[#ccc]"}`} />
        ))}
      </div>
    </section>
  );
}
