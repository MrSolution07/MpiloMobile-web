import { useEffect, useState } from "react";
import GalleryCards from "../../Component/Cards/GalleryCards";
import Preloader from "../../Component/Preloader";
import Header from "../../Component/Headers";
import Footer from "../../Component/Footer/Footer";
import Banner from "../../Component/Banner/Banner";
import GotoTop from "../../Component/GotoTop";

function Gallery() {
  const [isLoading, setIsLoading] = useState(true);

  const images = [
    "/assets/images/gallery/gallery1.png",
    "/assets/images/gallery/gallery2.png",
    "/assets/images/gallery/gallery3.png",
    "/assets/images/gallery/gallery4.png",
    "/assets/images/gallery/gallery5.png",
    "/assets/images/gallery/gallery6.png",
    "/assets/images/gallery/gallery7.png",
    "/assets/images/gallery/gallery8.png",
    "/assets/images/gallery/gallery9.png",
    "/assets/images/gallery/gallery10.png",
    "/assets/images/gallery/gallery11.png",
    "/assets/images/gallery/gallery12.png",
  ];

  let content = undefined;
  useEffect(() => {
    setIsLoading(false);
  }, [isLoading]);

  if (isLoading) {
    content = <Preloader />;
  } else {
    content = (
      <>
      <Header logo="assets/images/mpiloLogo.png" joinBtn={true} />
      <Banner title="Gallery" background="assets/images/galleryBanner.jpg"/>

      <section className="gallery-section">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <h2 className="sec-title mb-15">Our Gallery</h2>
              <p className="sec-desc text-center mb-50">
                Explore our gallery to see the impact of our healthcare services and community initiatives.
              </p>
            </div>
          </div>
          <div className="gallery-grid">
            {images.map((src, i) => (
              <GalleryCards key={i} image={src} />
            ))}
          </div>
        </div>
      </section>
        <div style={{marginTop: '10%'}}></div>
      <Footer getStart={true} />
      <GotoTop />
    </>
  );
}
  return content;
};

export default Gallery;
