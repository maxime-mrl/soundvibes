const mongoose = require("mongoose");
const userCheck = require("../middleware/modelsMiddleware/userCheck.middleware");
const errorsHandler = require("../middleware/modelsMiddleware/errorsHandler.middleware");


const historySchema = new mongoose.Schema({
    // would've like to do it like recentHistory, but couldn't make it work
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Musics',
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
  }, { _id: false });


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
    recentHistory: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Musics" }],
        default: []
    },
    
    fullHistory: [historySchema],
    // Alternatively, if you want to allow an array of arrays
    // fullHistory: [[{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Music',
    //   required: true,
    // }, Number]],
}, { timestamps: true });

// check to make sure user format are good
userSchema.pre(['updateOne', 'update', 'findOneAndUpdate', 'save'], userCheck);
// customize error thrown by mongoose
userSchema.post(['updateOne', 'update', 'findOneAndUpdate', 'save'], errorsHandler);

module.exports = mongoose.model("Users", userSchema);
