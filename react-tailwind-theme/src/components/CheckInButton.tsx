import { useState } from 'react';
import { MapPin, Check, Loader2 } from 'lucide-react';

interface CheckInButtonProps {
  destinationId: number;
  onCheckIn: (destinationId: number) => Promise<void>;
  hasVisited?: boolean;
  compact?: boolean;
  className?: string;
}

export function CheckInButton({
  destinationId,
  onCheckIn,
  hasVisited = false,
  compact = false,
  className = ''
}: CheckInButtonProps) {
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(hasVisited);

  const handleCheckIn = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (checked) return; // Already checked in

    setLoading(true);
    try {
      await onCheckIn(destinationId);
      setChecked(true);
    } catch (error) {
      console.error('Check-in failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (compact) {
    return (
      <button
        onClick={handleCheckIn}
        disabled={loading || checked}
        className={`p-2 rounded-lg transition-all ${
          checked
            ? 'bg-emerald-100 text-emerald-700 cursor-default'
            : 'bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600'
        } disabled:opacity-50 ${className}`}
        title={checked ? 'Đã check-in' : 'Check-in tại đây'}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : checked ? (
          <Check className="w-4 h-4" />
        ) : (
          <MapPin className="w-4 h-4" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleCheckIn}
      disabled={loading || checked}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        checked
          ? 'bg-emerald-100 text-emerald-700 cursor-default'
          : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-emerald-500 hover:text-emerald-600'
      } disabled:opacity-50 ${className}`}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Đang check-in...</span>
        </>
      ) : checked ? (
        <>
          <Check className="w-4 h-4" />
          <span>Đã check-in</span>
        </>
      ) : (
        <>
          <MapPin className="w-4 h-4" />
          <span>Check-in tại đây</span>
        </>
      )}
    </button>
  );
}
