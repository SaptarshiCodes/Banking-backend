import nodemailer from "nodemailer";
import { ENV } from "../lib/env.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: ENV.EMAIL_USER,
    clientId: ENV.CLIENT_ID,
    clientSecret: ENV.CLIENT_SECRET,
    refreshToken: ENV.REFRESH_TOKEN,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready");
  }
});

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Banking" <${ENV.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("Email sent:", info.messageId);

    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export const sendRegistrationEmail = async (userEmail, name) => {
  const subject = "Welcome to Banking";

  const text = `Hello ${name},

Thank you for registering at Banking. We're excited to have you on board!

Best regards,
The Banking Team`;

  const html = `
    <p>Hello ${name},</p>
    <p>
      Thank you for registering at Banking.
      We're excited to have you on board!
    </p>
    <p>
      Best regards,<br>
      The Banking Team
    </p>
  `;

  return sendEmail({
    to: userEmail,
    subject,
    text,
    html,
  });
};