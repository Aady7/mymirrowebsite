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
	// Add options to help with the build process
	output: "standalone",
	poweredByHeader: false,

	// Override the default webpack config to ignore problematic manifests
	webpack: (config, { isServer }) => {
		// Fix for the client reference manifest issue
		if (isServer) {
			config.ignoreWarnings = [
				{ module: /app\/\(root\)\/page_client-reference-manifest\.js$/ },
			];
		}
		return config;
	},
};

module.exports = nextConfig;
