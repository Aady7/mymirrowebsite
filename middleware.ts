import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
	try {
		const response = NextResponse.next({
			request: {
				headers: request.headers,
			},
		});

		// Create a Supabase client using server components
		const supabase = createServerClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL || "",
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
			{
				cookies: {
					get(name: string) {
						return request.cookies.get(name)?.value;
					},
					set(name: string, value: string, options: CookieOptions) {
						response.cookies.set({
							name,
							value,
							...options,
						});
					},
					remove(name: string, options: CookieOptions) {
						response.cookies.set({
							name,
							value: "",
							...options,
						});
					},
				},
			},
		);

		// Get the session and handle potential errors
		const { data } = await supabase.auth.getSession();
		const session = data?.session || null;

		// Get the URL pathname
		const path = request.nextUrl.pathname;

		// Define public paths that don't require authentication
		const isPublicPath =
			path === "/" || // Root is now the homepage
			path === "/sign-in" ||
			path === "/sign-up" ||
			path === "/mobile-sign-in" ||
			path === "/style-quiz" ||
			path.startsWith("/api/auth") ||
			path.startsWith("/aboutpage");

		// If user is logged in but trying to access a public auth page, redirect to recommendations
		if (
			(path === "/sign-in" ||
				path === "/sign-up" ||
				path === "/mobile-sign-in") &&
			session
		) {
			return NextResponse.redirect(new URL("/recommendations", request.url));
		}

		// If user is not logged in and trying to access a protected page, redirect to sign-in
		if (!isPublicPath && !session) {
			return NextResponse.redirect(new URL("/sign-in", request.url));
		}

		return response;
	} catch (error) {
		console.error("Middleware error:", error);

		// In case of error, allow the request to proceed
		// This prevents the 500 error and lets Next.js handle any issues
		return NextResponse.next();
	}
}

// Configure the paths that should be matched by this middleware
export const config = {
	matcher: [
		"/",
		"/sign-in",
		"/sign-up",
		"/mobile-sign-in",
		"/style-quiz/:path*",
		"/recommendations/:path*",
		"/aboutpage/:path*",
		"/api/:path*",
	],
};
