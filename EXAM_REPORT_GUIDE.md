# BÁO CÁO BÀI THI THỰC HÀNH 1 (PRACTICAL EXAM 1)

**Môn học:** Lập trình Di động / React Native & Cloud Backend  
**Họ và tên sinh viên:** [Điền họ và tên của bạn]  
**Mã số sinh viên (StudentID):** [Điền MSSV của bạn]  
**Tên file nộp bài:** `[StudentID]_Exam1.docx` (Ví dụ: `SE123456_Exam1.docx`)

---

## 1. THÔNG TIN DỰ ÁN & ĐƯỜNG DẪN TRUY CẬP (LINKS)

- **Public GitHub Repository:** `[Dán link GitHub repo của bạn ở đây, ví dụ: https://github.com/username/task-management-app]`
- **Cam kết số lượng commit:** Tối thiểu 7 commits tuân thủ Conventional Commits (`chore:`, `feat:`, `docs:`).
- **Expo Project Link / QR Code:** `[Dán link Expo hoặc mã QR khi chạy npx expo start]`

---

## 2. MÔ TẢ MÔ HÌNH DỮ LIỆU FIRESTORE (DATA MODEL)

Ứng dụng sử dụng cơ sở dữ liệu NoSQL **Cloud Firestore**, lưu trữ dữ liệu tại collection **`tasks`**.

### Bảng đặc tả các trường dữ liệu (Document Schema):

| Tên trường (Field) | Kiểu dữ liệu (Type)  | Bắt buộc | Mô tả chi tiết                                                     |
| ------------------ | -------------------- | :------: | ------------------------------------------------------------------ |
| `id`               | `string`             |    Có    | Document ID được Firestore sinh tự động (Auto-generated UID).      |
| `title`            | `string`             |    Có    | Tiêu đề công việc cần thực hiện (Ví dụ: "Học React Native").       |
| `description`      | `string`             |  Không   | Mô tả chi tiết về nội dung công việc cần làm.                      |
| `status`           | `string`             |    Có    | Trạng thái công việc: `'To Do'`, `'In Progress'`, `'Done'`.        |
| `priority`         | `string`             |    Có    | Mức độ ưu tiên: `'Low'`, `'Medium'`, `'High'`.                     |
| `dueDate`          | `string \| null`     |  Không   | Hạn chót hoàn thành (Ví dụ: "2026-10-15").                         |
| `createdAt`        | `Timestamp / number` |    Có    | Thời điểm tạo task (Firestore `serverTimestamp()` / Epoch millis). |
| `updatedAt`        | `Timestamp / number` |  Không   | Thời điểm cập nhật task lần gần nhất.                              |
| `teamId`           | `string \| null`     |  Không   | Mã định danh nhóm (dành cho Practical Exam 2).                     |
| `assigneeId`       | `string \| null`     |  Không   | Mã định danh người được giao (dành cho Practical Exam 2).          |

---

## 3. DANH SÁCH ẢNH CHỤP MÀN HÌNH MINH CHỨNG (SCREENSHOTS CHECKLIST)

> _Gợi ý: Dán trực tiếp các ảnh chụp màn hình tương ứng vào các mục bên dưới trong file Word trước khi xuất file._

### Ảnh 1: Firebase Console - Firestore Database

- **Hình ảnh:** _(Chụp giao diện trang Firebase Console -> Cloud Firestore -> Tab Data -> collection `tasks`)_
- **Chú thích (Caption):** _Hình 1: Minh chứng cấu hình collection `tasks` trên Firebase Console với các document mẫu chứa đầy đủ các trường id, title, description, status, priority, dueDate, createdAt._

### Ảnh 2: Giao diện Home Screen tổng quan

- **Hình ảnh:** _(Chụp toàn màn hình Home Screen khi mở app, có Header, thẻ thống kê số lượng task, các nút lọc trạng thái và thanh Bottom Tabs)_
- **Chú thích (Caption):** _Hình 2: Giao diện Home Screen hiển thị tiêu đề ứng dụng, thanh thống kê tiến độ công việc, bộ lọc trạng thái và danh sách công việc đồng bộ Real-time từ Firebase._

### Ảnh 3: Form tạo Task (Create Task Modal) đang điền thông tin

