import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUserByEmail } from "@/lib/auth";
import { sendPasswordResetEmail } from "@/lib/email";
import { randomBytes } from "crypto";

const forgotPasswordSchema = z.object({
	email: z.string().email("Invalid email address"),
});

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const validatedData = forgotPasswordSchema.parse(body);

		const user = await getUserByEmail(validatedData.email);

		// Don't reveal if user exists or not (security best practice)
		if (!user) {
			return NextResponse.json({
				message: "If an account with that email exists, a password reset link has been sent.",
			});
		}

		// Generate reset token
		const token = randomBytes(32).toString("hex");
		const expires = new Date();
		expires.setHours(expires.getHours() + 1); // 1 hour

		// Delete any existing reset tokens for this user
		await prisma.resetToken.deleteMany({
			where: { userId: user.id },
		});

		// Create new reset token
		await prisma.resetToken.create({
			data: {
				token,
				expires,
				userId: user.id,
			},
		});

		// Send reset email
		try {
			await sendPasswordResetEmail(validatedData.email, token, user.name || undefined);
		} catch (emailError) {
			console.error("Failed to send password reset email:", emailError);
			return NextResponse.json(
				{ error: "Failed to send reset email. Please try again." },
				{ status: 500 }
			);
		}

		return NextResponse.json({
			message: "If an account with that email exists, a password reset link has been sent.",
		});
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Validation error", details: error.errors },
				{ status: 400 }
			);
		}

		console.error("Forgot password error:", error);
		return NextResponse.json(
			{ error: "Failed to process request. Please try again." },
			{ status: 500 }
		);
	}
}

