module.exports = {
    environment: process.env.NODE_ENV,
    server: {
        port: process.env.PORT,
        host: process.env.HOST,
    },
    database: {
        mongo_uri: `${process.env.MONGO_URI}/ecommarce-shop`,
    },
    jwt: {
      tokenIssuer:process.env.TOKEN_ISSUER ,
      tokenAudience:process.env.TOKEN_AUDIENCE,
        accessTokenValidityDays: process.env.ACCESS_TOKEN_VALIDITY_SEC || '10min',
        refreshTokenValidityDays: process.env.REFRESH_TOKEN_VALIDITY_SEC || '30d',
    },
}
