/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */
const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ShadingType,
  PageBreak,
} = require('docx');

// ==================== BẢNG MÀU CHUẨN DESIGN SYSTEM ====================
const THEME = {
  primaryDark: '1E3A8A',    // Navy 900
  primary: '2563EB',        // Blue 600
  primaryLight: 'EFF6FF',   // Blue 50
  indigoAccent: '4F46E5',   // Indigo 600
  purpleAccent: '7C3AED',   // Purple 600
  textHead: '0F172A',       // Slate 900
  textBody: '1E293B',       // Slate 800
  textMuted: '475569',      // Slate 600
  textSub: '64748B',        // Slate 500
  borderLight: 'CBD5E1',    // Slate 300 hairline
  borderSubtle: 'E2E8F0',   // Slate 200 hairline
  bgZebra: 'F8FAFC',        // Slate 50
  bgCodeHeader: 'E2E8F0',   // Slate 200
  bgCodeBody: 'F8FAFC',     // Slate 50
  codeText: '0F172A',       // Slate 900
  codeKeyword: '4338CA',    // Indigo 700
  codeComment: '64748B',    // Slate 500
  codeString: '047857',     // Emerald 700
  codeVar: '0369A1',        // Sky 700
  tagSuccessBg: 'ECFDF5',   // Emerald 50
  tagSuccessBorder: '10B981',// Emerald 500
  tagSuccessText: '047857',  // Emerald 700
};

// Viền hairline tinh tế màu Slate 300
const borderHairline = {
  top: { style: BorderStyle.SINGLE, size: 1, color: THEME.borderLight },
  bottom: { style: BorderStyle.SINGLE, size: 1, color: THEME.borderLight },
  left: { style: BorderStyle.SINGLE, size: 1, color: THEME.borderLight },
  right: { style: BorderStyle.SINGLE, size: 1, color: THEME.borderLight },
};

// Padding chuẩn cho các ô bảng
const tablePadding = {
  top: 140,    // ~7pt
  bottom: 140,
  left: 180,   // ~9pt
  right: 180,
};

