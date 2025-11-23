"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [formData, setFormData] = useState({
		password: "",
		confirmPassword: "",
	});
	const [token, setToken] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		const tokenParam = searchParams.get("token");
		if (!tokenParam) {
			setError("Invalid reset link. Please request a new password reset.");
		} else {
			setToken(tokenParam);
		}
	}, [searchParams]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (formData.password !== formData.confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		if (formData.password.length < 8) {
			setError("Password must be at least 8 characters");
			return;
		}

		setLoading(true);

		try {
			const response = await fetch("/api/auth/reset-password", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					token,
					password: formData.password,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				setError(data.error || "Failed to reset password");
				return;
			}

			setSuccess(true);
			setTimeout(() => {
				router.push("/auth/signin");
			}, 3000);
		} catch (err) {
			setError("An error occurred. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	if (success) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-md w-full space-y-8">
					<div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded">
						<h2 className="text-xl font-bold mb-2">Password Reset Successful!</h2>
						<p>Your password has been reset. You can now sign in with your new password.</p>
						<p className="mt-2 text-sm">Redirecting to sign in page in a few seconds...</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Reset your password
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						Enter your new password below
					</p>
				</div>

				{error && (
					<div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
						{error}
					</div>
				)}

				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div className="rounded-md shadow-sm space-y-4">
						<div>
							<label htmlFor="password" className="block text-sm font-medium text-gray-700">
								New Password
							</label>
							<input
								id="password"
								name="password"
								type="password"
								autoComplete="new-password"
								required
								value={formData.password}
								onChange={(e) => setFormData({ ...formData, password: e.target.value })}
								className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
								placeholder="Password (min. 8 characters)"
							/>
						</div>
						<div>
							<label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
								Confirm New Password
							</label>
							<input
								id="confirmPassword"
								name="confirmPassword"
								type="password"
								autoComplete="new-password"
								required
								value={formData.confirmPassword}
								onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
								className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
								placeholder="Confirm password"
							/>
						</div>
					</div>

					<div>
						<button
							type="submit"
							disabled={loading || !token}
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{loading ? "Resetting..." : "Reset password"}
						</button>
					</div>

					<div className="text-center">
						<Link
							href="/auth/signin"
							className="font-medium text-blue-600 hover:text-blue-500"
						>
							Back to sign in
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}

