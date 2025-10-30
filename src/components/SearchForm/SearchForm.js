import React, { useState, useCallback } from 'react';
import { XCircleIcon } from "@heroicons/react/24/outline";
import showToast from '../../utils/toastUtils';
import { useNavigate } from 'react-router-dom';

const categories = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Thriller",
  "Historical",
  "Psychological",
  "School Life",
];

const statuses = ["Ongoing", "Completed", "Hiatus", "Cancelled"];

const orders = [
  { label: "Rating", value: "rating" },
  { label: "Year", value: "year" },
  { label: "Followed Count", value: "followedCount" },
];

const orderDirections = [
  { label: "Ascending", value: "asc" },
  { label: "Descending", value: "desc" },
];

const SearchForm = ({ setVis, setMangaVis, setLoading, setError }) => {
  const navigate = useNavigate();

  const [mangaName, setMangaName] = useState('');
  const [tags, setTags] = useState([]);
  const [status, setStatus] = useState('');
  const [order, setOrder] = useState('');
  const [orderDirection, setOrderDirection] = useState('');

  // Function to handle the search logic
  const handleSearch = useCallback(() => {
    setLoading(true);
    setVis(false);
    setMangaVis(true);

    try {
      // Redirect to search results if mangaName is provided
      if (mangaName.trim()) {
        navigate(`/search?title=${encodeURIComponent(mangaName.trim())}`);
        return;
      }

      const orderParams = order && orderDirection ? { [order]: orderDirection } : {};

      const searchParams = {
        includedTags: tags.filter((tag) => tag.type === 'include').map((tag) => tag.name),
        excludedTags: tags.filter((tag) => tag.type === 'exclude').map((tag) => tag.name),
        status,
      };

      const queryParams = new URLSearchParams();

      // Add 'advanced' parameter if any search parameters are filled
      const anySearchParamsFilled = Object.values(searchParams).some(param => Array.isArray(param) ? param.length > 0 : !!param);
      if (anySearchParamsFilled) {
        queryParams.set('advanced', 'true');
      }

      // Add includedTags and excludedTags
      for (const key in searchParams) {
        const value = searchParams[key];
        if (Array.isArray(value) && value.length > 0) {
          queryParams.set(key, value.join(','));
        }
      }

      // Add status parameter if it has value
      if (searchParams.status) {
        queryParams.set('status', searchParams.status);
      }

      // Add order parameter if it has value
      if (Object.keys(orderParams).length > 0) {
        queryParams.set('order', JSON.stringify(orderParams));
      }

      // Only navigate if any search parameters are filled
      if (anySearchParamsFilled) {
        // Navigate to the search page with constructed query string
        navigate(`/search?${queryParams.toString()}`);
      } else {
        // Navigate to default search page without any query parameters
        navigate('/search');
      }

    } catch (error) {
      // Handle errors by updating error state and displaying a toast
      setError(error.message);
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
      // Clearing the state variables might be necessary here depending on your app logic
      // setMangaName('');
      // setTags([]);
      // setStatus('');
      // setOrder('');
      // setOrderDirection('');
    }
  }, [mangaName, tags, status, order, orderDirection, navigate, setVis, setMangaVis, setLoading, setError]);

  // Function to handle tag clicks and update tag state
  const handleTagClick = useCallback((tagName) => {
    const existingTag = tags.find((tag) => tag.name === tagName);
    if (existingTag) {
      if (existingTag.type === 'include') {
        const updatedTags = tags.map((tag) =>
          tag.name === tagName ? { ...tag, type: 'exclude' } : tag
        );
        setTags(updatedTags);
      } else if (existingTag.type === 'exclude') {
        const updatedTags = tags.filter((tag) => tag.name !== tagName);
        setTags(updatedTags);
      }
    } else {
      setTags([...tags, { name: tagName, type: 'include' }]);
    }
  }, [tags]);

  // Function to close the search form
  const handleCloseSearch = useCallback(() => {
    setMangaVis(true)
    setVis(prevVis => !prevVis)
  }, [setMangaVis, setVis]);

  // Function to handle status clicks and update status state
  const handleStatusClick = useCallback((selectedStatus) => {
    setStatus(selectedStatus === status ? '' : selectedStatus);
  }, [status]);

  // Functions to handle order and order direction changes
  const handleOrderChange = useCallback((e) => {
    setOrder(e.target.value);
  }, []);

  const handleOrderDirectionChange = useCallback((e) => {
    setOrderDirection(e.target.value);
  }, []);

  // Check if mangaName is empty
  const isMangaNameEmpty = mangaName.trim() === '';

  return (
    <div className="w-[90%] md:w-[70%] p-7 mx-auto bg-white  border border-gray-300 rounded-[3px] relative">
      <button onClick={() => handleCloseSearch()}>
        <XCircleIcon className="absolute text-black w-7 h-7 top-2 right-2" />
      </button>
      <h2 className="mb-4 text-[20px] md:text-2xl font-bold">Search Manga</h2>
      <div className="mb-4">
        <label htmlFor="mangaName" className="block mb-1 text-[15px] md:text-sm">Manga Name:</label>
        <input
          type="text"
          id="mangaName"
          className="w-full px-3 py-2 border border-gray-300 rounded"
          value={mangaName}
          onChange={(e) => setMangaName(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <h3 className="mb-2 font-bold text-[15px] md:text-lg">Tags:</h3>
        <div>
          {categories.map((tag) => {
            const existingTag = tags.find((t) => t.name === tag);
            const buttonClasses = existingTag
              ? existingTag.type === 'include'
                ? 'bg-blue-500 text-white'
                : 'bg-red-500 text-white'
              : 'bg-gray-300 text-gray-700';

            return (
              <button
                key={tag}
                className={`mr-2 mb-2 px-3 py-2 text-[10px] md:text-sm font-medium rounded ${buttonClasses}`}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
                {existingTag && (
                  <span className="ml-2">
                    {existingTag.type === 'include' ? '✓' : '✕'}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      <div className="mb-4">
        <h3 className="mb-2 font-bold text-[15px] md:text-lg">Status:</h3>
        <div>
          {statuses.map((statusOption) => (
            <button
              key={statusOption}
              className={`mr-2 mb-2 px-3 py-2 text-[10px] md:text-sm font-medium rounded ${status === statusOption ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'
                }`}
              onClick={() => handleStatusClick(statusOption)}
            >
              {statusOption}
              {status === statusOption && <span className="ml-2">✓</span>}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="order" className="block mb-1 text-[15px] md:text-lg">Order:</label>
        <select
          id="order"
          className="w-full px-3 py-2 text-[10px] md:text-sm border border-gray-300 rounded"
          value={order}
          onChange={handleOrderChange}
        >
          <option value="">None</option>
          {orders.map((orderOption) => (
            <option key={orderOption.value} value={orderOption.value}>
              {orderOption.label}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="orderDirection" className="block mb-1 text-[15px] md:text-lg">Order Direction:</label>
        <select
          id="orderDirection"
          className="w-full px-3 py-2 text-[10px] md:text-sm border border-gray-300 rounded"
          value={orderDirection}
          onChange={handleOrderDirectionChange}
        >
          <option value="">None</option>
          {orderDirections.map((orderDirectionOption) => (
            <option key={orderDirectionOption.value} value={orderDirectionOption.value}>
              {orderDirectionOption.label}
            </option>
          ))}
        </select>
      </div>
      <button
        className="px-4 py-2 text-white text-[10px] md:text-sm bg-blue-500 rounded hover:bg-blue-400"
        onClick={handleSearch}
      >
        {isMangaNameEmpty ? 'Filter' : 'Search'}
      </button>
    </div>
  );
}

export default SearchForm;
