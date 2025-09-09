import ProtoTypes from "prop-types";
import { Link } from "react-router-dom";

function ServiceCard({ title, link, text, children }) {
  return (
    <div className="text-center course-item-1">
      {children}
      <h4>
        <Link to={link}>{title}</Link>
      </h4>
      <p>{text}</p>
    </div>
  );
}

ServiceCard.propTypes = {
  title: ProtoTypes.string,
  link: ProtoTypes.string,
  text: ProtoTypes.string,
  children: ProtoTypes.oneOfType([
    ProtoTypes.arrayOf(ProtoTypes.node),
    ProtoTypes.node,
  ]),
};

export default ServiceCard;
