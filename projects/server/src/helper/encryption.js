const bycript = require("bcrypt")

function hashPassword(password) {
    return bycript.hashSync(password, 10);
}

function comparePassword(password, hash) {
    return bycript.compareSync(password, hash);
}

module.exports = {
    hashPassword,
    comparePassword
}