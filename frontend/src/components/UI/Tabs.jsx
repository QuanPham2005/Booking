/**
 * Tab Component
 * Tabbed interface for switching between views
 */
import PropTypes from "prop-types";

export const Tabs = ({ 
  tabs = [], 
  activeTab, 
  onTabChange,
  className = ""
}) => {
  return (
    <div className={className}>
      <div className="bg-white border border-gray-200 rounded-xl p-2 flex items-center gap-2 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="text-xs bg-white text-gray-700 px-2 py-0.5 rounded-full">{tab.count}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    count: PropTypes.number,
  })),
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default Tabs;
