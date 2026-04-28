/**
 * StatusIndicator Component
 * simple colored dot or icon
 */
export const StatusIndicator = ({ color = "bg-green-500", className = "" }) => {
  return <span className={`${color} w-3 h-3 rounded-full inline-block ${className}`} />;
};

export default StatusIndicator;
