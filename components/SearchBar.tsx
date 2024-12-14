import { FaSearch } from 'react-icons/fa';

const SearchBar = () => {
  return (
    <div className="flex items-center space-x-2 p-2 bg-gray-700 rounded-lg">
      <FaSearch className="text-gray-400 ms-2" />
      <input
        type="text"
        placeholder="Search files..."
        className="bg-gray-700 text-white placeholder-gray-500 rounded-lg py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default SearchBar;
