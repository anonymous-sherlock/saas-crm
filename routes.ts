/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = ["/", "/sso-callback", "/api/wallet/bonus", "/api/wallet/create"];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */
export const authRoutes = ["/sign-in", "/sign-up", "/auth/error", "/sign-in/reset-password", "/sign-in/reset-password/step-2", "/api/trpc/user.add"];

export const authPages = {
  login: "/sign-in",
  register: "/sign-up",
  resetPassWord: "/reset-password",
};

export type Pages = {
  product: string;
  campaign: string;
};
/**
 * The default onboarding redirect path after logging in
 * @type { Pages}
 */
export const pages = {
  product: "/products",
  campaign: "/campaigns",
};

/**
 * The default onboarding redirect path after logging in
 * @type {string}
 */
export const ONBOARDING_REDIRECT = "/onboarding";
/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The prefix for API  routes
 * Routes that start with this prefix are used for API to handle redirects
 * @type {string}
 */
export const apiPrefix = "/api";

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/dashboard";
/**
 * The default redirect path for dashboard page
 * @type {string}
 */
export const DEFAULT_DASHBOARD_REDIRECT = "/dashboard";

/**
 * The default redirect path after documentation
 * @type {string}
 */
export const DOCUMENTATION_REDIRECT = "//docs.adscrush.com";
