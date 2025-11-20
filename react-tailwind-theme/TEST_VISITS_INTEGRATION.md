# 🧪 TEST VISITS INTEGRATION

## Test Steps:

### 1. Test Auto Visit Logging
```bash
# Go to Result page
http://localhost:5173/result

# Actions that trigger visit log:
1. Click Favorite button on any location → Check console for "✅ Visit logged"
2. Click Rating button → Check console for "✅ Visit logged"
3. View location details for 5+ seconds → Check console for "✅ Visit logged"
```

### 2. Test Visit History Page
```bash
# Go to Visits page
http://localhost:5173/visits

# You should see:
1. Statistics (total, completed, incomplete, unique destinations)
2. Filters (All, Completed, Incomplete)
3. List of all visits with:
   - Destination ID
   - Visit date/time
   - Duration
   - Status (Hoàn tất / Chưa xong)
```

### 3. Test CSV Export
```bash
# On Visits page:
1. Click "Xuất CSV" button
2. CSV file should download with format:
   Destination ID,Visit Date,Duration (min),Completed,Created Date
   3,2025-11-20T14:30:00,120,Yes,2025-11-20T16:30:00
```

### 4. Test with Backend API
```bash
# Make sure backend is running on http://localhost:8000

# Test log visit:
curl -X POST http://localhost:8000/api/v1/visits/ \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "destination_id": 3,
    "visit_date": "2025-11-20T14:30:00",
    "duration_minutes": 120,
    "completed": true
  }'

# Test get user visits:
curl http://localhost:8000/api/v1/visits/user/1
```

---

## ✅ Expected Results:

### Console Logs:
```
🔵 Creating visit: {user_id: 1, destination_id: 3, ...}
✅ Visit logged for destination 3
```

### Visit History Page:
- Shows all visits
- Filter works correctly
- CSV export downloads file
- Statistics calculate correctly

### Auto-Visit Tracking:
- Favorite → immediate log
- Rating → immediate log
- View details → log after 5 seconds

---

## 🐛 Troubleshooting:

### If visits don't show up:
1. Check backend is running
2. Check console for errors
3. Check network tab for API calls
4. Check user_id is valid

### If CSV doesn't download:
1. Check browser download settings
2. Check if visits array has data
3. Check console for errors

---

## 📝 Next Steps:

1. [ ] Test with real backend
2. [ ] Add visit indicators on location cards
3. [ ] Add visit count badges
4. [ ] Test CSV export with large dataset
5. [ ] Add visit calendar/heatmap view
