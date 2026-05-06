# Student-Teacher Booking Appointment System

This is a MERN stack project designed to facilitate the booking of appointments between students and teachers. The system includes functionalities for admins to manage teachers, for teachers to manage their appointments, and for students to book appointments with teachers.

## Table of Contents
- [Features](#features)
- [System Modules](#system-modules)
  - [Admin](#admin)
  - [Teacher](#teacher)
  - [Student](#student)
- [Tech-Stack-Used](#tech-stack-used)
- [Installation](#installation)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Login Acess](#login)
- [Contributing](#contributing)

## Features
- Admin management for adding, updating, and deleting teachers, and managing student accounts.
- Teacher functionalities for managing their appointment schedules, approving/rejecting appointments, viewing notifications, and viewing all appointments.
- Student functionalities for booking appointments with teachers, viewing appointments status, and viewing notifications.

## System Modules

### Admin
- Login
- Add/Update/Delete Teacher
- Manage Student Accounts
- View All Appointments

### Teacher
- Login
- Manage Available Appointment Slots
- View Appointment Requests
- Approve/Reject Appointments
- View Notifications
- View All Appointments

### Student
- Login
- View Available Teachers and Appointment Slots
- Book Appointments
- Cancel Appointments
- View Appointment Status
- View Notifications

## Tech-Stack-Used

**Frontend**
```bash
vite (bundler-react)
tailwindcss (styling)
react-icons (icons)
react-router-dom (routing)
react-toastify (notify)
axios (API)
```
**Backend**
```bash
express (API)
mysql2 (MySQL driver)
jwt-token (token)
nodemailer (MAIL)
bcrypt (encryption)
```

## Installation

Để chạy dự án này trên máy local, làm theo các bước sau:

### 1. Cài đặt Node.js

Đảm bảo máy đã cài đặt **Node.js** (phiên bản 18 trở lên) và **npm**.

```bash
node --version  # Kiểm tra phiên bản Node.js
npm --version   # Kiểm tra phiên bản npm
```

### 2. Cài đặt backend dependencies

```bash
cd backend
npm install
```

### 3. Cài đặt frontend dependencies

```bash
cd frontend
npm install
```

### 4. Cấu hình biến môi trường cho Backend

Tạo file `.env` trong thư mục `backend/` với nội dung sau:

```env
# Cổng server
PORT=5000

# Chuỗi kết nối database MySQL
DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=booking_system
DB_PORT=3306

# Khóa JWT để mã hóa token
JWT_KEY='your-secret-key-change-in-production'
```

### 5. Cấu hình biến môi trường cho Frontend

Tạo file `.env.local` trong thư mục `frontend/` với nội dung sau:

```env
# URL backend API
VITE_BACKEND_URL='http://localhost:5000'
```

### 6. Khởi động Database

Đảm bảo **MySQL** đang chạy trên máy:

```bash
# Khởi động MySQL Server
mysql.server start

# Tạo database nếu chưa có
mysql -u root -p
CREATE DATABASE booking_system;
```

---

## Usage

### 1. Chạy Backend Server

```bash
cd backend
npm run dev
```

Backend sẽ chạy tại: `http://localhost:5000`

### 2. Chạy Frontend Server

Mở terminal mới và chạy:

```bash
cd frontend
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

### 3. Truy cập ứng dụng

Mở trình duyệt và truy cập: `http://localhost:5173`

---

## Tài khoản

Tất cả tài khoản (Admin, Giảng viên, Sinh viên) được cấp bởi nhà trường. Admin có quyền tạo, cập nhật và xóa tài khoản của giảng viên và sinh viên.

**Tài khoản Mặc định (mẫu):**

| Vai trò   | Email                  | Mật khẩu   |
|-----------|------------------------|------------|
| Admin     | admin                  | admin123   |
| Giảng viên| gv001@kontum.udn.vn    | pass123    |
| Sinh viên | sv001@kontum.udn.vn    | pass123    |

> Lưu ý: hiện tại backend cho phép lưu mật khẩu dạng plain text trong bảng `USERS` và sẽ so sánh trực tiếp nếu mật khẩu không phải hash.

### SQL tạo tài khoản mẫu

```sql
USE udck;

INSERT INTO USERS (Username, Password, Role, Status) VALUES
  ('admin', 'admin123', 'Admin', 'Active');
SET @admin_user_id = LAST_INSERT_ID();

INSERT INTO ADMIN (Full_Name, User_ID) VALUES
  ('Admin System', @admin_user_id);

INSERT INTO USERS (Username, Password, Role, Status) VALUES
  ('gv001', 'pass123', 'Lecturer', 'Active');
SET @lecturer_user_id = LAST_INSERT_ID();

INSERT INTO LECTURER (User_ID, Email, Full_Name) VALUES
  (@lecturer_user_id, 'gv001@kontum.udn.vn', 'Giảng viên 001');

INSERT INTO USERS (Username, Password, Role, Status) VALUES
  ('sv001', 'pass123', 'Student', 'Active');
SET @student_user_id = LAST_INSERT_ID();

INSERT INTO STUDENT (Student_ID, User_ID, Email, Full_Name, ClassName) VALUES
  (1, @student_user_id, 'sv001@kontum.udn.vn', 'Sinh viên 001', 'CNTT');
```

## Screenshots

Landing Page 

![landingpage](https://github.com/user-attachments/assets/80681180-c318-4aa8-bce4-25f7b1dcec5b)

Student Dashboard

![student dashboard](https://github.com/user-attachments/assets/fb4e5a37-6062-4db6-a1aa-2dc9cd4fbc49)

Teacher Dashboard

![teacher dashboard](https://github.com/user-attachments/assets/d9e034fa-5d25-4490-9179-5296b19b3536)


Admin Dashboard

![admin](https://github.com/user-attachments/assets/f1dd4c78-bf81-4ca8-9a7a-b803b303d474)

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create your feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Open a pull request.

## Thank You 

**Keep Coding**

