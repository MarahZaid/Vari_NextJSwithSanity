import { Star } from "lucide-react";

const SIZES = {
  small: 16,
  medium: 20,
  large: 28,
};

export default function RatingStars({ rating = 0, size = "small", color = "#ffc107" }) {
  const fullStars = Math.round(rating);
  const px = SIZES[size] || SIZES.small;

  return (
    <div className="flex" style={{ color }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={px} fill={i <= fullStars ? "currentColor" : "none"} />
      ))}
    </div>
  );
}