import { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  initialRating?: number;
  onRate?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  showValue?: boolean;
}

export function RatingStars({
  initialRating = 0,
  onRate,
  size = 'md',
  readonly = false,
  showValue = false
}: RatingStarsProps) {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleRate = (ratingValue: number) => {
    if (readonly) return;
    
    setRating(ratingValue);
    onRate?.(ratingValue);
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`${
            readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
          } transition-transform ${sizeClasses[size]}`}
          onClick={() => handleRate(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          disabled={readonly}
        >
          <Star
            className={`${
              star <= (hover || rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-none text-gray-300'
            } ${sizeClasses[size]}`}
          />
        </button>
      ))}
      {showValue && rating > 0 && (
        <span className="ml-2 text-sm text-gray-600 font-medium">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
