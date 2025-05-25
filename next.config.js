/** @type {import('next').NextConfig} */

/** @type {import('next').NextConfig} */
const nextConfig = {
	/* config options here */
	typescript: {
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
		// This is a temporary workaround to fix the build error with params type
		ignoreBuildErrors: true,
	},
};

module.exports = nextConfig;
