export default function ContactEmail() {
  return (
    <section className="bg-[#e6e8e9] py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 sm:px-6 md:flex-row md:justify-center md:gap-4 lg:px-8">
        <p className="text-black md:w-full lg:w-2/3">
          Be the first to know about the latest products, deals, and tips
          for elevating your workspace
        </p>

        <form className="flex w-full gap-0 md:w-auto lg:w-1/3">
          <input
            type="email"
            placeholder="Email Address"
            className="h-10 w-[150px] border border-black/20 bg-white px-3 text-sm focus:border-2 focus:border-[#22aaff] focus:outline-none md:w-[250px] lg:w-[270px]"
          />
          <button
            type="submit"
            className="h-10 shrink-0 bg-[#003349] px-4 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#007fad]"
          >
            Sign Up
          </button>
        </form>
      </div>
    </section>
  );
}
