module.exports = (err, doc, next) => { // detect and handle specific errors thrown by models
    if (!err) return next();
    if (err.code === 11000) { // unique key duplicate
        err = new Error(`This ${Object.keys(err.keyPattern)} is arleady used`);
        err.status = 200;
    }
    if (err.errors && err.errors[Object.keys(err.errors)].kind === 'minlength') { // input too short
        const details = err.errors[Object.keys(err.errors)];
        err = new Error(`your ${details.path} ${details.value} is too short! It must be at least ${details.properties.minlength} characters long.`);
        err.status = 400;
    }
    if (err.errors && err.errors[Object.keys(err.errors)].kind === 'maxlength') { // input too big
        const details = err.errors[Object.keys(err.errors)];
        err = new Error(`your ${details.path} ${details.value} is too long! It shouldn't be more than ${details.properties.maxlength} characters long.`);
        err.status = 400;
    }
    throw err;
}

/* 
* FYI:
* unique key cannot have a custom error message, so using a function like this or manually checking before are the only ways to created "proper" error message
* 
* for others requirement such as required, minlength etc we can set custom message (such as minlength: [length, "errormessage"]) but this lack some dynamic error message (ex. for the length we can't magically have the right length number in the phrase it's up to the developer to write it right (booring!)) and the error won't have status code making it likelly showed as server error (not good). it let us with the same 2 solution: catching the error and creating custom message or preventing the error with previous check
* - this was wayyy too long - 
* TLDR it's either not possible to have the legacy mongoose error message (unique) or I don't like it
*/