module.exports = (err, doc, next) => { // detect and handle specific errors thrown by models
    // having some sort of model middleware is the best (and sometimes only) way to get some good looking error messages from the model
    if (!err) return next(); // if no error life is good
    // else we need to handle it
    if (err.code === 11000) { // unique key duplicate
        err = new Error(`This ${Object.keys(err.keyPattern)} is arleady used`);
        err.status = 200;
    }
    if (err.errors && err.errors[Object.keys(err.errors)]) {
        const error = err.errors[Object.keys(err.errors)];
        if (error.kind === 'minlength') { // input too short
            err = new Error(`Your ${error.path} ${error.value} is too short! It must be at least ${error.properties.minlength} characters long.`);
            err.status = 400;
        }
        if (error.kind === 'maxlength') { // input too big
            err = new Error(`Your ${error.path} ${error.value} is too long! It shouldn't be more than ${error.properties.maxlength} characters long.`);
            err.status = 400;
        }
        if (error.kind === 'string') { // invalid input format
            err = new Error(`Your ${error.path} is not a valid format.`);
            err.status = 400;
        }
        if (/objectid/i.test(error.kind)) { // invalid ObjectID
            console.log(Object.keys(error))
            err = new Error(`Invalid identifiers in ${error.value}.`);
            err.status = 400;
        }
    }
    // others errors thrown as is
    throw err;
}