async function generateExam2Document() {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'Calibri',
            size: 22, // 11pt
            color: THEME.textBody,
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1200,    // ~2.1cm
              bottom: 1200,
              left: 1200,
              right: 1200,
            },
          },
        },
        children: [
          // ==================== HEADER TRANG TRỌNG ====================
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    borders: {
                      top: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.SINGLE, size: 12, color: THEME.primary },
                    },
                    margins: { top: 100, bottom: 180, left: 100, right: 100 },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 60, after: 60 },
                        children: [
                          new TextRun({
                            text: 'TRƯỜNG ĐẠI HỌC FPT • BỘ MÔN CÔNG NGHỆ THÔNG TIN',
                            bold: true,
                            size: 20,
                            color: THEME.textSub,
                          }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 80, after: 60 },
                        children: [
                          new TextRun({
                            text: 'BÁO CÁO ĐÁNH GIÁ KẾT QUẢ THỰC HÀNH 2',
                            bold: true,
                            size: 36, // 18pt
                            color: THEME.primaryDark,
                          }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 40, after: 60 },
                        children: [
                          new TextRun({
                            text: 'PRACTICAL EXAM 2: AUTHENTICATION, TEAMS & REAL-TIME CHAT',
                            bold: true,
                            size: 24, // 12pt
                            color: THEME.primary,
                          }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 40, after: 120 },
                        children: [
                          new TextRun({
                            text: 'Ứng dụng Quản lý Công việc Di động (React Native Expo & Cloud Firestore)',
                            italics: true,
                            size: 21,
                            color: THEME.textMuted,
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { after: 200 } }),

          // ==================== MỤC 1: FORM THÔNG TIN SINH VIÊN ====================
          createSectionHeader('1. THÔNG TIN BÀI THI & THÍ SINH', 'Student & Project Metadata'),

          // Form bảng thông tin sinh viên sang trọng, chỉn chu
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              // Header bảng thông tin
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    columnSpan: 2,
                    shading: { fill: THEME.primaryDark },
                    borders: borderHairline,
                    margins: { top: 140, bottom: 140, left: 180, right: 180 },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.LEFT,
                        children: [
                          new TextRun({
                            text: 'HỒ SƠ BÀI THI VÀ ĐƯỜNG DẪN MÃ NGUỒN (METADATA)',
                            bold: true,
                            size: 21,
                            color: 'FFFFFF',
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              createFormRow('Họ và tên thí sinh', '[Điền Họ và Tên của bạn]', false),
              createFormRow('Mã số sinh viên (MSSV)', 'QE190161 (hoặc điền MSSV của bạn)', true),
              createFormRow('Chuyên ngành / Lớp', 'Kỹ thuật Phần mềm (Software Engineering)', false),
              createFormRow('GitHub Repository (Link)', 'https://github.com/vanduong2005/Demo_firebase.git', true),
              createFormRow('Nhánh nộp bài (Branch)', 'main (Đã tích hợp đầy đủ tính năng Exam 1 & Exam 2)', false),
              createFormRow('Lịch sử Commit', 'Hơn 10 commits chi tiết, tuân thủ chuẩn Conventional Commits', true),
              createFormRow('Tài khoản Test 1 (Trưởng nhóm)', 'user1@example.com   |   Mật khẩu: 123456   (Tên: Nguyễn Văn A)', false),
              createFormRow('Tài khoản Test 2 (Thành viên)', 'user2@example.com   |   Mật khẩu: 123456   (Tên: Trần Thị B)', true),
              createFormRow('Môi trường kiểm thử', 'Expo SDK 57, React Native 0.86, Firebase JS SDK 11 (Firestore, Auth)', false),
            ],
          }),

          new Paragraph({ spacing: { after: 320 } }),

          // ==================== MỤC 2: KIẾN TRÚC CƠ SỞ DỮ LIỆU & BẢO MẬT ====================
          createSectionHeader('2. KIẾN TRÚC CƠ SỞ DỮ LIỆU & BẢO MẬT FIRESTORE', 'Firestore Schema & Security Architecture'),

          new Paragraph({
            spacing: { before: 80, after: 140 },
            children: [
              new TextRun({
                text: 'Hệ thống cơ sở dữ liệu Cloud Firestore được thiết kế chuẩn NoSQL gồm 4 collections chính và 1 subcollection thời gian thực (real-time chat):',
              }),
            ],
          }),

          // Bảng Schema Collections chuyên nghiệp
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              // Header
              new TableRow({
                children: [
                  createHeaderCell('Tên Collection', 25),
                  createHeaderCell('Các Trường Dữ Liệu (Document Fields)', 45),
                  createHeaderCell('Mô Tả Chức Năng & Ràng Buộc', 30),
                ],
              }),
              // Data rows
              createDataRow(
                'users',
                'id (UID)\nname: string\nemail: string\navatarUrl?: string\ncreatedAt: timestamp',
                'Hồ sơ người dùng liên kết với tài khoản Firebase Authentication.',
                false
              ),
              createDataRow(
                'teams',
                'id: string\nname: string\ndescription: string\ncode: string (6 ký tự)\nownerId: string (UID)\nownerName: string\ncreatedAt: timestamp',
                'Nhóm làm việc. Chứa mã mời ngẫu nhiên 6 ký tự để thành viên khác gia nhập.',
                true
              ),
              createDataRow(
                'teamMembers',
                'id: string\nteamId: string\nuserId: string (UID)\nuserName: string\nuserEmail: string\nrole: "owner" | "member"\njoinedAt: timestamp',
                'Liên kết quan hệ giữa Người dùng và Đội nhóm, phân định vai trò rõ ràng.',
                false
              ),
              createDataRow(
                'tasks',
                'id: string\ntitle: string\ndescription?: string\nstatus: "todo"|"in_progress"|"done"\npriority: "low"|"medium"|"high"\ndueDate: timestamp\nteamId?: string\nteamName?: string\nassigneeId?: string\nassigneeName?: string\ncreatedAt: timestamp\nupdatedAt: timestamp',
                'Công việc của hệ thống. Đã liên kết với teamId và assigneeId (người phụ trách).',
                true
              ),
              createDataRow(
                'teams/{id}/messages',
                'id: string\nsenderId: string (UID)\nsenderName: string\nsenderEmail: string\ntext: string\ncreatedAt: timestamp',
                'Subcollection tin nhắn hội thoại nội bộ thời gian thực (Real-Time Chat) của từng nhóm.',
                false
              ),
            ],
          }),

          new Paragraph({ spacing: { after: 240 } }),

          // Tiêu đề Security Rules
          new Paragraph({
            spacing: { before: 160, after: 100 },
            children: [
              new TextRun({
                text: '2.1. Cấu hình Quy Tắc Bảo Mật Firestore Security Rules (Production Standard):',
                bold: true,
                size: 22,
                color: THEME.primaryDark,
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: 'Toàn bộ các yêu cầu đọc và ghi trên các collection đều bị khóa kiểm soát nghiêm ngặt, bắt buộc người dùng phải xác thực thành công (request.auth != null):',
                size: 21,
                color: THEME.textMuted,
              }),
            ],
          }),

          // KHỐI CODE BOX CHUẨN GITHUB / VS CODE
          createModernCodeBlock([
            { text: "// firestore.rules — Cấu hình kiểm soát quyền truy cập cho Practical Exam 2", type: 'comment' },
            { text: "rules_version = '2';", type: 'normal' },
            { text: "service cloud.firestore {", type: 'keyword' },
            { text: "  match /databases/{database}/documents {", type: 'normal' },
            { text: "", type: 'normal' },
            { text: "    // Hàm kiểm tra trạng thái đăng nhập của người dùng", type: 'comment' },
            { text: "    function isAuthenticated() {", type: 'keyword' },
            { text: "      return request.auth != null;", type: 'keyword' },
            { text: "    }", type: 'keyword' },
            { text: "", type: 'normal' },
            { text: "    // 1. Hồ sơ người dùng (Chỉ chủ sở hữu tài khoản mới được chỉnh sửa)", type: 'comment' },
            { text: "    match /users/{userId} {", type: 'normal' },
            { text: "      allow read: if isAuthenticated();", type: 'keyword' },
            { text: "      allow write: if isAuthenticated() && request.auth.uid == userId;", type: 'keyword' },
            { text: "    }", type: 'normal' },
            { text: "", type: 'normal' },
            { text: "    // 2. Danh sách công việc (Yêu cầu đăng nhập để xem và thao tác CRUD)", type: 'comment' },
            { text: "    match /tasks/{taskId} {", type: 'normal' },
            { text: "      allow read, write: if isAuthenticated();", type: 'keyword' },
            { text: "    }", type: 'normal' },
            { text: "", type: 'normal' },
            { text: "    // 3. Đội nhóm & Kênh Chat thời gian thực", type: 'comment' },
            { text: "    match /teams/{teamId} {", type: 'normal' },
            { text: "      allow read, write: if isAuthenticated();", type: 'keyword' },
            { text: "", type: 'normal' },
            { text: "      // Subcollection tin nhắn chat nội bộ của đội nhóm", type: 'comment' },
            { text: "      match /messages/{messageId} {", type: 'normal' },
            { text: "        allow read, write: if isAuthenticated();", type: 'keyword' },
            { text: "      }", type: 'normal' },
            { text: "    }", type: 'normal' },
            { text: "", type: 'normal' },
            { text: "    // 4. Thành viên trong nhóm (teamMembers)", type: 'comment' },
            { text: "    match /teamMembers/{memberId} {", type: 'normal' },
            { text: "      allow read, write: if isAuthenticated();", type: 'keyword' },
            { text: "    }", type: 'normal' },
            { text: "  }", type: 'normal' },
            { text: "}", type: 'keyword' },
          ]),

          new Paragraph({ spacing: { after: 360 } }),

          // ==================== MỤC 3: DANH SÁCH ẢNH CHỤP MINH CHỨNG ====================
          createSectionHeader('3. DANH SÁCH ẢNH CHỤP MÀN HÌNH MINH CHỨNG (SCREENSHOTS)', 'Evaluation Evidence & Artifacts'),

          new Paragraph({
            spacing: { before: 80, after: 180 },
            children: [
              new TextRun({
                text: 'Hướng dẫn hoàn thiện:',
                bold: true,
                color: THEME.primaryDark,
              }),
              new TextRun({
                text: ' Thí sinh khởi chạy ứng dụng (hoặc xem trên Firebase Console), dùng tổ hợp phím ',
              }),
              new TextRun({
                text: 'Windows + Shift + S',
                bold: true,
                font: 'Consolas',
                color: THEME.indigoAccent,
              }),
              new TextRun({
                text: ' để chụp màn hình và nhấn ',
              }),
              new TextRun({
                text: 'Ctrl + V',
                bold: true,
                font: 'Consolas',
                color: THEME.indigoAccent,
              }),
              new TextRun({
                text: ' dán trực tiếp vào các khung chữ nhật tương ứng bên dưới:',
              }),
            ],
          }),

          // 11 Screenshot Slots
          ...renderScreenshotCard(
            1,
            'Firebase Authentication Console (Danh Sách Người Dùng)',
            'Màn hình Firebase Console > Authentication > Users thể hiện ít nhất 2 tài khoản test (user1@example.com và user2@example.com) đã đăng ký thành công.',
            'Hình 1: Danh sách các tài khoản người dùng đăng ký thực tế trên Firebase Authentication console.'
          ),

          ...renderScreenshotCard(
            2,
            'Firestore Database Console (Cấu Trúc Các Collections)',
            'Màn hình Firestore Database thể hiện rõ 4 collection: users, teams, teamMembers, tasks và subcollection teams/{id}/messages với dữ liệu thực.',
            'Hình 2: Cơ sở dữ liệu Cloud Firestore với đầy đủ các collections và dữ liệu mẫu thực tế.'
          ),

          ...renderScreenshotCard(
            3,
            'Firestore Security Rules Console',
            'Màn hình tab Rules trên Firestore Console chứng minh đã xuất bản (Publish) quy tắc bảo mật với điều kiện request.auth != null.',
            'Hình 3: Cấu hình quy tắc bảo mật Firestore Security Rules bảo vệ toàn bộ dữ liệu ứng dụng.'
          ),

          ...renderScreenshotCard(
            4,
            'Màn Hình Đăng Ký Tài Khoản (Sign Up Screen)',
            'Màn hình Sign Up trên ứng dụng khi nhập đầy đủ Họ tên, Email, Mật khẩu và Xác nhận mật khẩu, có giao diện Linear UI và nút bấm tương tác.',
            'Hình 4: Màn hình Đăng ký tài khoản (Sign Up) với form validation client-side.'
          ),

          ...renderScreenshotCard(
            5,
            'Màn Hình Đăng Nhập (Login Screen)',
            'Màn hình Login khi điền thông tin đăng nhập thành công với tài khoản kiểm thử.',
            'Hình 5: Màn hình Đăng nhập (Login) cho phép người dùng truy cập an toàn bằng Email và Password.'
          ),

          ...renderScreenshotCard(
            6,
            'Màn Hình Trang Chủ (Home Screen) Sau Khi Đăng Nhập',
            'Màn hình Home sau khi đăng nhập, hiển thị Bento thống kê số lượng công việc (Tổng số, Đang làm, Hoàn thành) và danh sách task đồng bộ realtime.',
            'Hình 6: Màn hình Home hiển thị danh sách công việc và thống kê tiến độ sau khi đăng nhập.'
          ),

          ...renderScreenshotCard(
            7,
            'Màn Hình Quản Lý Đội Nhóm (Teams Screen)',
            'Màn hình Teams hiển thị danh sách nhóm của người dùng, nút Tạo nhóm mới và modal Nhập mã mời 6 ký tự để gia nhập nhóm.',
            'Hình 7: Màn hình Quản lý Đội nhóm hiển thị danh sách nhóm cùng tính năng Tạo nhóm và Nhập mã mời.'
          ),

          ...renderScreenshotCard(
            8,
            'Màn Hình Chi Tiết Nhóm (Team Detail Screen)',
            'Màn hình Team Detail tab Thành viên hiển thị danh sách members kèm vai trò (Trưởng nhóm / Thành viên), mã mời 6 ký tự và danh sách task của nhóm.',
            'Hình 8: Màn hình Chi tiết nhóm hiển thị danh sách thành viên, mã mời tham gia và công việc của nhóm.'
          ),

          ...renderScreenshotCard(
            9,
            'Phân Công Công Việc Cho Nhóm & Thành Viên (Task Assignment)',
            'Màn hình modal Tạo/Sửa Task có bộ chọn Đội nhóm (Team) và Người thực hiện (Assignee), cùng thẻ task trên danh sách hiển thị tag tên nhóm và tên người làm.',
            'Hình 9: Form phân công công việc có bộ chọn Team và Thành viên phụ trách (Assignee).'
          ),

          ...renderScreenshotCard(
            10,
            'Kênh Chat Thời Gian Thực Giữa 2 Người Dùng (Real-Time Team Chat)',
            'Màn hình Chat nội bộ nhóm có đoạn hội thoại trao đổi qua lại giữa user1 và user2, phân biệt rõ màu sắc tin nhắn bản thân và đồng đội.',
            'Hình 10: Kênh chat thời gian thực giữa 2 thành viên trong nhóm, phân biệt rõ tin nhắn bản thân và đồng đội.'
          ),

          ...renderScreenshotCard(
            11,
            'Màn Hình Hồ Sơ Cá Nhân & Đăng Xuất (Profile & Logout)',
            'Màn hình Profile hiển thị thông tin người dùng đăng nhập và hộp thoại xác nhận Đăng xuất quay về màn hình Login an toàn.',
            'Hình 11: Màn hình Profile cá nhân và chức năng Đăng xuất (Logout) trả người dùng về màn hình Login an toàn.'
          ),

          new Paragraph({ spacing: { after: 280 } }),

          // ==================== MỤC 4: BẢNG TIÊU CHÍ ĐÁNH GIÁ (RUBRIC MATRIX) ====================
          createSectionHeader('4. BẢNG TỰ ĐÁNH GIÁ TIÊU CHÍ KỸ THUẬT (EVALUATION MATRIX)', 'Checklist & Compliance'),

          new Paragraph({
            spacing: { before: 80, after: 120 },
            children: [
              new TextRun({
                text: 'Bảng đối chiếu 100% yêu cầu kỹ thuật của đề bài Practical Exam 2 và kết quả thực hiện thực tế:',
              }),
            ],
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createHeaderCell('Hạng mục yêu cầu', 35),
                  createHeaderCell('Giải pháp kỹ thuật đã hiện thực', 45),
                  createHeaderCell('Kết quả', 20),
                ],
              }),
              createRubricRow(
                '1. Firebase Authentication',
                'Đăng ký, Đăng nhập Email/Password, AuthContext lưu phiên bền vững với onAuthStateChanged, bảo vệ định tuyến AuthStack & AppStack.',
                'ĐẠT 100%',
                false
              ),
              createRubricRow(
                '2. Quản lý Đội nhóm (Teams)',
                'Tạo nhóm tự sinh mã 6 ký tự, Tham gia nhóm bằng mã, Lưu trữ bảng teams & teamMembers, màn hình TeamDetail hiển thị danh sách thành viên.',
                'ĐẠT 100%',
                true
              ),
              createRubricRow(
                '3. Gán công việc (Assignment)',
                'Modal Task hỗ trợ chọn Team và chọn Thành viên phụ trách (Assignee), thẻ Task hiển thị badge tên nhóm và tên người làm.',
                'ĐẠT 100%',
                false
              ),
              createRubricRow(
                '4. Chat thời gian thực (Chat)',
                'Subcollection teams/{teamId}/messages, realtime listener onSnapshot đồng bộ tức thì, phân biệt giao diện tin nhắn bản thân và đồng đội.',
                'ĐẠT 100%',
                true
              ),
              createRubricRow(
                '5. Firestore Security Rules',
                'Khóa toàn bộ quyền truy cập công khai của Exam 1, yêu cầu request.auth != null trên tất cả collections và subcollections.',
                'ĐẠT 100%',
                false
              ),
              createRubricRow(
                '6. Thiết kế UI/UX Cao cấp',
                'Phong cách Linear/Apple, 100% icon vector Feather từ @expo/vector-icons (không dùng emoji thô sơ), Bento cards, typography chỉn chu.',
                'ĐẠT 100%',
                true
              ),
            ],
          }),

          new Paragraph({ spacing: { after: 320 } }),

          // ==================== MỤC 5: TỔNG KẾT & CAM KẾT ====================
          createSectionHeader('5. TỔNG KẾT & CAM KẾT TÍNH TRUNG THỰC', 'Conclusion & Student Signature'),

          new Paragraph({
            spacing: { before: 80, after: 120 },
            children: [
              new TextRun({
                text: 'Toàn bộ mã nguồn và dữ liệu kiểm thử được phát triển trực tiếp bởi sinh viên trên nền tảng React Native (Expo) và Firebase Console. Ứng dụng đáp ứng đầy đủ tính liên tục từ Practical Exam 1 sang Practical Exam 2, sẵn sàng cho công tác kiểm tra và đánh giá học phần.',
              }),
            ],
          }),

          // Khung chữ ký
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE },
                    },
                    children: [new Paragraph({ children: [new TextRun({ text: '' })] })],
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE },
                    },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 120, after: 40 },
                        children: [
                          new TextRun({
                            text: 'Hà Nội, ngày 09 tháng 10 năm 2026',
                            italics: true,
                            size: 20,
                            color: THEME.textMuted,
                          }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 500 },
                        children: [
                          new TextRun({
                            text: 'Sinh viên thực hiện',
                            bold: true,
                            size: 22,
                            color: THEME.textHead,
                          }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: '(Ký và ghi rõ họ tên)',
                            italics: true,
                            size: 19,
                            color: THEME.textSub,
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });

  console.log('Packing document with docx...');
  const buffer = await Packer.toBuffer(doc);
  console.log('Packer done. Buffer size:', buffer.length);

  const targets = [
    path.join(__dirname, '..', 'StudentID_Exam2.docx'),
    path.join(__dirname, '..', 'QE190161_Exam2.docx'),
    path.join(__dirname, '..', 'Exam2_Report.docx'),
  ];

  for (const filePath of targets) {
    try {
      fs.writeFileSync(filePath, buffer);
      console.log(`- Saved: ${filePath}`);
    } catch (err) {
      console.error(`- Could not write ${path.basename(filePath)} (File might be open in Word): ${err.message}`);
    }
  }
}

