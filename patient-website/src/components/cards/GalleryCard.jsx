const GalleryCard = ({ image }) => {
  return (
    <div className="gallery-card">
      <img src={image} alt="Gallery" className="gallery-image" />
    </div>
  );
};

export default GalleryCard;
