require("dotenv").config();
const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
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
app.use("/", router);

// start the server
db.connect()
    .then(result => {
        console.log(result);
        app.listen(port, () => console.log(`listening on port ${port}`))
        .on("error", err => {
            if (err.code === 'EADDRINUSE') console.log('port busy');
            else console.log(err);
        });
    })
    .catch(err => console.error(err));
