import ProtoTypes from "prop-types";

function Banner({ title, background }) {
  return (
    <section
      className="page-banner"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <h2 className="banner-title">{title}</h2>
            <div className="bread-crumbs">
              <span></span> {title}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

Banner.propTypes = {
  title: ProtoTypes.string,
  background: ProtoTypes.string,
};

export default Banner;
