// SearchComponent.jsx
import { useState, useEffect, useCallback } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { nameUrlUtils } from '../../Utils/nameUrlUtils';
const BASE_URL = process.env.REACT_APP_BASE_URL;

const SearchComponent = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  // Debounce function
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  // Fetch suggestions
  const fetchSuggestions = useCallback(debounce(async (searchTerm) => {
    if (searchTerm.length < 2) {
      setSuggestions([]);
      return;
    }
    
    try {
      const response = await fetch(`${BASE_URL}/search/autocomplete?term=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  }, 300), []);

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?term=${encodeURIComponent(query)}`);
      setSuggestions([]);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    switch (suggestion.Type) {
      case 'Product':
        navigate(`/products/${nameUrlUtils.convertUrlfromSearch(suggestion.ReferenceId)}`);
        break;
      case 'Brand':
        navigate(`/brands/${suggestion.ReferenceId}`);
        break;
      case 'Category':
        navigate(`/categories/${suggestion.ReferenceId}`);
        break;
      default:
        navigate(`/search?term=${encodeURIComponent(suggestion.Value)}`);
    }
    setQuery('');
    setSuggestions([]);
  };

  // Clear search
  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
  };

  useEffect(() => {
    if (query) {
      fetchSuggestions(query);
    } else {
      setSuggestions([]);
    }
  }, [query, fetchSuggestions]);

  return (
    <div className="search-container relative">
      <form onSubmit={handleSearchSubmit} className="flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products, brands and categories..."
          className="search-input w-full px-4 py-2 border rounded-l focus:outline-none"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        />
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="bg-gray-200 px-3 py-2 hover:bg-gray-300 transition"
          >
            <FaTimes />
          </button>
        )}
        <button
          type="submit"
          className="search-btn bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700 transition"
        >
          <FaSearch />
        </button>
      </form>

      {suggestions.length > 0 && isFocused && (
        <div className="suggestions-container absolute z-50 w-full bg-white shadow-lg rounded-b-md border border-gray-200 mt-1 max-h-80 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="suggestion-item p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
              onMouseDown={() => handleSuggestionClick(suggestion)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium flex items-center">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2 capitalize">
                      {suggestion.Type}
                    </span>
                    {suggestion.Value}
                  </div>
                  {suggestion.Category && (
                    <div className="text-xs text-gray-500 mt-1">{suggestion.Category}</div>
                  )}
                </div>
                <div className="text-xs text-gray-400">
                  {Math.round(suggestion.Relevance * 100)}% match
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchComponent;