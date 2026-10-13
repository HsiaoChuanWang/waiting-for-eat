import PropTypes from "prop-types";
import FavoriteStatusButtons from "../../favorite/components/FavoriteStatusButtons.jsx";

function FavoriteStatus({ favoriteId, onChange, status }) {
  if (!favoriteId) return null;

  return (
    <FavoriteStatusButtons
      compact
      status={status}
      onChange={(nextStatus) => onChange(favoriteId, nextStatus)}
    />
  );
}

FavoriteStatus.propTypes = {
  favoriteId: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  status: PropTypes.string,
};

export default FavoriteStatus;