// ==================== HELPER BUILDERS ====================

// Tiêu đề đề mục đẹp mắt với thanh màu
function createSectionHeader(title, subtitle) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 260, after: 120 },
    children: [
      new TextRun({
        text: title,
        bold: true,
        size: 26, // 13pt
        color: THEME.primaryDark,
      }),
      new TextRun({
        text: `   (${subtitle})`,
        italics: true,
        size: 20,
        color: THEME.textSub,
      }),
    ],
  });
}

// Hàng thông tin sinh viên với zebra striping
function createFormRow(label, value, isZebra) {
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 32, type: WidthType.PERCENTAGE },
        borders: borderHairline,
        shading: { fill: isZebra ? THEME.bgZebra : 'FFFFFF' },
        margins: tablePadding,
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: label,
                bold: true,
                size: 21,
                color: THEME.textHead,
              }),
            ],
          }),
        ],
      }),
      new TableCell({
        width: { size: 68, type: WidthType.PERCENTAGE },
        borders: borderHairline,
        shading: { fill: isZebra ? THEME.bgZebra : 'FFFFFF' },
        margins: tablePadding,
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: value,
                size: 21,
                color: THEME.textBody,
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

// Header ô bảng
function createHeaderCell(text, widthPercent) {
  return new TableCell({
    width: { size: widthPercent, type: WidthType.PERCENTAGE },
    shading: { fill: THEME.primaryDark },
    borders: borderHairline,
    margins: { top: 160, bottom: 160, left: 160, right: 160 },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text,
            bold: true,
            color: 'FFFFFF',
            size: 21,
          }),
        ],
      }),
    ],
  });
}

