/**
 * AvatarGroup Component
 * Displays multiple avatars stacked
 */

export const AvatarGroup = ({ avatars = [], size = "sm", className = "" }) => {
  return (
    <div className={`flex -space-x-2 ${className}`}>
      {avatars.map((av, idx) => (
        <div key={idx} className="relative">
          <img
            src={av.src}
            alt={av.initials || ""}
            className={`w-8 h-8 rounded-full border-2 border-white`} 
          />
        </div>
      ))}
    </div>
  );
};

export default AvatarGroup;
