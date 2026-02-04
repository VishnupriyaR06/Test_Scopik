const StarRating = ({ rating }) => {
  const totalStars = 5;
  const numericRating = parseFloat(rating);

  const getStarClass = (index) => {
    if (rating >= index + 1) return "text-orange-400";
    if (rating >= index + 0.5) return "text-orange-200";
    return "text-gray-400";
  };

  return (
    <div className="flex items-center gap-1">
      {[...Array(totalStars)].map((_, index) => (
        <svg
          key={index}
          className={`w-5 h-5 ${getStarClass(index)}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.122-6.545L.487 6.91l6.561-.955L10 0l2.952 5.955 6.561.955-4.757 4.635 1.122 6.545z" />
        </svg>
      ))}
      <span className="text-sm text-white ml-2 font-semibold">{numericRating.toFixed(1)}</span>
    </div>
  );
};

export default StarRating;
