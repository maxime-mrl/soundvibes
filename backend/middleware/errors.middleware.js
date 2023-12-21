module.exports = (err, req, res, next) => { // https://reflectoring.io/express-error-handling/
    // send back an easily understandable error message to the caller
    const status = err.status || 500;
    res.status(status).json({
        status: status,
        error: err.message
    });
    next();
};
