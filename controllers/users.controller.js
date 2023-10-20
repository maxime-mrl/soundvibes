const asyncHandler = require("express-async-handler");
const usersModel = require("../models/users.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


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
    // check age
    if (age < 13) throw {
        message: `Come back see us in ${13 - age} years ;)`,
        status: 200
    };
    // Create user
    const user = await usersModel.create({ mail, username, password });

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
        const err = new Error("Invalid data");
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
    const updatedUser = await usersModel.findByIdAndUpdate(user._id, {
        mail: mail || user.mail,
        username: username || user.username,
        password: password || confirmPassword
    }, { new: true });
    res.status(200).json({
        _id: updatedUser._id,
        username: updatedUser.username,
        token: generateToken(updatedUser._id)
    });
});

exports.setRight = asyncHandler(async (req, res) => {
    if (!req.user.right || req.user.right < 2) throw {
        message: `You are not authorized to do this!`,
        status: 403
    };
    const { right } = req.body;
    const targetParams = {}
    if (req.body.mail) targetParams.mail = req.body.mail;
    if (req.body.id) targetParams._id = req.body.id;
    if (req.body.username) targetParams.username = req.body.username;
    if (!right || Object.keys(targetParams).length === 0) throw {
        message: "invalid data",
        code: 400
    }
    const targetUser = await usersModel.findOne(targetParams);
    if (!targetUser) throw {
        message: "User not found",
        status: 404
    }
    const updatedUser = await usersModel.findByIdAndUpdate(targetUser._id, { right }, { new: true })
    console.log(updatedUser)
    res.status(200).json({
        updatedId: updatedUser._id,
        newRight: updatedUser.right
    })
    // if (!targetUser) throw {
    //     message: `User not found`,
    //     status: 404
    // }
})

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