- **Hình ảnh:** _(Chụp khi bấm nút "Tạo mới" hoặc "＋ Thêm công việc ngay", form modal hiện lên và bạn đã nhập tiêu đề, mô tả, chọn độ ưu tiên và ngày hạn chót)_
- **Chú thích (Caption):** _Hình 3: Modal "Tạo Công Việc Mới" với đầy đủ các trường thông tin (Title, Description, Status, Priority chips, Due Date) trước khi nhấn nút "Tạo Mới"._

### Ảnh 4: Danh sách Task sau khi tạo thành công

- **Hình ảnh:** _(Chụp danh sách Task hiển thị công việc mới vừa tạo xuất hiện trên đầu danh sách)_
- **Chú thích (Caption):** _Hình 4: Công việc mới được tạo thành công và tự động hiển thị ngay lập tức trên màn hình nhờ Firestore Real-time listener (`onSnapshot`)._

### Ảnh 5: Form chỉnh sửa Task (Edit Task Modal)

- **Hình ảnh:** _(Chụp khi nhấn icon cây bút ✏️ trên một Task card, modal hiện lên với dữ liệu cũ được điền sẵn và bạn thay đổi nội dung)_
- **Chú thích (Caption):** _Hình 5: Modal "Chỉnh Sửa Công Việc" với dữ liệu task cũ được nạp sẵn, cho phép cập nhật tiêu đề, mô tả, mức độ ưu tiên hoặc trạng thái._

### Ảnh 6: Danh sách Task sau khi chỉnh sửa thành công

- **Hình ảnh:** _(Chụp danh sách Task hiển thị nội dung mới của công việc đã sửa)_
- **Chú thích (Caption):** _Hình 6: Công việc sau khi được cập nhật thành công, thông tin thay đổi được phản ánh tức thì trên danh sách._

### Ảnh 7: Danh sách Task sau khi xóa một công việc

- **Hình ảnh:** _(Chụp popup xác nhận xóa "Bạn có chắc chắn muốn xóa..." và danh sách sau khi task đó đã biến mất)_
- **Chú thích (Caption):** _Hình 7: Minh chứng chức năng Xóa (Delete): sau khi người dùng xác nhận tại hộp thoại cảnh báo, document tương ứng được xóa khỏi Firestore và giao diện cập nhật ngay._

### Ảnh 8: Bottom Navigation & Màn hình "Coming Soon" Teams

- **Hình ảnh:** _(Chụp khi bấm tab "Teams" ở thanh điều hướng phía dưới)_
- **Chú thích (Caption):** _Hình 8: Thanh Bottom Tab Navigation và màn hình placeholder "Coming Soon" của phân hệ Teams (chuẩn bị cho Practical Exam 2)._

### Ảnh 9: Màn hình "Coming Soon" Profile

- **Hình ảnh:** _(Chụp khi bấm tab "Profile" ở thanh điều hướng phía dưới)_
- **Chú thích (Caption):** _Hình 9: Màn hình placeholder "Coming Soon" của phân hệ Profile cá nhân._

---

## 4. TÍNH NĂNG ĐIỂM THƯỞNG ĐÃ TRIỂN KHAI (BONUS FEATURES)

1. **Client-side Form Validation:** Kiểm tra bắt buộc nhập trường `title`, loại bỏ khoảng trắng thừa (`trim()`), hiển thị thông báo lỗi trực quan trên Modal.
2. **Status Filter:** Cho phép lọc nhanh danh sách theo các trạng thái: `All`, `To Do`, `In Progress`, `Done`.
3. **Thanh thống kê tổng quan (Metrics Card):** Đếm động số lượng tổng task, số task To Do, In Progress và Done theo thời gian thực.
4. **Pull-to-refresh:** Kéo xuống để làm mới danh sách mượt mà với `RefreshControl`.
5. **Code Quality & CI Automation:**
   - Cấu hình chuẩn **ESLint** và **Prettier**.
   - Thiết lập quy trình **GitHub Actions CI** (`.github/workflows/ci.yml`) tự động kiểm tra TypeScript và ESLint trên mỗi lần Push / Pull Request.
6. **Tài liệu README chuẩn:** Có sơ đồ thực thể liên kết **ERD (Mermaid diagram)** và bảng mô tả kiến trúc thư mục.
