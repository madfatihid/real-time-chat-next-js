/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        HOST: process.env.HOST,
        USER: process.env.USER,
        PASSWORD: process.env.PASSWORD,
        DATABASE: process.env.DATABASE,

        APP_ID: process.env.APP_ID,
        KEY: process.env.KEY,
        SECRET: process.env.SECRET,
        CLUSTER: process.env.CLUSTER,
    }
}

module.exports = nextConfig
