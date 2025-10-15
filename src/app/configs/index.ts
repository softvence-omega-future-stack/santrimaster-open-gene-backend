import "dotenv/config";

export const configs = {
    port: process.env.PORT,
    env: "development",
    jwt: {
        access_token: process.env.ACCESS_TOKEN,
        refresh_token: process.env.REFRESH_TOKEN,
        access_expires: process.env.ACCESS_EXPIRES,
        refresh_expires: process.env.REFRESH_EXPIRES,
        reset_secret: process.env.RESET_SECRET,
        reset_expires: process.env.RESET_EXPIRES,
        front_end_url: process.env.RESET_BASE_LINK,
        verified_token: process.env.VERIFIED_TOKEN

    },
    db_url: process.env.DB_URL,
    email: {
        app_email: process.env.APP_USER,
        app_password: process.env.APP_PASSWORD,
        sg_api_key: process.env.SG_API_KEY
    },
    cloudinary: {
        cloud_name: process.env.CLOUD_NAME,
        cloud_api_key: process.env.CLOUD_API_KEY,
        cloud_api_secret: process.env.CLOUD_API_SECRET
    },
    aws: {
        region: process.env.AWS_REGION,
        accessKey: process.env.AWS_ACCESS_KEY,
        secret: process.env.AWS_SECRET,
        bucketName: process.env.AWS_BUCKET
    },
    stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY,
        stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET
    },
    admin: {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD
    }
}