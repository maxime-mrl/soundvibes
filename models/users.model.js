const mongoose = require("mongoose");
const errorsHandler = require("../middleware/modelsMiddleware/errorsHandler.middleware");

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
    password: {
        type: String,
        required: true,
    }
}, { timestamps: true });

userSchema.post(['updateOne', 'update', 'findOneAndUpdate', 'save'], errorsHandler);

module.exports = mongoose.model("Users", userSchema);
