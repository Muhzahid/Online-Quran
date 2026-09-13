import nodemailer from 'nodemailer';
import config from '../config/index.js';

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  if (!config.smtp.host || !config.smtp.user) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.port === 465,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.password,
    },
  });

  return transporter;
};

export const sendEmail = async ({ to, subject, html, text }) => {
  const transport = getTransporter();

  if (!transport) {
    console.log('[Email Dev Fallback]', { to, subject, text: text || html });
    return { accepted: [to], messageId: `dev-${Date.now()}`, preview: true };
  }

  return transport.sendMail({
    from: `"Quran Academy" <${config.smtp.user}>`,
    to,
    subject,
    html,
    text,
  });
};

export const sendWelcomeEmail = async (user) => {
  return sendEmail({
    to: user.email,
    subject: 'Welcome to Quran Academy',
    html: `
      <h1>Welcome, ${user.name}!</h1>
      <p>Thank you for joining Quran Academy. Start your Quran learning journey today.</p>
    `,
    text: `Welcome, ${user.name}! Thank you for joining Quran Academy.`,
  });
};

export const sendVerificationEmail = async (user, token) => {
  const verifyUrl = `${config.clientUrl}/verify-email?token=${token}`;
  return sendEmail({
    to: user.email,
    subject: 'Verify your email — Quran Academy',
    html: `
      <h1>Verify your email</h1>
      <p>Hi ${user.name},</p>
      <p>Please verify your email by clicking the link below:</p>
      <p><a href="${verifyUrl}">${verifyUrl}</a></p>
      <p>This link expires in 24 hours.</p>
    `,
    text: `Hi ${user.name}, verify your email: ${verifyUrl}`,
  });
};

export const sendPasswordResetEmail = async (user, token) => {
  const resetUrl = `${config.clientUrl}/reset-password?token=${token}`;
  return sendEmail({
    to: user.email,
    subject: 'Reset your password — Quran Academy',
    html: `
      <h1>Password Reset</h1>
      <p>Hi ${user.name},</p>
      <p>Click the link below to reset your password:</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>This link expires in 1 hour. If you did not request this, ignore this email.</p>
    `,
    text: `Hi ${user.name}, reset your password: ${resetUrl}`,
  });
};
