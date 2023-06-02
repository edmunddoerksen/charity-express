import React, { useRef } from 'react';
import PropTypes from 'prop-types';

function SearchBar({ setCharity }) {
  const typedCharity = useRef('');

  const handleOnChange = (e) => {
    typedCharity.current = e.target.value;
  };

  const handleOnClick = (e) => {
    e.preventDefault();
    window.history.pushState(
      'string',
      '',
      `/search_charities/${typedCharity.current}`,
    );
    globalThis.window.location.assign(`/search_charities/${typedCharity.current}`);
    setCharity(typedCharity.current);
  };

  return (
    <div className="flex">
      <input
        id="searchbar"
        type="text"
        placeholder="Search for Charity"
        onChange={handleOnChange}
        className=" mr-3 border border-sky-500 w-72 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5  "

      />
      <button
        className=" bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded text-white"
        type="button"
        onClick={handleOnClick}
      >
        Search
      </button>
    </div>
  );
}

SearchBar.propTypes = {
  setCharity: PropTypes.func,
};

SearchBar.defaultProps = {
  setCharity: () => null,
};

export default SearchBar;
