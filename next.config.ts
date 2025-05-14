// next.config.ts
// @ts-ignore
import withPWA from "next-pwa";

const config = withPWA({
  pwa: {
    dest: "public", // Direktori untuk file PWA
    register: true,
    skipWaiting: true,
  },
});

export default config;
