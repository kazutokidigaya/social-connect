import React from "react";

const tags = [
  "Anime",
  "Travel",
  "Music",
  "Sports",
  "Gaming",
  "Coding",
  "Cooking",
  "Fitness",
  "Art",
  "Movies",
  "Fashion",
  "Tech",
];

const TagSelector = ({ selectedTags, setSelectedTags }) => {
  const handleTagClick = (tag) => {
    // Prevent immediate form submission by stopping propagation
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 my-4">
      {tags.map((tag) => (
        <button
          type="button" // Prevent form submission
          key={tag}
          className={`px-4 py-2 rounded ${
            selectedTags.includes(tag)
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => handleTagClick(tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

export default TagSelector;
