import Image from "next/image";
import { urlFor } from "../../sanity/lib/image";

export default function HeroCategory({ category }) {
  if (!category) return null;

  const heroImageUrl = category.heroImage
    ? urlFor(category.heroImage).width(1200).url()
    : null;

  return (
    <section className="flex flex-col-reverse items-center gap-8 bg-[#f0f0f0] md:flex-row">
      <div className="px-4 py-8 sm:px-6 md:w-1/2 md:px-8 lg:px-10">
        <h1 className="mb-4 text-[25px] font-bold text-[#032f49] sm:text-[30px] md:text-[35px] lg:text-[44px]">
          {category.plpTitle || category.name}
        </h1>

        {category.description && (
          <p className="text-[#4f4f4f]">{category.description}</p>
        )}
      </div>

      {heroImageUrl && (
        <div className="w-full md:w-1/2">
          <Image
            src={heroImageUrl}
            alt={category.plpTitle || category.name}
            width={1200}
            height={700}
            className="h-auto w-full object-cover"
          />
        </div>
      )}
    </section>
  );
}