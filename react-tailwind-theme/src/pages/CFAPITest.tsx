import { useState } from 'react';
import { cfService } from '../services/CFService';
import { getCurrentUserId, setCurrentUserId, getUserInfo, isUserLoggedIn } from '../utils/user';

export default function CFAPITest() {
  const [userId, setUserId] = useState(getCurrentUserId());
  const [destinationId, setDestinationId] = useState(1);
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const userInfo = getUserInfo();
  const loggedIn = isUserLoggedIn();

  const handleUpdateUserId = (newId: number) => {
    setUserId(newId);
    setCurrentUserId(newId);
  };

  const testHealthCheck = async () => {
    setLoading(true);
    try {
      const health = await cfService.healthCheck();
      setResult(JSON.stringify(health, null, 2));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const testAddFavorite = async () => {
    setLoading(true);
    try {
      const favorite = await cfService.addFavorite(userId, destinationId, 'Test note');
      setResult(JSON.stringify(favorite, null, 2));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const testGetFavorites = async () => {
    setLoading(true);
    try {
      const favorites = await cfService.getUserFavorites(userId);
      setResult(JSON.stringify(favorites, null, 2));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const testRemoveFavorite = async () => {
    setLoading(true);
    try {
      await cfService.removeFavorite(userId, destinationId);
      setResult('Favorite removed successfully');
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const testCreateRating = async () => {
    setLoading(true);
    try {
      const rating = await cfService.createRating(userId, destinationId, 4.5, 'Great place!');
      setResult(JSON.stringify(rating, null, 2));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const testGetRatings = async () => {
    setLoading(true);
    try {
      const ratings = await cfService.getUserRatings(userId);
      setResult(JSON.stringify(ratings, null, 2));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const testTrackFeedback = async () => {
    setLoading(true);
    try {
      const feedback = await cfService.trackFeedback(userId, destinationId, 'click', { test: true });
      setResult(JSON.stringify(feedback, null, 2));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 pt-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">CF API Test Page</h1>

        {/* User Info */}
        <div className={`rounded-lg p-4 mb-6 ${loggedIn ? 'bg-emerald-50 border border-emerald-200' : 'bg-yellow-50 border border-yellow-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-700">
                {loggedIn ? '✅ Logged In' : '⚠️ Not Logged In'}
              </p>
              <p className="text-sm text-gray-600">
                User: <strong>{userInfo.username}</strong> (ID: {userInfo.userId}) | Role: {userInfo.role}
              </p>
            </div>
            {!loggedIn && (
              <a 
                href="/login" 
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
              >
                Login
              </a>
            )}
          </div>
        </div>

        {/* Configuration */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-4">Configuration</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User ID
              </label>
              <input
                type="number"
                value={userId}
                onChange={(e) => handleUpdateUserId(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination ID
              </label>
              <input
                type="number"
                value={destinationId}
                onChange={(e) => setDestinationId(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-4">API Tests</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <button
              onClick={testHealthCheck}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Health Check
            </button>

            <button
              onClick={testAddFavorite}
              disabled={loading}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
            >
              Add Favorite
            </button>

            <button
              onClick={testGetFavorites}
              disabled={loading}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
            >
              Get Favorites
            </button>

            <button
              onClick={testRemoveFavorite}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              Remove Favorite
            </button>

            <button
              onClick={testCreateRating}
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              Create Rating
            </button>

            <button
              onClick={testGetRatings}
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              Get Ratings
            </button>

            <button
              onClick={testTrackFeedback}
              disabled={loading}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
            >
              Track Feedback
            </button>
          </div>
        </div>

        {/* Result */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Result</h2>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading...</p>
            </div>
          ) : (
            <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-sm">
              {result || 'Click a button to test API...'}
            </pre>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-2">
            🔍 How to Debug
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-yellow-800">
            <li>Open Browser DevTools (F12) → Console tab</li>
            <li>Click "Health Check" to verify API is running</li>
            <li>Try "Add Favorite" - check console for request details</li>
            <li>If error 500, check backend logs</li>
            <li>If CORS error, check backend CORS configuration</li>
            <li>Verify backend CF endpoints exist at <code>http://localhost:8000/api/v1/favorites/</code></li>
          </ol>
        </div>
      </div>
    </div>
  );
}
