const mongoose = require("mongoose");

exports.connect = async () => { // try to connect database
    const conn = await mongoose.connect(process.env.MONGO_URI);
    return `Connected to mongoDB: ${conn.connection.host}`;
};
