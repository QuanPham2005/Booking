# Slots Endpoint Postmortem

## Incident

- Endpoint `GET /api/v1/teachers/slots` trả về `500 Internal Server Error`.
- Frontend hiển thị "không thể tải lịch rảnh".

## Root Cause

- API GET đã thực hiện thao tác xóa dữ liệu (`AvailableSlot.destroy`) ngay trong lúc đọc danh sách.
- Một số slot quá hạn vẫn bị bảng `APPOINTMENTS` tham chiếu qua khóa ngoại `Slot_ID`.
- MySQL ném lỗi `ER_ROW_IS_REFERENCED_2` (FK constraint), làm request GET bị fail.

## Why this is risky

- GET endpoint có side effects (xóa dữ liệu) là anti-pattern.
- Việc cleanup trong luồng đọc dễ gây lỗi production khó dự đoán.
- FK integrity có thể bị vi phạm khi business data vẫn cần lưu lịch sử appointment.

## Fix applied

- Bỏ thao tác `destroy` trong `getMySlots`.
- Chỉ lọc và trả về slot còn hợp lệ (chưa quá hạn).
- Vẫn cập nhật các appointment `Pending` của slot quá hạn sang `Rejected`.

## Prevention checklist

- Không thực hiện hard-delete trong GET APIs.
- Nếu cần cleanup dữ liệu, dùng:
  - cron/background job riêng, hoặc
  - soft delete (`IsActive`, `DeletedAt`), hoặc
  - transaction + kiểm tra FK rõ ràng.
- Thêm test integration cho case:
  - slot quá hạn có appointment tham chiếu
  - GET slots vẫn trả `200` và không crash.
