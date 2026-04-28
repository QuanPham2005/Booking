/**
 * Avatar Component
 * Displays user avatar with initials or image
 */

export const Avatar = ({ 
  initials = "?", 
  src = null, 
  size = "md", 
  className = "" 
}) => {
  const sizeStyles = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-md",
    lg: "w-16 h-16 text-lg",
    xl: "w-20 h-20 text-xl",
  };

  return (
    <div
      className={`
        inline-flex items-center justify-center rounded-full 
        bg-gray-300 text-gray-800 font-bold
        ${sizeStyles[size]} ${className}
      `}
    >
      {src ? (
        <img src={src} alt={initials} className="w-full h-full rounded-full object-cover" />
      ) : (
        initials
      )}
    </div>
  );
};

export default Avatar;
