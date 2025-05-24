import ProtoTypes from "prop-types";
import { Link } from "react-router-dom";

function ServiceItemCard({ title, link, text,children }) {
  return (
    <div className="course-item-1 text-center">
      {children}
      <h4>
        <Link to={link}>{title}</Link>
      </h4>
      <p>{text}</p>
    </div>
  );
}

ServiceItemCard.propTypes = {
  title: ProtoTypes.string,
  link: ProtoTypes.string,
  text: ProtoTypes.string,
  children: ProtoTypes.oneOfType([
    ProtoTypes.arrayOf(ProtoTypes.node),
    ProtoTypes.node,
  ]),
};

export default ServiceItemCard;
