const mongoose = require("mongoose");
const errorsHandler = require("../middleware/modelsMiddleware/errorsHandler.middleware");
const userCheck = require("../middleware/modelsMiddleware/userCheck.middleware");

const userSchema = mongoose.Schema({
    mail: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 20,
    },
    right: {
        type: Number,
        default: 0,
    },
    password: {
        type: String,
        required: true,
    },
    listeningHistory: {
        type: Array,
        default: []
    },
}, { timestamps: true });

userSchema.pre(['updateOne', 'update', 'findOneAndUpdate', 'save'], userCheck);
userSchema.post(['updateOne', 'update', 'findOneAndUpdate', 'save'], errorsHandler);

module.exports = mongoose.model("Users", userSchema);
