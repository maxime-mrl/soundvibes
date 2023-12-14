const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { isValidObjectId } = require("mongoose");
const usersModel = require("../models/users.model");
const playlistsModel = require("../models/playlists.model");
const recommendationsModel = require("../models/recommendations.model");

/* -------------------------------------------------------------------------- */
/*                             CREATE NEW ACCOUNT                             */
/* -------------------------------------------------------------------------- */
exports.registerUser = asyncHandler(async (req, res) => {
    /* ------------------------------ INPUTS CHECK ------------------------------ */
    const { username, mail, password, age } = req.body;
    // check everything is here
    if (!username || !mail || !age || !password) throw {
        message: "At least one missing field",
        status: 400
    };
    // check age
    if (age < 13) throw {
        message: `Come back see us in ${13 - age} years ;)`,
        status: 200
    };
    /* ------------------------------- CREATE USER ------------------------------ */
    const user = await usersModel.create({ mail, username, password });
    /* -------------------------------- RESPONSE -------------------------------- */
    if (user) res.status(201).json({
        _id: user._id,
        username: user.username,
        right: user.right,
        token: generateToken(user._id)
    });
    else throw new Error("User can't be created right now");
});

/* -------------------------------------------------------------------------- */
/*                                    LOGIN                                   */
/* -------------------------------------------------------------------------- */
exports.loginUser = asyncHandler(async (req, res) => {
    /* ------------------------------ INPUTS CHECK ------------------------------ */
    const { mail, password } = req.body;
    // check everything is here
    if (!mail || !password) throw {
        message: "At least one missing field",
        status: 400
    };
    /* --------------------------- MAIL AND PASS CHECK -------------------------- */
    const user = await usersModel.findOne({ mail });
    if (user && await bcrypt.compare(password, user.password)) res.status(200).json({
        _id: user._id,
        username: user.username,
        right: user.right,
        token: generateToken(user._id)
    });
    else throw {
        message: "Incorrect credentials",
        status: 200
    };
});

/* -------------------------------------------------------------------------- */
/*                               GET USER INFOS                               */
/* -------------------------------------------------------------------------- */
exports.getUser = asyncHandler(async (req, res) => {
    /* ---------------------------- RETURN USER INFOS --------------------------- */
    res.status(200).json({
        _id: req.user._id,
        mail: req.user.mail,
        username: req.user.username,
        right: req.user.right
    });
});

/* -------------------------------------------------------------------------- */
/*                              GET USER HISTORY                              */
/* -------------------------------------------------------------------------- */
exports.getHistory = asyncHandler(async (req, res) => {
    const user = await usersModel.findOne({ _id: req.user._id })
        .populate({
            path: "recentHistory",
            select: "title artist genre year"
        })
    /* ---------------------------- RETURN USER INFOS --------------------------- */
    res.status(200).json(user.recentHistory);
});

/* -------------------------------------------------------------------------- */
/*                             UPDATE USER ACCOUNT                            */
/* -------------------------------------------------------------------------- */
exports.updateUser = asyncHandler(async (req, res) => {
    /* ------------------------------ INPUTS CHECK ------------------------------ */
    const { username, mail, password, confirmPassword } = req.body;
    const user = await usersModel.findOne(req.user);
    // necessary datas are presents
    if (!confirmPassword || !user) throw {
        message: "At least one missing field",
        status: 400
    };
    // password check
    if (!await bcrypt.compare(confirmPassword, user.password)) throw {
        message: "Incorrect credentials",
        status: 400
    };
    /* ------------------------------- UPDATE DATA ------------------------------ */
    const updatedUser = await usersModel.findByIdAndUpdate(user._id, {
        mail,
        username,
        password,
    }, { new: true });
    res.status(200).json({
        _id: updatedUser._id,
        username: updatedUser.username,
        token: generateToken(updatedUser._id),
        right: updatedUser.right,
    });
});

/* -------------------------------------------------------------------------- */
/*                               SET USER RIGHT                               */
/* -------------------------------------------------------------------------- */
exports.setRight = asyncHandler(async (req, res) => {
    /* ------------------------------ CHECK RIGHTS ------------------------------ */
    if (!req.user.right || req.user.right < 2) throw {
        message: `You are not authorized to do this!`,
        status: 403
    };
    const { target, right } = req.body;
    /* ------------------------------- CHECK DATA ------------------------------- */
    if (isNaN(right) && typeof right !== 'number' || !target) throw {
        message: "invalid data",
        code: 400
    };
    /* -------------------- DETERMINATE THE SELECTION METHOD -------------------- */
    const targetParams = {};
    if (/^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$/.test(target)) targetParams.mail = target;
    else if (isValidObjectId(target)) targetParams._id = target;
    else targetParams.username = target;
    /* -------------------------------- FIND USER ------------------------------- */
    const targetUser = await usersModel.findOne(targetParams);
    if (!targetUser) throw {
        message: "User not found",
        status: 404
    };
    /* ------------------------------- UPDATE USER ------------------------------ */
    const updatedUser = await usersModel.findByIdAndUpdate(targetUser._id, { right }, { new: true });
    res.status(200).json({ status: `Successfully updated user ${updatedUser._id} to right ${updatedUser.right}` });
})

/* -------------------------------------------------------------------------- */
/*                             DELETE USER ACCOUNT                            */
/* -------------------------------------------------------------------------- */
exports.deleteUser = asyncHandler(async (req, res) => {
    /* ------------------------------ INPUTS CHECK ------------------------------ */
    const { confirmPassword } = req.body;
    const user = await usersModel.findOne({_id: req.user._id});
    // necessary datas are presents
    if (!confirmPassword || !user) throw {
        message: "At least one missing field",
        status: 400
    };
    // password check
    if (!await bcrypt.compare(confirmPassword, user.password)) throw {
        message: "Incorrect credentials",
        status: 400
    };
    /* ------------------------ DELETE SELF USER ACCOUNT ------------------------ */
    const query = await usersModel.deleteOne({_id: user._id });
    await playlistsModel.deleteMany({ owner: user._id });
    await recommendationsModel.deleteMany({ targetUser: user._id });
    if (!query.acknowledged) throw new Error(query);
    res.status(200).json({ deleted: req.user.mail });
});

// generate token
const generateToken = id => jwt.sign({id}, process.env.JWT_SECRET, { expiresIn: "30d" });
