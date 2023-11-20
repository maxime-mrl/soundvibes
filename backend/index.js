require("dotenv").config();
const cors = require("cors");
const cookieParser = require('cookie-parser');
const express = require("express");
const fileUpload = require("express-fileupload");
const db = require("./config/db");
const router = require("./routes");

const port = process.env.PORT;
const app = express();

// express config
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload({ createParentPath: true }));
app.use(cors({
    credentials: true,
    origin: '*'
}));
app.use(cookieParser());
app.use("/", (req, res, next) => {console.log("incoming request " + req.url); next()}, router);

// start the server
db.connect()
    .then(result => {
        console.log(result);
        app.listen(port, () => console.log(`listening on port ${port}`));
    })
    .catch(err => console.error(err));
