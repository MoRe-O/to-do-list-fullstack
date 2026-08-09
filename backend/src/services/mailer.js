import nodemailer from "nodemailer";

const hasSmtpConfig = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

const transporter = hasSmtpConfig
    ? nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: Number(process.env.SMTP_PORT) === 465,
          auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
          },
      })
    : null;

export async function sendOtpEmail(email, code) {
    if (!transporter) {
        console.log(`[OTP] SMTP is not configured — verification code for ${email} is: ${code}`);
        return;
    }

    const expiryMinutes = process.env.OTP_EXPIRY_MINUTES || 5;

    await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: "Your verification code",
        text: `Your verification code is ${code}. It expires in ${expiryMinutes} minutes.`,
        html: `<p>Your verification code is <strong>${code}</strong>.</p><p>It expires in ${expiryMinutes} minutes.</p>`,
    });
}
