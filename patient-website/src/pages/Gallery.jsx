import { useEffect, useState } from "react";
import { Preloader } from "../components/preloader";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { Banner } from "../components/banner";
import { GotoTop } from "../components/goto-top";

const GALLERY_COUNT = 12;

function Gallery() {
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    setIsLoading(false);
  }, [isLoading]);

  const images = Array.from({ length: GALLERY_COUNT }, (_, i) => {
    const n = i + 1;
    return {
      thumb: `/assets/images/gallery/gallery${n}-thumb.webp`,
      full: `/assets/images/gallery/gallery${n}.webp`,
      pngFallback: `/assets/images/gallery/gallery${n}.png`,
    };
  });

  const openModal = (img) => {
    setSelectedImage(img);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
  };

  if (isLoading) return <Preloader />;

  return (
    <>
      <Header logo="assets/images/mpiloLogo.png" joinBtn={true} />
      <Banner title="Gallery" background="assets/images/galleryBanner.webp" />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 text-[#274D60] relative inline-block">
              Our Gallery
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-8 leading-relaxed">
              Explore our gallery to see the impact of our healthcare services and community initiatives. 
              Witness the difference we're making in communities across the region.
            </p>
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {images.map((src, i) => (
              <div
                key={i}
                className="break-inside-avoid group cursor-pointer"
                onClick={() => openModal(src)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openModal(src);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  <picture>
                    <source type="image/webp" srcSet={src.thumb} />
                    <img
                      src={src.pngFallback}
                      alt={`Gallery ${i + 1}`}
                      width={480}
                      height={360}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </picture>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-[#274D60]/20 to-[#D7261E]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-500">
                      <svg className="w-8 h-8 text-[#274D60]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <div className="inline-flex items-center space-x-2 text-[#274D60] font-semibold">
              <span>Want to see more of our work?</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
            <p className="text-gray-600 mt-2">Follow us on social media for daily updates</p>
          </div>
        </div>
      </section>

      <Footer getStart={true} />
      <GotoTop />

      {modalOpen && selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[10000]"
          onClick={closeModal}
        >
          <div
            className="relative max-w-4xl w-full mx-4 p-4 rounded-lg bg-white"
            onClick={(e) => e.stopPropagation()} 
          >
            <button
                className="absolute top-2 right-2 text-gray-700 hover:text-gray-900 text-[64px] font-bold cursor-pointer"
                onClick={closeModal}
                aria-label="Close modal"
              >
                &times;
            </button>

            <picture>
              <source type="image/webp" srcSet={selectedImage.full} />
              <img
                src={selectedImage.pngFallback}
                alt="Preview"
                className="max-h-[80vh] w-full object-contain rounded-md"
                decoding="async"
              />
            </picture>
          </div>
        </div>
      )}
    </>
  );
}

export default Gallery;
