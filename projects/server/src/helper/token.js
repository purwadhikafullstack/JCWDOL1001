const jwt = require("jsonwebtoken")

const createToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY)
}
const createTokenVerify = (payload, expiresIn = "30m") => {
    return jwt.sign(payload, config.JWT_SECRET_KEY, { expiresIn : expiresIn })
}

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET_KEY)
}

module.exports={
    createToken,
    verifyToken,
    createTokenVerify
}