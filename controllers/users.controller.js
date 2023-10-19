const asyncHandler = require("express-async-handler");
const usersModel = require("../models/users.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const minPasslength = 6;

/* -------------------------------------------------------------------------- */
/*                             HANDLE REGISTERING                             */
/* -------------------------------------------------------------------------- */
exports.registerUser = asyncHandler(async (req, res) => {
    const { username, mail, password, age } = req.body;
    // check everything is here
    if (!username || !mail || !age || !password) throw {
        message: `fields missing: ${(!username ? "username " : "")}${(!mail ? "mail " : "")}${(!age ? "age " : "")}${(!password ? "password" : "")}`,
        status: 400
    };
    // check password length
    if (password.length < minPasslength) throw {
        message: `Your password should be at least ${minPasslength} character long`,
        status: 400
    };
    // check username validity (specifically avoid length because it's arleady handled by mongoose model)
    if (!/^[-a-z0-9\/]+$/i.test(username)) throw {
        message: `Please enter a valid username`,
        status: 400
    };
    // check mail validity
    if (!/^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$/.test(mail)) throw { // regex from ihateregex.io
        message: `Please enter a valid email`,
        status: 400
    };
    // check age
    if (age < 13) throw {
        message: `Come back see us in ${13 - age} years ;)`,
        status: 200
    };
    // hash password
    const hashed = await hashPassword(password);

    // Create user
    const user = await usersModel.create({ mail, username, password: hashed });

    if (user) {
        res.status(201).json({
            _id: user._id,
            username: user.username,
            token: generateToken(user._id)
        });
    } else {
        throw new Error("User can't be created right now");
    }
});

/* -------------------------------------------------------------------------- */
/*                                HANDLE LOGIN                                */
/* -------------------------------------------------------------------------- */
exports.loginUser = asyncHandler(async (req, res) => {
    const { mail, password } = req.body;
    // check everything is here
    if (!mail || !password) throw {
        message: `fields missing: ${(!mail ? "mail " : "")}${(!password ? "password" : "")}`,
        status: 400
    };
    const user = await usersModel.findOne({ mail });
    // need more verif?
    if (user && await bcrypt.compare(password, user.password)) {
        res.status(200).json({
            _id: user._id,
            username: user.username,
            token: generateToken(user._id)
        });
    } else {
        let err = new Error("Incorrect credentials");
        err.status = 200;
        throw err;
    }
});

/* -------------------------------------------------------------------------- */
/*                               GET USER INFOS                               */
/* -------------------------------------------------------------------------- */
exports.getUser = asyncHandler(async (req, res) => {
    res.status(200).json({
        id: req.user._id,
        mail: req.user.mail,
        username: req.user.username
    });
});

exports.updateUser = asyncHandler(async (req, res) => {
    const { username, mail, password, confirmPassword } = req.body;
    const user = await usersModel.findOne(req.user);
    // necessary datas are presents
    if (!confirmPassword || !user) {
        const err = new Error("Invalid datas");
        err.status = 400;
        throw err;
    }
    // password check
    if (!await bcrypt.compare(confirmPassword, user.password)) {
        let err = new Error("Incorrect credentials");
        err.status = 200;
        throw err;
    }
    /* ------------------------------- UPDATE DATA ------------------------------ */
    // username
    if (username) {
        // check username validity (specifically avoid length because it's arleady handled by mongoose model)
        if (!/^[-a-z0-9\/]+$/i.test(username)) throw {
            message: `Please enter a valid username`,
            status: 400
        };
        user.username = username;
    }
    // mail
    if (mail) {
        // check mail validity
        if (!/^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$/.test(mail)) throw { // regex from ihateregex.io
            message: `Please enter a valid email`,
            status: 400
        };
        user.mail = mail
    }
    // password
    if (password) {
        if (password.length < minPasslength) throw {
            message: `Your password should be at least ${minPasslength} character long`,
            status: 400
        };
        user.password = hashPassword(password);
    }
    
    const updatedUser = await usersModel.findByIdAndUpdate(user._id, {
        mail: user.mail,
        username: user.username,
        password: user.password
    }, { new: true });
    res.status(200).json({
        _id: updatedUser._id,
        username: updatedUser.username,
        token: generateToken(updatedUser._id)
    });
});

/* -------------------------------------------------------------------------- */
/*                             DELETE USER ACCOUNT                            */
/* -------------------------------------------------------------------------- */
exports.deleteUser = asyncHandler(async (req, res) => {
    const query = await usersModel.deleteOne(req.user);
    if (!query.acknowledged) throw new Error(query);
    res.status(200).json({
        deleted: req.user.mail
    });
});

function generateToken(id) {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "30d"
    });
}

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}