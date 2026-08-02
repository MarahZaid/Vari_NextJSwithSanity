import Image from "next/image";
import Link from "next/link";
import { urlFor } from "../../sanity/lib/image";

export default function CategoryCard({ name, slug, shortDescription, mainImage }) {
  const imageUrl = mainImage
    ? urlFor(mainImage).width(400).height(400).fit("max").url()
    : null;

  return (
    <div className="flex h-full flex-col items-center gap-4 text-center">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={name}
          width={220}
          height={220}
          className="mx-auto h-auto w-[60%] object-contain sm:w-[80%] md:w-full"
        />
      )}

      <h3 className="font-bold text-[#032f49]">{name}</h3>

      {shortDescription && (
        <p className="w-3/4 text-sm text-[#4f4f4f]">{shortDescription}</p>
      )}

      <Link
        href={`/products?category=${slug}`}
        className="mt-auto border-2 border-[#003349] bg-white px-8 py-2 text-sm font-bold text-[#113849] transition-colors hover:border-[#04a3dc] hover:text-[#04a3dc]"
      >
        Shop Now
      </Link>
    </div>
  );
}
