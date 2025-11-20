# ✅ QUICK SETUP: User Authentication & CF Integration

## 🎯 Tóm tắt cực ngắn

**Frontend đã được update để sử dụng user_id THẬT từ backend login!**

---

## 🚀 Cách sử dụng (3 bước)

### 1. **Login để lấy user_id**
```
http://localhost:5173/login
```
- Nhập username + password
- Backend trả về `user_id`, frontend tự động lưu vào localStorage

### 2. **Test CF Features**
```
http://localhost:5173/result
```
- Click nút ❤️ Favorite → Gửi user_id thật
- Click ⭐ Rating → Gửi user_id thật
- Tất cả tracking → Gửi user_id thật

### 3. **Debug nếu lỗi**
```
http://localhost:5173/cf-api-test
```
- Xem user_id hiện tại
- Test từng API endpoint
- Xem error details trong console

---

## 💾 LocalStorage Keys

Sau khi login thành công:

```javascript
localStorage.getItem('cf_user_id')     // "123"
localStorage.getItem('username')       // "john_doe"
localStorage.getItem('user_role')      // "user"
localStorage.getItem('access_token')   // "eyJhbGc..."
```

---

## 🔍 Backend Requirements

**Login endpoint phải return:**
```json
{
  "access_token": "...",
  "token_type": "bearer",
  "user_id": 123,        ← BẮT BUỘC
  "username": "...",
  "role": "user"
}
```

**Endpoints đã implement:**
- ✅ `/auth/login` - OAuth2 form
- ✅ `/auth/login/json` - JSON body

---

## 🐛 Nếu CF API lỗi 500

### Nguyên nhân phổ biến:
1. **Tables chưa tồn tại** → Tạo tables (xem CF_DEBUG_GUIDE.md)
2. **user_id không tồn tại** → Đảm bảo user có trong database
3. **destination_id không hợp lệ** → Dùng ID của destination có trong DB
4. **Backend CF endpoints chưa implement** → Cần implement trước

### Quick check:
```bash
# Test backend CF API
curl http://localhost:8000/api/v1/favorites/user/1
```

Nếu 404 → Backend chưa có CF endpoints  
Nếu 500 → Xem backend logs  
Nếu 200 → ✅ OK!

---

## 📱 Test Flow

```
1. Login → user_id saved to localStorage
2. Go to /result
3. Click Favorite → Check DevTools Network tab
4. Request body có user_id thật? ✅
5. Backend response 200? ✅
6. Toast hiển thị? ✅
```

---

## 📚 Tài liệu đầy đủ

- **Setup chi tiết:** [AUTH_USER_ID_INTEGRATION.md](./AUTH_USER_ID_INTEGRATION.md)
- **Debug guide:** [CF_DEBUG_GUIDE.md](./CF_DEBUG_GUIDE.md)
- **CF Features:** [CF_INTEGRATION_SUMMARY.md](./CF_INTEGRATION_SUMMARY.md)

---

**Status:** ✅ Ready to use  
**Updated:** 2025-01-19
