import { getEnv } from "./env.config";

const appConfig = {
  app: {
    name: process.env.APP_NAME,
    brand: process.env.BRAND_NAME,
    env: getEnv(),
    websiteUrl: process.env.WEBSITE_URL,
    email: {
      host: String(process.env.EMAIL_HOST),
      user: String(process.env.EMAIL_USER),
      from: String(process.env.EMAIL_FROM),
      fromName: String(process.env.EMAIL_FROM_NAME),
      pass: String(process.env.EMAIL_PASS),
      port: Number(process.env.EMAIL_PORT),
    },
    portalUrl: process.env.APP_PORTAL_BASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    issuer: process.env.JWT_ISSUER,
    webExpiry: process.env.JWT_WEB_EXPIRES_IN,
    refreshSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
  },
  server: {
    port: Number(process.env.PORT),
  },
  database: {
    dbClient: process.env.DB_CLIENT,
    dbUrl: String(process.env.DB_URL),
  },
  paystack: {
    apiKey: String(process.env.PAYSTACK_API_KEY),
    baseUrl: String(process.env.PAYSTACK_BASE_URL),
  },
  cloudinary: {
    cloudName: String(process.env.CLOUDINARY_CLOUDNAME)
  },
};

export default appConfig;
