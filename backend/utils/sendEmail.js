const nodemailer = require("nodemailer");

exports.connect = () => {
  // Nếu chưa cấu hình mail, dùng transport giả để không làm hỏng nghiệp vụ
  const host = (process.env.MAIL_HOST || "").trim();
  const user = (process.env.MAIL_USER || "").trim();
  const pass = (process.env.MAIL_PASS || "").trim();

  if (!host || !user || !pass) {
    console.warn(
      "MAIL is not configured (MAIL_HOST/MAIL_USER/MAIL_PASS). Using jsonTransport for local dev."
    );
    return nodemailer.createTransport({ jsonTransport: true });
  }

  return nodemailer.createTransport({
    host,
    auth: { user, pass },
  });
};