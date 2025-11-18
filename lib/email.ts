import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST || "smtp.gmail.com",
	port: parseInt(process.env.SMTP_PORT || "587"),
	secure: false, // true for 465, false for other ports
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASSWORD,
	},
});

export async function sendVerificationEmail(email: string, token: string, name?: string) {
	const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`;

	const mailOptions = {
		from: process.env.SMTP_FROM || process.env.SMTP_USER,
		to: email,
		subject: "Verify your email address",
		html: `
			<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
				<h1>Welcome${name ? `, ${name}` : ""}!</h1>
				<p>Thank you for signing up. Please verify your email address by clicking the link below:</p>
				<a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
					Verify Email
				</a>
				<p>Or copy and paste this URL into your browser:</p>
				<p style="word-break: break-all; color: #666;">${verificationUrl}</p>
				<p>This link will expire in 24 hours.</p>
				<p>If you didn't create an account, you can safely ignore this email.</p>
			</div>
		`,
	};

	return await transporter.sendMail(mailOptions);
}

export async function sendPasswordResetEmail(email: string, token: string, name?: string) {
	const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;

	const mailOptions = {
		from: process.env.SMTP_FROM || process.env.SMTP_USER,
		to: email,
		subject: "Reset your password",
		html: `
			<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
				<h1>Password Reset Request</h1>
				<p>Hi${name ? ` ${name}` : ""},</p>
				<p>We received a request to reset your password. Click the link below to reset it:</p>
				<a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
					Reset Password
				</a>
				<p>Or copy and paste this URL into your browser:</p>
				<p style="word-break: break-all; color: #666;">${resetUrl}</p>
				<p>This link will expire in 1 hour.</p>
				<p>If you didn't request a password reset, you can safely ignore this email.</p>
			</div>
		`,
	};

	return await transporter.sendMail(mailOptions);
}

