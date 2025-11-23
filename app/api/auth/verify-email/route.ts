import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const token = searchParams.get("token");

	if (!token) {
		return NextResponse.json({ error: "Token is required" }, { status: 400 });
	}

	try {
		const verificationToken = await prisma.verificationToken.findUnique({
			where: { token },
			include: { user: true },
		});

		if (!verificationToken) {
			return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
		}

		if (verificationToken.expires < new Date()) {
			await prisma.verificationToken.delete({
				where: { token },
			});
			return NextResponse.json({ error: "Token has expired" }, { status: 400 });
		}

		// Verify the user's email
		await prisma.user.update({
			where: { id: verificationToken.userId },
			data: { emailVerified: new Date() },
		});

		// Delete the verification token
		await prisma.verificationToken.delete({
			where: { token },
		});

		// Redirect to sign in page with success message
		const url = new URL("/auth/signin", request.url);
		url.searchParams.set("verified", "true");
		return NextResponse.redirect(url);
	} catch (error) {
		console.error("Email verification error:", error);
		return NextResponse.json(
			{ error: "Failed to verify email. Please try again." },
			{ status: 500 }
		);
	}
}

