const { helperToken } = require("../helper/index.js")

async function verifyUser(req, res, next) {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) throw ({ 
            type : "error",
            message : "Invalid Credential" 
        });
        
        const decoded = helperToken.verifyToken(token);

        if (decoded?.roleId > 2) throw ({ 
            type : "error",
            message : "Unauthorized" 
        });

        req.user = decoded

        next();
    } catch (error) {
        return res.status(403).json({ 
            type : "error", 
            message : error?.message, 
        })
    }
}

async function verifyAdmin(req, res, next) {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) throw ({ 
            type : "error",
            message : "Invalid Credential Admin" 
        });

        const decoded = helperToken.verifyToken(token);

        if (decoded?.roleId !== 1) throw ({ 
            type : "error",
            message : "Unauthorized" 
        });

        req.user = decoded

        next();
    } catch (error) {
        return res.status(403).json({ 
            type : "error", 
            message : error?.message, 
        })
    }
}

module.exports = {
    verifyUser,
    verifyAdmin
}