import React, { useState } from "react";
import axios from "axios";

function SearchBar({ setUsers, currentUser }) {
  const [query, setQuery] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    const res = await axios.get(
      `http://localhost:5000/api/users/search?query=${query}`,
      { withCredentials: true }
    );
    setUsers(res.data.filter((user) => user._id !== currentUser?._id));
  };

  return (
    <div className="my-6 flex justify-center">
      <form onSubmit={handleSearch} className="flex w-full max-w-md">
        <input
          type="text"
          className="w-full px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Search users..."
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded-r-lg hover:bg-blue-600"
        >
          Search
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
