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
              <h2 className="text-4xl lg:text-4xl text-white font-bold tracking-wider">
                Healthcare on the move
              </h2>
              <p className="text-xl leading-[2rem] text-white ">
                <span className="text-[#D7261E] font-semibold">Partnering</span>{" "}
                with the private sector to provide comprehensive<br />
                <span className="text-[#D7261E] font-semibold">primary healthcare</span>{" "}
                services and community projects.<br />
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
