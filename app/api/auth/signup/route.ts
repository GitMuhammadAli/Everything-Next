import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createUser, getUserByEmail } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/email";
import { randomBytes } from "crypto";

const signupSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(8, "Password must be at least 8 characters"),
	name: z.string().min(2, "Name must be at least 2 characters").optional(),
});

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const validatedData = signupSchema.parse(body);

		// Check if user already exists
		const existingUser = await getUserByEmail(validatedData.email);
		if (existingUser) {
			return NextResponse.json(
				{ error: "User with this email already exists" },
				{ status: 400 }
			);
		}

		// Create user
		const user = await createUser(
			validatedData.email,
			validatedData.password,
			validatedData.name
		);

		// Generate verification token
		const token = randomBytes(32).toString("hex");
		const expires = new Date();
		expires.setHours(expires.getHours() + 24); // 24 hours

		await prisma.verificationToken.create({
			data: {
				token,
				identifier: validatedData.email,
				expires,
				userId: user.id,
			},
		});

		// Send verification email
		try {
			await sendVerificationEmail(validatedData.email, token, validatedData.name);
		} catch (emailError) {
			console.error("Failed to send verification email:", emailError);
			// Don't fail the signup if email fails, but log it
		}

		return NextResponse.json(
			{
				message: "User created successfully. Please check your email to verify your account.",
				userId: user.id,
			},
			{ status: 201 }
		);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Validation error", details: error.errors },
				{ status: 400 }
			);
		}

		console.error("Signup error:", error);
		return NextResponse.json(
			{ error: "Failed to create user. Please try again." },
			{ status: 500 }
		);
	}
}

