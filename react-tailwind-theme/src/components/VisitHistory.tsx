import { useState } from 'react';
import { MapPin, Clock, Calendar, CheckCircle, XCircle } from 'lucide-react';
import type { Visit } from '../types/cf.types';

interface VisitHistoryProps {
  visits: Visit[];
  loading?: boolean;
  error?: string | null;
  compact?: boolean;
}

export function VisitHistory({ visits, loading, error, compact = false }: VisitHistoryProps) {
  const [showAll, setShowAll] = useState(false);

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-20 bg-gray-200 rounded-lg"></div>
        <div className="h-20 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (visits.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>Chưa có lịch sử ghé thăm</p>
      </div>
    );
  }

  const displayedVisits = compact && !showAll ? visits.slice(0, 3) : visits;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return 'Không xác định';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="space-y-3">
      {displayedVisits.map((visit) => (
        <div
          key={visit.visit_id}
          className={`bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow ${
            compact ? 'text-sm' : ''
          }`}
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-start gap-3 flex-1">
              <div className={`${visit.completed ? 'bg-emerald-100' : 'bg-orange-100'} rounded-full p-2`}>
                {visit.completed ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-orange-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className={`font-medium text-gray-900 ${compact ? 'text-sm' : ''}`}>
                    Địa điểm #{visit.destination_id}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(visit.visit_date)}
                  </div>
                  {visit.duration_minutes && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDuration(visit.duration_minutes)}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                visit.completed
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-orange-100 text-orange-700'
              }`}
            >
              {visit.completed ? 'Hoàn tất' : 'Chưa xong'}
            </span>
          </div>
        </div>
      ))}

      {compact && visits.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full py-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
        >
          {showAll ? 'Thu gọn' : `Xem thêm ${visits.length - 3} lần khác`}
        </button>
      )}
    </div>
  );
}
