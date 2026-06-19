import Image from "next/image";

const propertyTypes = ["Hotels", "Apartments", "Resorts", "Villas", "Cottages"];

export default function PropertyTypesSection() {
  return (
    <section className="bg-[#f0efef] pt-20 pb-16 overflow-hidden">
      <div className="px-24 relative mb-12">
        {/* Watermark year */}
        <p className="absolute right-24 top-0 text-[75px] font-bold text-black/[0.08] tracking-[2.25px] leading-none select-none pointer-events-none">
          2018-2024
        </p>

        {/* Title */}
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

        {/* Description */}
        <p className="text-[#252525] text-[26px] font-medium leading-[1.55] max-w-[1000px] tracking-[0.9px]">
          you can easily browse and filter your search by property type. This feature allows you to
          select hotels or alternative options, such as hostels, vacation rentals, or bed and
          breakfasts, based on your preferences and specific needs for your stay.
        </p>
      </div>

      {/* Tabs */}
      <div className="px-24 flex gap-20 mb-5">
        {propertyTypes.map((type) => (
          <span
            key={type}
            className="text-[26px] font-bold cursor-pointer hover:opacity-80 transition-opacity tracking-tight"
            style={{
              background: "linear-gradient(to right, #252525, #6a6a6a)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {type}
          </span>
        ))}
      </div>

      {/* Images row */}
      <div className="px-24 flex gap-5">
        {propertyTypes.map((type) => (
          <div key={type} className="relative flex-1 h-[560px] rounded-2xl overflow-hidden">
            <Image
              src="/placeholder.webp"
              alt={type}
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        ))}
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
  );
}