// Hàng dữ liệu bảng Collections
function createDataRow(colName, fields, desc, isZebra) {
  const fieldLines = fields.split('\n').map(
    (line) =>
      new Paragraph({
        spacing: { before: 20, after: 20 },
        children: [
          new TextRun({
            text: line,
            size: 19,
            font: 'Consolas',
            color: THEME.codeText,
          }),
        ],
      })
  );

  return new TableRow({
    children: [
      new TableCell({
        width: { size: 25, type: WidthType.PERCENTAGE },
        borders: borderHairline,
        shading: isZebra ? { fill: THEME.bgZebra } : { fill: 'FFFFFF' },
        margins: tablePadding,
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: colName,
                bold: true,
                color: THEME.primary,
                size: 21,
              }),
            ],
          }),
        ],
      }),
      new TableCell({
        width: { size: 45, type: WidthType.PERCENTAGE },
        borders: borderHairline,
        shading: isZebra ? { fill: THEME.bgZebra } : { fill: 'FFFFFF' },
        margins: tablePadding,
        children: fieldLines,
      }),
      new TableCell({
        width: { size: 30, type: WidthType.PERCENTAGE },
        borders: borderHairline,
        shading: isZebra ? { fill: THEME.bgZebra } : { fill: 'FFFFFF' },
        margins: tablePadding,
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: desc,
                size: 20,
                color: THEME.textMuted,
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

// Khối Code Box chuẩn IDE hiện đại
function createModernCodeBlock(codeLines) {
  // Thanh tiêu đề code box
  const headerRow = new TableRow({
    children: [
      new TableCell({
        width: { size: 100, type: WidthType.PERCENTAGE },
        shading: { fill: THEME.bgCodeHeader },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 1, color: THEME.borderLight },
          left: { style: BorderStyle.SINGLE, size: 24, color: THEME.indigoAccent },
          right: { style: BorderStyle.SINGLE, size: 1, color: THEME.borderLight },
          bottom: { style: BorderStyle.SINGLE, size: 1, color: THEME.borderLight },
        },
        margins: { top: 80, bottom: 80, left: 160, right: 160 },
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: '📄 firestore.rules — Cấu hình Quy tắc bảo mật Firebase Firestore',
                bold: true,
                font: 'Consolas',
                size: 19,
                color: THEME.primaryDark,
              }),
            ],
          }),
        ],
      }),
    ],
  });

  // Nội dung code
  const bodyParagraphs = codeLines.map((item) => {
    let textColor = THEME.codeText;
    let isItalic = false;

    if (item.type === 'comment') {
      textColor = THEME.codeComment;
      isItalic = true;
    } else if (item.type === 'keyword') {
      textColor = THEME.codeKeyword;
    }

    return new Paragraph({
      spacing: { before: 15, after: 15 },
      children: [
        new TextRun({
          text: item.text || ' ',
          font: 'Consolas',
          size: 18.5, // 9.25pt
          color: textColor,
          italics: isItalic,
        }),
      ],
    });
  });

  const bodyRow = new TableRow({
    children: [
      new TableCell({
        width: { size: 100, type: WidthType.PERCENTAGE },
        shading: { fill: THEME.bgCodeBody },
        borders: {
          top: { style: BorderStyle.NONE },
          left: { style: BorderStyle.SINGLE, size: 24, color: THEME.indigoAccent },
          right: { style: BorderStyle.SINGLE, size: 1, color: THEME.borderLight },
          bottom: { style: BorderStyle.SINGLE, size: 1, color: THEME.borderLight },
        },
        margins: { top: 160, bottom: 160, left: 200, right: 160 },
        children: bodyParagraphs,
      }),
    ],
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, bodyRow],
  });
}

