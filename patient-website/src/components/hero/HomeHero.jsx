function HomeHero() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      <picture className="pointer-events-none absolute inset-0 -z-10 block h-full w-full">
        <source
          type="image/webp"
          srcSet="/assets/images/home/landingPicture.webp"
        />
        <img
          src="/assets/images/home/landingPicture.jpg"
          alt=""
          width={1920}
          height={1080}
          fetchPriority="high"
          decoding="async"
          className="h-full min-h-screen w-full object-cover"
        />
      </picture>
      <div className="flex min-h-screen w-full items-center px-4 sm:px-6 md:px-8">
        <div className="flex w-full flex-col items-center md:flex-row">
          <div className="w-full text-white md:w-1/2">
            <div className="space-y-6 text-left">
              <h2 className="text-4xl font-bold tracking-wider text-white lg:text-4xl">
                Healthcare on the move
              </h2>
              <p className="text-xl leading-[2rem] text-white">
                <span className="font-semibold text-[#D7261E]">Partnering</span>{" "}
                with the private sector to provide comprehensive
                <br />
                <span className="font-semibold text-[#D7261E]">
                  primary healthcare
                </span>{" "}
                services and community projects.
                <br />
                Serving South Africa, Botswana, and Kenya with mobile clinics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeHero;
