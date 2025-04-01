import { registerAs } from "@nestjs/config";


// Temporal (Aun no definido como realizarlo)
export default registerAs('email', () => ({
    provider: process.env.EMAIL_PROVIDER || 'sendgrid',
    apiKey: process.env.EMAIL_API_KEY || 'your-api-key',
    from: process.env.EMAIL_FROM || 'no-reply@example.com',
  }));