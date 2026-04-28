/**
 * Badge Component
 * Variants: confirmed, pending, completed, cancelled, sent, new
 */

export const Badge = ({ children, variant = "confirmed" }) => {
  const variantStyles = {
    confirmed: "bg-green-100 text-green-800 border border-green-300",
    pending: "bg-orange-100 text-orange-800 border border-orange-300",
    completed: "bg-green-100 text-green-800 border border-green-300",
    cancelled: "bg-red-100 text-red-800 border border-red-300",
    sent: "bg-green-100 text-green-800 border border-green-300",
    new: "bg-red-600 text-white",
    rejected: "bg-red-100 text-red-800 border border-red-300",
    available: "bg-green-100 text-green-800 border border-green-300",
    booked: "bg-red-100 text-red-800 border border-red-300",
    upcoming: "bg-yellow-100 text-yellow-800 border border-yellow-300",
    overdue: "bg-amber-100 text-amber-800 border border-amber-300",
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${variantStyles[variant]}`}>
      {children}
    </span>
  );
};

export default Badge;
