function HomeHero() {
  return (
   <section
  className="w-full min-h-screen bg-cover bg-center"
    style={{
      backgroundImage: "url(assets/images/home/landingPicture.jpg)",
    }}
  >
    <div className="w-full min-h-screen flex items-center px-4 sm:px-6 md:px-8">
      <div className="flex flex-col md:flex-row items-center w-full">
        <div className="w-full md:w-1/2 text-white">
          <div className="space-y-6 text-left">
            <h2 className="text-4xl lg:text-5xl text-white font-bold leading-tight">
              Healthcare on the move
            </h2>
            <p className="text-lg lg:text-xl leading-relaxed text-white">
              <span className="text-[#D7261E] font-semibold">Partnering</span>{" "}
              with the private sector to provide comprehensive{" "}
              <span className="text-[#D7261E] font-semibold">
                primary healthcare
              </span>{" "}
              projects and services. Serving communities across South Africa,
              Botswana and Kenya.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  );
}

export default HomeHero;
