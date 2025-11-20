import { useState } from 'react';
import { Heart } from 'lucide-react';

interface FavoriteButtonProps {
  isFavorited: boolean;
  onToggle: (isFavorited: boolean) => Promise<void>;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button';
}

export function FavoriteButton({
  isFavorited,
  onToggle,
  size = 'md',
  variant = 'icon'
}: FavoriteButtonProps) {
  const [loading, setLoading] = useState(false);
  const [localFavorited, setLocalFavorited] = useState(isFavorited);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleToggle = async () => {
    if (loading) return;

    // Optimistic update
    setLocalFavorited(!localFavorited);
    setLoading(true);

    try {
      await onToggle(!localFavorited);
    } catch (error) {
      // Revert on error
      setLocalFavorited(localFavorited);
      console.error('Failed to toggle favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'button') {
    return (
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
          localFavorited
            ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <Heart
          className={`${sizeClasses[size]} ${localFavorited ? 'fill-current' : ''}`}
        />
        <span className="font-medium">
          {localFavorited ? 'Đã thích' : 'Yêu thích'}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`p-2 rounded-full transition-all hover:scale-110 ${
        localFavorited
          ? 'text-red-500 hover:bg-red-50'
          : 'text-gray-400 hover:bg-gray-100'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={localFavorited ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
    >
      <Heart
        className={`${sizeClasses[size]} ${localFavorited ? 'fill-current' : ''}`}
      />
    </button>
  );
}
