import Image from "next/image";
import Link from "next/link";
import heroImg from "../../../public/images/hero-home.jpg";

export default function HeroHome() {
  return (
    <section className="flex flex-col-reverse items-center gap-1 md:flex-row">
      <div className="flex w-full flex-col items-start gap-4 px-6 py-8 sm:px-6 md:w-1/2 md:gap-6 md:px-8 md:py-0 lg:w-[33%] lg:px-10">
        <p className="text-sm uppercase tracking-wide text-[#4d4d4d]">
          Work Elevated
        </p>

        <h1 className="text-[25px] text-[#003349] font-bold leading-tight  sm:text-[30px] md:text-[35px] lg:text-[44px]">
          Summer Savings Start Here
        </h1>

        <p className="w-full leading-snug text-black lg:w-[90%]">
          Kick off the season with <strong>huge savings </strong> on some of
          our best-sellers – but only for a limited time! Shop now for a
          fresh new workspace that&apos;ll keep you happy and healthy all
          year.
        </p>

        <Link
          href="/products"
          className="bg-[#003349] px-6 py-2.5 text-sm font-medium uppercase tracking-wide text-white transition-colors hover:bg-[#007fad]"
        >
          Shop the Sale
        </Link>
      </div>

      <div className="w-full md:w-1/2 lg:w-[66%]">
        <Image
          src={heroImg}
          alt="Vari Hero"
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className="block h-full w-full object-cover"
        />
      </div>
    </section>
  );
}
