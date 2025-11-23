"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function AuthButtons() {
	const { data: session, status } = useSession();

	if (status === "loading") return <span>Auth…</span>;

	if (session?.user) {
		return (
			<span className="space-x-2">
				<span className="opacity-80">Hi, {session.user.name ?? session.user.email}</span>
				<button onClick={() => signOut({ callbackUrl: "/" })} className="underline">
					Sign out
				</button>
			</span>
		);
	}

	return (
		<span className="space-x-2">
			<Link href="/auth/signin" className="underline">
				Sign in
			</Link>
			<Link href="/auth/signup" className="underline">
				Sign up
			</Link>
		</span>
	);
}

