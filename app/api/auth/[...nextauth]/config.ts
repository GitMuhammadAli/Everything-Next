import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import TwitterProvider from "next-auth/providers/twitter";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					throw new Error("Email and password are required");
				}

				const user = await prisma.user.findUnique({
					where: { email: credentials.email },
				});

				if (!user || !user.password) {
					throw new Error("Invalid email or password");
				}

				const isValid = await verifyPassword(credentials.password, user.password);

				if (!isValid) {
					throw new Error("Invalid email or password");
				}

				if (!user.emailVerified) {
					throw new Error("Please verify your email before signing in");
				}

				return {
					id: user.id,
					email: user.email,
					name: user.name,
					image: user.image,
				};
			},
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),
		GitHubProvider({
			clientId: process.env.GITHUB_ID as string,
			clientSecret: process.env.GITHUB_SECRET as string,
		}),
		FacebookProvider({
			clientId: process.env.FACEBOOK_CLIENT_ID as string,
			clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
		}),
		TwitterProvider({
			clientId: process.env.TWITTER_CLIENT_ID as string,
			clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
			version: "2.0",
		}),
	],
	secret: process.env.NEXTAUTH_SECRET,
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},
	pages: {
		signIn: "/auth/signin",
		signOut: "/auth/signout",
		error: "/auth/error",
	},
	callbacks: {
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.sub as string;
			}
			return session;
		},
		async jwt({ token, user, account }) {
			if (user) {
				token.id = user.id;
			}
			if (account) {
				token.accessToken = account.access_token;
			}
			return token;
		},
	},
	events: {
		async signIn({ user, account, profile }) {
			// Update user email verification status for OAuth providers
			if (account?.provider !== "credentials" && user.email) {
				await prisma.user.update({
					where: { email: user.email },
					data: { emailVerified: new Date() },
				});
			}
		},
	},
	debug: process.env.NODE_ENV === "development",
};

