const mongoose = require("mongoose");

exports.connect = async () => { // try to connect database
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connected to mongoDB: ${conn.connection.host}`);
    } catch (err) {
        console.err(err);
        process.exit(1);
    }
}

exports.connectPromise = () => new Promise(async (resolve, reject) => { // try to connect database
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        resolve(`Connected to mongoDB: ${conn.connection.host}`);
    } catch (err) {
        reject(err);
    }
});