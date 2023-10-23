module.exports = (err, req, res, next) => { // https://reflectoring.io/express-error-handling/
    const status = err.status || 500;
    console.log(err)
    // send back an easily understandable error message to the caller
    res.status(status).json({
        status: status,
        error: err.message
    });
}
