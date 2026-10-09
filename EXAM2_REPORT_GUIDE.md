# BÁO CÁO BÀI THI THỰC HÀNH 2 (PRACTICAL EXAM 2)
**Môn học:** Lập trình Di động / React Native, Firebase Auth & Real-Time Cloud  
**Họ và tên sinh viên:** [Điền họ và tên của bạn]  
**Mã số sinh viên (StudentID):** [Điền MSSV của bạn, ví dụ: QE123456]  
**Tên file nộp bài (Bắt buộc đúng định dạng):** `[StudentID]_Exam2.docx` (Ví dụ: `QE123456_Exam2.docx`)

---

## 1. THÔNG TIN DỰ ÁN & ĐƯỜNG DẪN TRUY CẬP (LINKS)

- **Public GitHub Repository:** `[Dán link GitHub repo tiếp tục từ Exam 1 ở đây]`
- **Cam kết commit:** Lịch sử commit tiếp nối liên tục từ Exam 1 với các commits rõ ràng (`feat(auth):`, `feat(teams):`, `feat(chat):`, `feat(security):`).
- **Expo Project Link / QR Code:** `[Dán link Expo hoặc mã QR khi chạy npx expo start]`
- **Tài khoản kiểm thử (2 Test Users):**
  - **User 1 (Owner):** `user1@example.com` / Mật khẩu: `123456` (Tên: Nguyễn Văn A)
  - **User 2 (Member):** `user2@example.com` / Mật khẩu: `123456` (Tên: Trần Thị B)

---

## 2. MÔ TẢ KIẾN TRÚC DỮ LIỆU FIRESTORE & BẢO MẬT (DATA MODEL & SECURITY)

Hệ thống lưu trữ trên **Cloud Firestore** gồm 4 collections chính và 1 subcollection:
1. **`users`**: `{ id, name, email, avatarUrl, createdAt }`
2. **`teams`**: `{ id, name, description, code, ownerId, ownerName, createdAt }`
3. **`teamMembers`**: `{ id, teamId, userId, userName, userEmail, role, joinedAt }`
4. **`tasks`**: `{ id, title, description, status, priority, dueDate, teamId, teamName, assigneeId, assigneeName, createdAt, updatedAt }`
5. **`teams/{teamId}/messages` (Subcollection Chat)**: `{ id, senderId, senderName, senderEmail, text, createdAt }`

