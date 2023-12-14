const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const userModel = require("../models/users.model");

const tokenError = new Error("Invalid token");
tokenError.status = 401;

exports.protect = asyncHandler(async (req, res, next) => { // check if user is logged
    /* ----------------------------- retrieve token ----------------------------- */
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) token = req.headers.authorization.split(" ")[1]; // get token from bearer header
    if (!token) throw tokenError;
    /* ------------------------------ verify token ------------------------------ */
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // get user from token without password
        req.user = await userModel.findById(decoded.id).select("-password");
        if (!req.user) throw tokenError;
        // user exist pass to next middleware w/ user object
        next();
    } catch(err) {
        if (/token|expired/.test(err.message)) err = tokenError; // catch error related to token to format them
        throw err;
    }
})
