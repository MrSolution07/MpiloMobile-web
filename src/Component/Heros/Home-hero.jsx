import { Link } from "react-router-dom";

function HomeHero() {
  return (
    <section
      className="hero-banner-1"
      style={{ backgroundImage: "url(assets/images/home/landingPicture.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}
    >
     
      <div className="container">
        <div className="row">
          <div className="col-lg-5 col-md-5">
            <div className="hero-content">
              <h2>Healthcare on the move</h2>
              <p>
                <span style={{color:"#D7261E"}}>Partnering</span> with the private sector to provide comprehensive <span style={{color:"#D7261E"}}>primary healthcare </span> projects and services. Serving communities across South Africa, Botswana and Kenya.
              </p>
              
            </div>
          </div>
          <div className="col-lg-7 col-md-7">
            <div className="banner-thumb">
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeHero;