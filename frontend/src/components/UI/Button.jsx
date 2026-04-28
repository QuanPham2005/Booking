/**
 * Button Component
 * Variants: primary, secondary, danger, ghost
 * Sizes: sm, md, lg
 */

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  ...props
}) => {
  const baseStyles =
    "font-semibold rounded-lg transition-all duration-200 inline-flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantStyles = {
    primary: "bg-udck-primary text-white border-2 border-udck-accent hover:bg-udck-dark disabled:bg-gray-400 focus:ring-udck-primary",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:bg-gray-300 focus:ring-gray-400",
    danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400 focus:ring-red-500",
    ghost: "bg-transparent text-udck-primary border-2 border-udck-primary hover:bg-udck-primary/10 disabled:opacity-50 focus:ring-udck-primary",
  };
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
