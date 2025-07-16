// src/utils/mailer.ts
import nodemailer from "nodemailer";

export const sendResetPasswordEmail = async (to: string, link: string) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail", // 쓰는 SMTP에 맞게 바꿔도 됨
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"TUNER" <${process.env.MAIL_USER}>`,
    to,
    subject: "[TUNER] 비밀번호 재설정 링크",
    html: `
      <p>아래 링크를 클릭하여 비밀번호를 재설정하세요.</p>
      <a href="${link}">${link}</a>
      <p>링크는 15분간 유효합니다.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
