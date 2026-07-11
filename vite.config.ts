import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(async ({ mode }) => {
  const env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return {
    server: {
      port: env.PORT ? Number(env.PORT) : 5173,
      strictPort: true,
      host: true,
    },
    build: {
      modulePreload: false,
      target: "esnext",
    },
    plugins: [sveltekit()],
  };
});
