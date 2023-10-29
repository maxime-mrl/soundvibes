const bcrypt = require("bcryptjs");
const minPasslength = 6;

module.exports = async function(next) {
    const user = this._update ? this._update : this; // get the user infos to check them (when updating it will be this._update else this)
    /* -------------------------- check password length ------------------------- */
    if (user.password) {
        if (user.password.length < minPasslength) throw { // done before the db validation because hash change length
            message: `Your password should be at least ${minPasslength} character long`,
            status: 400
        };
        // hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }
    /* ------------------------- check username validity ------------------------ */
    if (user.username) { // when updating every data arn't required so check before its existence
        if (!/^[-a-z0-9]+$/i.test(user.username)) throw { // don't check length because arleady handled by model - this way is easier to change
            message: `Please enter a valid username`,
            status: 400
        };
    }
    /* --------------------------- check mail validity -------------------------- */
    if (user.mail) {
        if (!/^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$/.test(user.mail)) throw { // regex from ihateregex.io
            message: `Please enter a valid email`,
            status: 400
        };
    }
    /* -------------------------- check right validity -------------------------- */
    if (user.right) {
        if (!/^[0-9]$/.test(user.right)) throw {
            message: `Please enter a valid right`,
            status: 400
        };
    }
    /* ----------------- everythings is good => save user to db ----------------- */
    next();
}
