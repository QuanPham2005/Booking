/**
 * SearchBar Component
 * Text input with search icon
 */
import { Search } from "lucide-react";

export const SearchBar = ({
  placeholder = "Search...",
  value,
  onChange,
  className = "",
  ...props
}) => {
  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        {...props}
      />
      <Search className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
    </div>
  );
};

export default SearchBar;
