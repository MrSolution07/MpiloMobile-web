import { useEffect, useState } from "react";
import { GalleryCard } from "../components/cards";
import { Preloader } from "../components/preloader";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { Banner } from "../components/banner";
import { GotoTop } from "../components/goto-top";

function Gallery() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, [isLoading]);

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

  if (isLoading) return <Preloader />;

  return (
    <>
      <Header logo="assets/images/mpiloLogo.png" joinBtn={true} />
      <Banner title="Gallery" background="assets/images/galleryBanner.jpg" />

      <section className="gallery-section">
        <div className="container">
          <div className="row">
            <div className="text-center col-md-12">
              <h2 className="mb-15 sec-title">Our Gallery</h2>
              <p className="mb-50 text-center sec-desc">
                Explore our gallery to see the impact of our healthcare services
                and community initiatives.
              </p>
            </div>
          </div>
          <div className="gallery-grid">
            {images.map((src, i) => (
              <GalleryCard key={i} image={src} />
            ))}
          </div>
        </div>
      </section>
      <div style={{ marginTop: "10%" }}></div>
      <Footer getStart={true} />
      <GotoTop />
    </>
  );
}

export default Gallery;
