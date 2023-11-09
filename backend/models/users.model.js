const mongoose = require("mongoose");
const userCheck = require("../middleware/modelsMiddleware/userCheck.middleware");
const errorsHandler = require("../middleware/modelsMiddleware/errorsHandler.middleware");

const userSchema = mongoose.Schema({
    mail: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 20
    },
    right: {
        type: Number,
        default: 0
    },
    password: {
        type: String,
        required: true
    },
    listeningHistory: {
        type: Array,
        default: []
    },
}, { timestamps: true });

// check to make sure user format are good
userSchema.pre(['updateOne', 'update', 'findOneAndUpdate', 'save'], userCheck);
// customize error thrown by mongoose
userSchema.post(['updateOne', 'update', 'findOneAndUpdate', 'save'], errorsHandler);

module.exports = mongoose.model("Users", userSchema);
