import { Star } from "lucide-react";

interface RatingDisplayProps {
  rating: number;
  size?: "sm" | "md" | "lg";
}

export default function RatingDisplay({ rating, size = "md" }: RatingDisplayProps) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const getStarColor = (index: number) => {
    if (rating >= index + 1) {
      return "text-[var(--neon-green)] fill-current";
    } else if (rating > index && rating < index + 1) {
      return "text-[var(--neon-green)] fill-current";
    } else {
      return "text-gray-600";
    }
  };

  return (
    <div className="flex">
      {[0, 1, 2, 3, 4].map((index) => (
        <Star
          key={index}
          className={`${sizeClasses[size]} ${getStarColor(index)}`}
        />
      ))}
    </div>
  );
}
