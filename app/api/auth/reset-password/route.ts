import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

const resetPasswordSchema = z.object({
	token: z.string().min(1, "Token is required"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const validatedData = resetPasswordSchema.parse(body);

		const resetToken = await prisma.resetToken.findUnique({
			where: { token: validatedData.token },
			include: { user: true },
		});

		if (!resetToken) {
			return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
		}

		if (resetToken.expires < new Date()) {
			await prisma.resetToken.delete({
				where: { token: validatedData.token },
			});
			return NextResponse.json({ error: "Token has expired" }, { status: 400 });
		}

		if (resetToken.used) {
			return NextResponse.json({ error: "Token has already been used" }, { status: 400 });
		}

		// Update password
		const hashedPassword = await hashPassword(validatedData.password);
		await prisma.user.update({
			where: { id: resetToken.userId },
			data: { password: hashedPassword },
		});

		// Mark token as used
		await prisma.resetToken.update({
			where: { token: validatedData.token },
			data: { used: true },
		});

		return NextResponse.json({
			message: "Password has been reset successfully. You can now sign in with your new password.",
		});
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Validation error", details: error.errors },
				{ status: 400 }
			);
		}

		console.error("Reset password error:", error);
		return NextResponse.json(
			{ error: "Failed to reset password. Please try again." },
			{ status: 500 }
		);
	}
}

