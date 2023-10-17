const path = require("path");
require("dotenv").config({
    path: path.resolve(__dirname, '../../.env')
})

// @create db configuration
const db_config = Object.freeze({
    development: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: "mysql"
    },
    test: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: "mysql"
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: "mysql"
    }
})
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
const OTP_SECRET_KEY = process.env.OTP_SECRET_KEY
const GMAIL_APP_KEY = process.env.GMAIL_APP_KEY
const GMAIL = process.env.GMAIL
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET
const REDIRECT_URL = process.env.REDIRECT_URL 
const REDIRECT_BACKEND_URL = process.env.REDIRECT_BACKEND_URL

module.exports = {
    db_config,
    JWT_SECRET_KEY,
    OTP_SECRET_KEY,
    GMAIL_APP_KEY,
    GMAIL,
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
    REDIRECT_URL,
    REDIRECT_BACKEND_URL
}