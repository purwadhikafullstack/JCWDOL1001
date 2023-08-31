const otpGenerator = require("otp-generator")

const generateOtp = () => {
    return otpGenerator.generate(6, {
        upperCase : true,
        specialChars : false,
        alphabets : true
    })
}

module.exports = {
    generateOtp
}