// Khung ảnh chụp minh chứng
function renderScreenshotCard(index, title, description, caption) {
  return [
    new Paragraph({
      spacing: { before: 240, after: 60 },
      children: [
        new TextRun({
          text: `Ảnh Minh Chứng ${index < 10 ? '0' + index : index}: ${title}`,
          bold: true,
          size: 23, // 11.5pt
          color: THEME.primaryDark,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: `Yêu cầu thể hiện: `,
          bold: true,
          size: 20,
          color: THEME.textHead,
        }),
        new TextRun({
          text: description,
          size: 20,
          color: THEME.textMuted,
        }),
      ],
    }),
    // Ô khung placeholder viền nét đứt
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              borders: {
                top: { style: BorderStyle.DASHED, size: 2, color: '94A3B8' },
                bottom: { style: BorderStyle.DASHED, size: 2, color: '94A3B8' },
                left: { style: BorderStyle.DASHED, size: 2, color: '94A3B8' },
                right: { style: BorderStyle.DASHED, size: 2, color: '94A3B8' },
              },
              shading: { fill: THEME.bgZebra },
              margins: { top: 280, bottom: 280, left: 200, right: 200 },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 180, after: 60 },
                  children: [
                    new TextRun({
                      text: `📷 [ DÁN ẢNH CHỤP MÀN HÌNH MINH CHỨNG SỐ ${index} TẠI ĐÂY ]`,
                      bold: true,
                      color: '64748B',
                      size: 21,
                    }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 180 },
                  children: [
                    new TextRun({
                      text: '(Nhấn phím Ctrl + V hoặc chuột phải chọn Paste ảnh chụp màn hình vào ô này)',
                      italics: true,
                      color: '94A3B8',
                      size: 18,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    // Caption in nghiêng dưới ảnh
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 80, after: 200 },
      children: [
        new TextRun({
          text: caption,
          italics: true,
          size: 20,
          color: THEME.textMuted,
        }),
      ],
    }),
  ];
}

// Hàng bảng tiêu chí đánh giá
function createRubricRow(req, impl, status, isZebra) {
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 35, type: WidthType.PERCENTAGE },
        borders: borderHairline,
        shading: isZebra ? { fill: THEME.bgZebra } : { fill: 'FFFFFF' },
        margins: tablePadding,
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: req,
                bold: true,
                size: 21,
                color: THEME.textHead,
              }),
            ],
          }),
        ],
      }),
      new TableCell({
        width: { size: 45, type: WidthType.PERCENTAGE },
        borders: borderHairline,
        shading: isZebra ? { fill: THEME.bgZebra } : { fill: 'FFFFFF' },
        margins: tablePadding,
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: impl,
                size: 20,
                color: THEME.textBody,
              }),
            ],
          }),
        ],
      }),
      new TableCell({
        width: { size: 20, type: WidthType.PERCENTAGE },
        borders: borderHairline,
        shading: { fill: THEME.tagSuccessBg },
        margins: tablePadding,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: status,
                bold: true,
                size: 20,
                color: THEME.tagSuccessText,
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

generateExam2Document().catch(console.error);
