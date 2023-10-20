const bcrypt = require("bcryptjs");
const minPasslength = 6;

module.exports = async function(next) {
    const user = this._update ? this._update : this; // get the user infos to check them
    // check password length
    if (user.password) {
        if (user.password.length < minPasslength) throw {
            message: `Your password should be at least ${minPasslength} character long`,
            status: 400
        };
        // hash password
        user.password = await hashPassword(user.password);
    }
    // check username validity (specifically avoid length because it's arleady handled by mongoose model)
    if (user.username) {
        if (!/^[-a-z0-9]+$/i.test(user.username)) throw {
            message: `Please enter a valid username`,
            status: 400
        };
    }
    // check mail validity
    if (user.mail) {
        if (!/^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$/.test(user.mail)) throw { // regex from ihateregex.io
            message: `Please enter a valid email`,
            status: 400
        };
    }
    if (user.right) {
        if (!/^[0-9]$/.test(user.right)) throw {
            message: `Please enter a valid right`,
            status: 400
        };
    }
    // everythings is good => save user to db
    next()
}

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}
