function Feature() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 flex flex-col-reverse md:flex-row items-center gap-12">
        <div className="md:w-1/2">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            <span className="block">Meet Our</span>
            <span className="text-[#D7261E]">Founder</span>
          </h2>
          <p className="text-gray-700 text-lg mb-4">
            Mpilo Mobile was founded by Tumi Mabitsela, a 2015{" "}
            <span className="text-[#D7261E] font-medium">
              Nelson Mandela Washington Fellow
            </span>.
          </p>
          <p className="text-gray-700 text-lg mb-4">
            Tumi was a leading African voice at the{" "}
            <span className="text-[#D7261E] font-medium">
              10th Sankalp Global Summit in 2018
            </span>{" "}
            and represents{" "}
            <span className="text-[#D7261E] font-medium">
              one of 11 social entrepreneurs
            </span>{" "}
            selected for the GE Health Imagination Mother and Child Program.
          </p>
          <p className="text-gray-700 text-lg">
            <span className="text-[#D7261E] font-medium">
              Graca Machel Trust Women Creating Wealth
            </span>{" "}
            in the Pan African Region Member.
          </p>
        </div>

        <div className="md:w-1/2">
          <img
            src="/assets/images/founder.png"
            alt="Founder"
            className="w-full max-w-md mx-auto"
          />
        </div>
      </div>
    </section>
  );
}

export default Feature;
