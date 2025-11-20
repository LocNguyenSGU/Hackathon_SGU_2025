// User management for CF features
// Uses real user_id from authentication

const USER_ID_KEY = 'cf_user_id';

export function getCurrentUserId(): number {
  // Try to get from localStorage (set during login)
  const stored = localStorage.getItem(USER_ID_KEY);
  if (stored) {
    const userId = parseInt(stored, 10);
    if (!isNaN(userId) && userId > 0) {
      return userId;
    }
  }

  // If not logged in, return guest user ID (1)
  // You can change this behavior: throw error, redirect to login, etc.
  console.warn('⚠️ No user_id found in localStorage. Using guest ID = 1');
  return 1; // Default guest user
}

export function setCurrentUserId(userId: number): void {
  if (!userId || userId <= 0) {
    console.error('❌ Invalid user_id:', userId);
    return;
  }
  localStorage.setItem(USER_ID_KEY, userId.toString());
  console.log('✅ User ID set:', userId);
}

export function clearCurrentUserId(): void {
  localStorage.removeItem(USER_ID_KEY);
  console.log('🔄 User ID cleared');
}

export function isUserLoggedIn(): boolean {
  const userId = localStorage.getItem(USER_ID_KEY);
  const token = localStorage.getItem('access_token');
  return !!(userId && token);
}

export function getUserInfo() {
  return {
    userId: getCurrentUserId(),
    username: localStorage.getItem('username') || 'Guest',
    role: localStorage.getItem('user_role') || 'user'
  };
}

export function logout(): void {
  // Clear all user-related data
  localStorage.removeItem('cf_user_id');
  localStorage.removeItem('username');
  localStorage.removeItem('user_role');
  localStorage.removeItem('access_token');
  localStorage.removeItem('token_type');
  console.log('🔄 User logged out');
}
