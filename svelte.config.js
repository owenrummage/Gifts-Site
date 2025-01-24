import adapter from '@sveltejs/adapter-auto'; // for server-side deployment
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// Use the Node.js adapter to deploy your app as a server-rendered app
		adapter: adapter()
	}
};

export default config;
