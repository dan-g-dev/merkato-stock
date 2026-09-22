// Small, central place to read environment variables from, so nothing
// else in the backend calls process.env directly. Values are loaded
// from the repository-root .env file - see server.ts.

export const config = {
  port: Number(process.env.PORT) || 3000,
  jwtSecret: process.env.JWT_SECRET || "dev-only-secret-change-me",
  // Where the frontend's Vite dev server runs, so the API can allow it
  // via CORS when the two are hit directly (outside of Vite's proxy).
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  nodeEnv: process.env.NODE_ENV || "development",
};
