import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/auth": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/users": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/wallet": {
        target: "http://localhost:3000",
        changeOrigin: true,
        bypass: (request) => request.headers.accept?.includes("text/html") ? "/index.html" : undefined,
      },
      "/products": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/profiles": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/library": {
        target: "http://localhost:3000",
        changeOrigin: true,
        bypass: (request) => request.headers.accept?.includes("text/html") ? "/index.html" : undefined,
      },
      "/cart": {
        target: "http://localhost:3000",
        changeOrigin: true,
        bypass: (request) => request.headers.accept?.includes("text/html") ? "/index.html" : undefined,
      },
      "/wishlist": {
        target: "http://localhost:3000",
        changeOrigin: true,
        bypass: (request) => request.headers.accept?.includes("text/html") ? "/index.html" : undefined,
      },
    },
  },
})
