import { motion } from "framer-motion";

/**
 * Card Component
 * Generic card wrapper for flexible content
 */

export const Card = ({ 
  children, 
  className = "", 
  shadow = true,
  padding = true,
  whileTap,
  ...props
}) => {
  const motionProps = {};
  if (whileTap) {
    motionProps.whileTap = whileTap;
    motionProps.transition = { duration: 0.15 };
  }

  return (
    <motion.div
      {...motionProps}
      className={`
        bg-white/90 backdrop-blur-sm rounded-3xl
        ${shadow ? "shadow-lg" : ""}
        ${padding ? "p-6" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * StatsCard Component
 * Displays a stat with number, icon, and label
 */
export const StatsCard = ({ 
  icon: Icon, 
  label, 
  value, 
  bgColor = "bg-udck-light",
  textColor = "text-udck-dark"
}) => {
  return (
    <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 group border border-slate-100">
      <div className="flex items-center gap-4">
        <div className={`${bgColor} p-3 rounded-2xl shadow-sm`}> 
          {Icon && <Icon className={`w-6 h-6 ${textColor}`} />} 
        </div>
        <div>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-[0.2em] mb-1">{label}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
        </div>
      </div>
    </Card>
  );
};

export default Card;
