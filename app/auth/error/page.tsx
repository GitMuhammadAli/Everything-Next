"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function AuthErrorPage() {
	const searchParams = useSearchParams();
	const error = searchParams.get("error");

	const getErrorMessage = (error: string | null) => {
		switch (error) {
			case "Configuration":
				return "There is a problem with the server configuration.";
			case "AccessDenied":
				return "You do not have permission to sign in.";
			case "Verification":
				return "The verification token has expired or has already been used.";
			case "CredentialsSignin":
				return "Invalid email or password.";
			case "OAuthSignin":
				return "Error occurred while signing in with OAuth provider.";
			case "OAuthCallback":
				return "Error occurred in the OAuth callback.";
			case "OAuthCreateAccount":
				return "Could not create OAuth account.";
			case "EmailCreateAccount":
				return "Could not create email account.";
			case "Callback":
				return "Error occurred in the callback handler.";
			case "OAuthAccountNotLinked":
				return "This account is already linked to another user.";
			default:
				return "An error occurred during authentication.";
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded">
					<h2 className="text-xl font-bold mb-2">Authentication Error</h2>
					<p className="mb-4">{getErrorMessage(error)}</p>
					<Link
						href="/auth/signin"
						className="inline-block text-blue-600 hover:text-blue-500 underline"
					>
						Try signing in again
					</Link>
				</div>
			</div>
		</div>
	);
}

