function AppInfo() {
  return (
    <section className="event-section">      
      <div className="container">
        <div className="row">
          <div className="col-md-12 text-center">

            <h2 className="sec-title">
              <span>Introducing</span> Our Mobile App
            </h2>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="card-row">
              <div className="event-item-1">
                <h4>Healthcare wherever you are</h4>
                <p>Whether you're in a rural village or a busy city, Mpilo delivers care right to your phone with our mobile clinics and doctor-on-demand service.</p>
              </div>

              <div className="event-item-1">
                <h4>From clinic to click - <br /> Mpilo brings care closer.</h4>
                <p>Get trusted medical advice, treatment plans, and follow-ups from the comfort of your home.</p>
              </div>

              <div className="event-item-1">
                <h4>Real Doctors. Real-Time. Real Easy</h4>
                <p>Mpilo makes seeing a doctor as simple as making a call.</p>
              </div>
            </div>
          </div>

          <div className="col-md-12 text-center mt-5">
            <img src="/assets/images/home/appPic.png" alt="App Preview" className="img-fluid" style={{ maxWidth: '500px' }} />
          </div>
        </div>

        </div>
    </section>
  );
}

export default AppInfo;
