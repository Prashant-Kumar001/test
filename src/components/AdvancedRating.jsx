import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";


const Rating = ({ value = 0, showLabel = true, size = "text-lg" }) => {
  const stars = Array.from({ length: 5 }, (_, i) => {
    if (value >= i + 1) return <FaStar key={i} className={`${size} text-yellow-400`} />;
    if (value >= i + 0.5) return <FaStarHalfAlt key={i} className={`${size} text-yellow-400`} />;
    return <FaRegStar key={i} className={`${size} text-yellow-400`} />;
  });

  return (
    <div className="flex items-center gap-1">
      {stars}
      {showLabel && (
        <span className="ml-1 text-sm text-gray-600">{value.toFixed(1)}</span>
      )}
    </div>
  );
};

export default Rating;
