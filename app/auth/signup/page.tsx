"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
	const router = useRouter();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

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
			const response = await fetch("/api/auth/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: formData.email,
					password: formData.password,
					name: formData.name || undefined,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				setError(data.error || "Failed to create account");
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
						<h2 className="text-xl font-bold mb-2">Account Created Successfully!</h2>
						<p>
							We've sent a verification email to {formData.email}. Please check your inbox
							and click the verification link to activate your account.
						</p>
						<p className="mt-2 text-sm">
							Redirecting to sign in page in a few seconds...
						</p>
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
						Create your account
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						Or{" "}
						<Link href="/auth/signin" className="font-medium text-blue-600 hover:text-blue-500">
							sign in to your existing account
						</Link>
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
							<label htmlFor="name" className="block text-sm font-medium text-gray-700">
								Name (optional)
							</label>
							<input
								id="name"
								name="name"
								type="text"
								autoComplete="name"
								value={formData.name}
								onChange={(e) => setFormData({ ...formData, name: e.target.value })}
								className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
								placeholder="Your name"
							/>
						</div>
						<div>
							<label htmlFor="email" className="block text-sm font-medium text-gray-700">
								Email address
							</label>
							<input
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								required
								value={formData.email}
								onChange={(e) => setFormData({ ...formData, email: e.target.value })}
								className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
								placeholder="Email address"
							/>
						</div>
						<div>
							<label htmlFor="password" className="block text-sm font-medium text-gray-700">
								Password
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
								Confirm Password
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
							disabled={loading}
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{loading ? "Creating account..." : "Create account"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

