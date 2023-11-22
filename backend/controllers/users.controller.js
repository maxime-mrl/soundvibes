const asyncHandler = require("express-async-handler");
const usersModel = require("../models/users.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const playlistsModel = require("../models/playlists.model");

exports.registerUser = asyncHandler(async (req, res) => {
    /* ------------------------------ INPUTS CHECK ------------------------------ */
    const { username, mail, password, age } = req.body;
    // check everything is here
    if (!username || !mail || !age || !password) throw {
        message: `Fields missing: ${(!username ? "username " : "")}${(!mail ? "mail " : "")}${(!age ? "age " : "")}${(!password ? "password" : "")}`,
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

exports.loginUser = asyncHandler(async (req, res) => {
    /* ------------------------------ INPUTS CHECK ------------------------------ */
    const { mail, password } = req.body;
    // check everything is here
    if (!mail || !password) throw {
        message: `Fields missing: ${(!mail ? "mail " : "")}${(!password ? "password" : "")}`,
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

exports.getUser = asyncHandler(async (req, res) => {
    /* ---------------------------- RETURN USER INFOS --------------------------- */
    res.status(200).json({
        _id: req.user._id,
        mail: req.user.mail,
        username: req.user.username,
        right: req.user.right
    });
});

exports.updateUser = asyncHandler(async (req, res) => {
    /* ------------------------------ INPUTS CHECK ------------------------------ */
    const { username, mail, password, confirmPassword } = req.body;
    const user = await usersModel.findOne(req.user);
    // necessary datas are presents
    if (!confirmPassword || !user) throw {
        message: "Missing data",
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

exports.setRight = asyncHandler(async (req, res) => {
    /* ------------------------------ CHECK RIGHTS ------------------------------ */
    if (!req.user.right || req.user.right < 2) throw {
        message: `You are not authorized to do this!`,
        status: 403
    };
    const { right } = req.body;
    /* -------------------------- FIND THE TARGET USER -------------------------- */
    const targetParams = {};
    if (req.body.mail) targetParams.mail = req.body.mail;
    if (req.body.id) targetParams._id = req.body.id;
    if (req.body.username) targetParams.username = req.body.username;
    /* ------------------------- CHECK IF ENOUGH IS HERE ------------------------ */
    if (!right || Object.keys(targetParams).length === 0) throw {
        message: "invalid data",
        code: 400
    };
    /* -------------------------------- FIND USER ------------------------------- */
    const targetUser = await usersModel.findOne(targetParams);
    if (!targetUser) throw {
        message: "User not found",
        status: 404
    };
    /* ------------------------------- UPDATE USER ------------------------------ */
    const updatedUser = await usersModel.findByIdAndUpdate(targetUser._id, { right }, { new: true });
    res.status(200).json({
        updatedId: updatedUser._id,
        newRight: updatedUser.right
    });
})

exports.deleteUser = asyncHandler(async (req, res) => {
    /* ------------------------------ INPUTS CHECK ------------------------------ */
    const { confirmPassword } = req.body;
    const user = await usersModel.findOne(req.user);
    // necessary datas are presents
    if (!confirmPassword || !user) throw {
        message: "Missing data",
        status: 400
    };
    // password check
    if (!await bcrypt.compare(confirmPassword, user.password)) throw {
        message: "Incorrect credentials",
        status: 400
    };
    /* ------------------------ DELETE SELF USER ACCOUNT ------------------------ */
    const query = await usersModel.deleteOne(req.user);
    await playlistsModel.deleteMany({ owner: user._id });
    if (!query.acknowledged) throw new Error(query);
    res.status(200).json({ deleted: req.user.mail });
});

const generateToken = id => jwt.sign({id}, process.env.JWT_SECRET, { expiresIn: "30d" });