### Firestore Security Rules:
Đã thay thế test mode thành quy tắc yêu cầu xác thực `request.auth != null`:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() { return request.auth != null; }
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && request.auth.uid == userId;
    }
    match /tasks/{taskId} { allow read, write: if isAuthenticated(); }
    match /teams/{teamId} {
      allow read, write: if isAuthenticated();
      match /messages/{messageId} { allow read, write: if isAuthenticated(); }
    }
    match /teamMembers/{memberId} { allow read, write: if isAuthenticated(); }
  }
}
```

---

## 3. DANH SÁCH ẢNH CHỤP MÀN HÌNH MINH CHỨNG (SCREENSHOTS CHECKLIST)

> *Gợi ý: Sao chép bảng này vào file Word `StudentID_Exam2.docx` và dán ảnh chụp màn hình tương ứng vào từng mục.*

### Ảnh 1: Firebase Authentication Console
- **Hình ảnh:** *(Chụp trang Firebase Console -> Authentication -> Users)*
- **Chú thích (Caption):** *Hình 1: Danh sách các tài khoản người dùng đăng ký thực tế (gồm ít nhất 2 test users) trên Firebase Authentication console.*

### Ảnh 2: Firestore Database Console (Các Collections & Subcollections)
- **Hình ảnh:** *(Chụp Firebase Console -> Firestore Database hiển thị các collection `users`, `teams`, `teamMembers`, `tasks`, và subcollection `messages`)*
- **Chú thích (Caption):** *Hình 2: Minh chứng cơ sở dữ liệu Firestore với đầy đủ các collections `users`, `teams`, `teamMembers`, `tasks` và subcollection `messages`.*

### Ảnh 3: Firestore Security Rules Console
- **Hình ảnh:** *(Chụp tab Rules trên Firestore Console)*
- **Chú thích (Caption):** *Hình 3: Cấu hình Firestore Security Rules bảo vệ toàn bộ dữ liệu, yêu cầu người dùng phải xác thực (request.auth != null).*

### Ảnh 4: Màn hình Đăng Ký (Sign Up Screen)
- **Hình ảnh:** *(Chụp màn hình Đăng ký tài khoản với các trường Họ tên, Email, Mật khẩu và Xác nhận mật khẩu)*
- **Chú thích (Caption):** *Hình 4: Màn hình Sign Up với giao diện tối giản hiện đại, kiểm tra validation client-side trước khi tạo tài khoản Firebase Auth.*

### Ảnh 5: Màn hình Đăng Nhập (Login Screen)
- **Hình ảnh:** *(Chụp màn hình Đăng nhập khi điền tài khoản test user)*
- **Chú thích (Caption):** *Hình 5: Màn hình Login cho phép người dùng đăng nhập bằng Email và Password.*

### Ảnh 6: Màn hình Home Screen sau khi đăng nhập
- **Hình ảnh:** *(Chụp màn hình Home Screen hiển thị danh sách nhiệm vụ của các nhóm mà người dùng tham gia)*
- **Chú thích (Caption):** *Hình 6: Màn hình Home được bảo vệ sau đăng nhập, hiển thị thống kê và danh sách công việc đồng bộ Real-Time.*

### Ảnh 7: Màn hình Quản Lý Đội Nhóm (Teams Screen)
- **Hình ảnh:** *(Chụp màn hình Teams danh sách nhóm, modal Tạo nhóm hoặc modal Nhập mã tham gia)*
- **Chú thích (Caption):** *Hình 7: Màn hình Teams hiển thị danh sách các nhóm đã tham gia cùng chức năng Tạo nhóm mới và Tham gia nhóm bằng mã mời.*

### Ảnh 8: Màn hình Chi Tiết Nhóm (Team Detail Screen)
- **Hình ảnh:** *(Chụp màn hình Team Detail tab Thành viên hiển thị danh sách members kèm vai trò, và tab Công việc của nhóm)*
- **Chú thích (Caption):** *Hình 8: Màn hình Team Detail hiển thị danh sách thành viên trong nhóm, mã mời tham gia và danh sách công việc được phân công.*

### Ảnh 9: Giao việc cho Nhóm & Thành viên (Task Assignment)
- **Hình ảnh:** *(Chụp modal tạo/sửa task có chọn Team và Assignee, cùng thẻ task trên danh sách hiển thị tên nhóm và tên người thực hiện)*
- **Chú thích (Caption):** *Hình 9: Form tạo/chỉnh sửa công việc có bộ chọn Team và thành viên phụ trách (Assignee), hiển thị rõ tên người phụ trách trên thẻ công việc.*

### Ảnh 10: Kênh Chat Real-Time giữa 2 Người Dùng (Team Chat)
- **Hình ảnh:** *(Chụp màn hình Chat Screen có đoạn hội thoại qua lại giữa 2 tài khoản khác nhau với timestamp rõ ràng)*
- **Chú thích (Caption):** *Hình 10: Kênh chat Real-Time giữa 2 thành viên trong nhóm, phân biệt rõ tin nhắn của bản thân và đồng đội kèm thời gian gửi.*

### Ảnh 11: Màn hình Profile và Đăng Xuất (Logout)
- **Hình ảnh:** *(Chụp màn hình Profile hiển thị thông tin tài khoản và popup xác nhận Đăng xuất, sau đó app tự động quay về màn hình Login)*
- **Chú thích (Caption):** *Hình 11: Màn hình Profile cá nhân và chức năng Đăng xuất (Logout) trả người dùng về màn hình Login an toàn.*
