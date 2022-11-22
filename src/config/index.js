module.exports = {
    app_name: process.env.APP_NAME,
    currentEnvironment: process.env.NODE_ENV,
    server: {
        port: process.env.PORT,
        host: process.env.HOST,
    },
    database: {
        mongo_uri: `${process.env.MONGO_URI}/ecommarce-shop`,
    },
    jwt: {
        tokenIssuer: process.env.TOKEN_ISSUER,
        tokenAudience: process.env.TOKEN_AUDIENCE,
        accessTokenValidityDays: process.env.ACCESS_TOKEN_VALIDITY_DAYS || '10min',
        refreshTokenValidityDays: process.env.REFRESH_TOKEN_VALIDITY_DAYS || '30d',
    },
    Nodemailer: {
        SMTP_EMAIL: process.env.SMTP_EMAIL,
        SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    },
    cloudinary: {
        cloudName: process.env.CLOUD_NAME,
        apiKey: process.env.API_KEY,
        apiSecret: process.env.API_SECRET,
    },
}
