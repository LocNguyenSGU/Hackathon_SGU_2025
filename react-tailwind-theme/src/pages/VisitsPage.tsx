import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowLeft, Calendar, Filter, Download } from 'lucide-react';
import { VisitHistory } from '../components/VisitHistory';
import { useVisits } from '../hooks/useVisits';
import { getCurrentUserId } from '../utils/user';

export default function VisitsPage() {
  const navigate = useNavigate();
  const userId = getCurrentUserId();
  const { visits, loading, error, reload } = useVisits(userId);
  const [filter, setFilter] = useState<'all' | 'completed' | 'incomplete'>('all');

  useEffect(() => {
    if (!userId) {
      navigate('/login');
    }
  }, [userId, navigate]);

  const filteredVisits = visits.filter(visit => {
    if (filter === 'completed') return visit.completed;
    if (filter === 'incomplete') return !visit.completed;
    return true;
  });

  const handleExport = () => {
    const csvContent = [
      ['Destination ID', 'Visit Date', 'Duration (min)', 'Completed', 'Created Date'],
      ...visits.map(v => [
        v.destination_id,
        v.visit_date,
        v.duration_minutes || 'N/A',
        v.completed ? 'Yes' : 'No',
        v.created_date
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `visit-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const stats = {
    total: visits.length,
    completed: visits.filter(v => v.completed).length,
    incomplete: visits.filter(v => !v.completed).length,
    uniqueDestinations: new Set(visits.map(v => v.destination_id)).size
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 pt-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </button>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Lịch sử ghé thăm
              </h1>
              <p className="text-sm text-gray-600">
                Xem lại các địa điểm bạn đã khám phá
              </p>
            </div>
            <button
              onClick={handleExport}
              disabled={visits.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Xuất CSV
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span className="text-xs text-gray-500">Tổng số</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-gray-500">Hoàn tất</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-orange-600" />
                <span className="text-xs text-gray-500">Chưa xong</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.incomplete}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-purple-600" />
                <span className="text-xs text-gray-500">Địa điểm</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.uniqueDestinations}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 bg-white rounded-lg p-2 border border-gray-200">
            <Filter className="w-4 h-4 text-gray-400 ml-2" />
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-sm font-medium rounded ${
                filter === 'all'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Tất cả ({stats.total})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1.5 text-sm font-medium rounded ${
                filter === 'completed'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Hoàn tất ({stats.completed})
            </button>
            <button
              onClick={() => setFilter('incomplete')}
              className={`px-3 py-1.5 text-sm font-medium rounded ${
                filter === 'incomplete'
                  ? 'bg-orange-100 text-orange-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Chưa xong ({stats.incomplete})
            </button>
            <button
              onClick={reload}
              className="ml-auto px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded"
            >
              Làm mới
            </button>
          </div>
        </div>

        {/* Visit List */}
        <VisitHistory 
          visits={filteredVisits} 
          loading={loading} 
          error={error}
          compact={false}
        />
      </div>
    </div>
  );
}
