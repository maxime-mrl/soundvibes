const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const userModel = require("../models/users.model");

const tokenError = new Error("Invalid token");
tokenError.status = 401;

exports.protect = asyncHandler(async (req, res, next) => { // hard check if user is logged
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            // get token from header
            token = req.headers.authorization.split(" ")[1];
            // verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // get user from token without password
            req.user = await userModel.findById(decoded.id).select("-password");
            if (!req.user) throw tokenError;
            // user exist pass to next middleware w/ user object
            next();
        } catch(err) {
            if (/token/.test(err.message)) err = tokenError; // catch error related to token to format them
            throw err;
        }
    }
    if (!token) throw tokenError;
})
