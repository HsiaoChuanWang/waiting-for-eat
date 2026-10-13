import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";

function DashboardSidebar({
  items,
  ownerId,
  itemHeightClass,
  mobileWidthClass,
}) {
  const navigate = useNavigate();
  const routeSegment = useLocation().pathname.split("/")[2];

  return (
    <nav className="w-full" aria-label="後台功能選單">
      <div className="flex flex-wrap bg-zinc-600/70 phone:w-full phone:flex-nowrap">
        {items.map(({ activeRoutes, icon: Icon, label, path }) => {
          const isActive = activeRoutes.includes(routeSegment);

          return (
            <button
              key={path}
              type="button"
              className={`flex w-full cursor-pointer items-center justify-center border-b border-solid border-gray-400 font-black text-white phone:h-20 ${itemHeightClass} ${
                isActive
                  ? `bg-zinc-800/80 ${mobileWidthClass.active}`
                  : `duration-150 hover:bg-zinc-500 ${mobileWidthClass.idle}`
              }`}
              onClick={() => navigate(`${path}/${ownerId}`)}
            >
              <span>
                <Icon
                  className={`mx-auto mb-1 text-4xl ${
                    isActive ? "phone:text-2xl" : "phone:text-xl"
                  }`}
                />
                <span
                  className={`text-sm ${
                    isActive ? "phone:text-xs" : "phone:hidden"
                  }`}
                >
                  {label}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

DashboardSidebar.propTypes = {
  itemHeightClass: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      activeRoutes: PropTypes.arrayOf(PropTypes.string).isRequired,
      icon: PropTypes.elementType.isRequired,
      label: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    }),
  ).isRequired,
  mobileWidthClass: PropTypes.shape({
    active: PropTypes.string.isRequired,
    idle: PropTypes.string.isRequired,
  }).isRequired,
  ownerId: PropTypes.string.isRequired,
};

export default DashboardSidebar;
