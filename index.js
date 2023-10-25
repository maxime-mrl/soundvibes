require("dotenv").config();
const express = require("express");
const db = require("./config/db");
const router = require("./routes");
const fileUpload = require("express-fileupload");
const errorHandler = require("./middleware/errors.middleware");
const cors = require("cors")

const port = process.env.PORT;
const app = express();

// express config
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload({ createParentPath: true }));
app.use(cors())
app.use("/api", router);
app.use(errorHandler);

// start the server
db.connectPromise()
    .then(result => {
        console.log(result);
        app.listen(port, () => console.log(`listening on port ${port}`));
    })
    .catch(err => console.error(err));
