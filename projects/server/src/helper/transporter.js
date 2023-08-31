const nodemailer = require('nodemailer');
const {GMAIL,GMAIL_APP_KEY} = require ("../config/index.js");

// @create transporter using gmail in nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: GMAIL,
        pass: GMAIL_APP_KEY
    },
    tls: {
        rejectUnauthorized: false
    }
})

module.exports = {
    transporter
}
