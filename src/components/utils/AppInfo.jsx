function AppInfo() {
  return (
    <section className="py-16 bg-white relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            <span className="block text-[#274D60]">Introducing</span> Our Mobile App
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12 relative z-10">
          {[
            {
              title: "Healthcare wherever you are",
              text: "Whether you're in a rural village or a busy city, Mpilo delivers care right to your phone with our mobile clinics and doctor-on-demand service."
            },
            {
              title: "From clinic to click - Mpilo brings care closer.",
              text: "Get trusted medical advice, treatment plans, and follow-ups from the comfort of your home."
            },
            {
              title: "Real Doctors. Real-Time. Real Easy",
              text: "Mpilo makes seeing a doctor as simple as making a call."
            }
          ].map((item, idx) => (
            <div key={idx} className="relative bg-white shadow-lg rounded-xl p-6 overflow-hidden z-10">
              <div className="absolute inset-0 z-0">
                <div
                  className="w-[300px] h-[300px] rounded-full opacity-20 blur-3xl pointer-events-none absolute -top-1/2 -left-1/2"
                  style={{
                    background: 'radial-gradient(circle, rgba(0,191,255,0.4), transparent 70%)'
                  }}
                />
              </div>

              <div className="relative z-10">
                <h4 className="text-xl font-semibold text-[#274D60] mb-2">{item.title}</h4>
                <p className="text-gray-600">{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <img
            src="/assets/images/home/appPic.png"
            alt="App Preview"
            className="mx-auto max-w-xs md:max-w-md"
          />
        </div>
      </div>
    </section>
  );
}

export default AppInfo;
