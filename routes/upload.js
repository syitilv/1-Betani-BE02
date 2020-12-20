const express = require('express');
const multer = require("multer");
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public")
    },
    filename: function (req, file, cb) {
        const parts = file.mimetype.split("/");
        cb(null, `${file.fieldname}-${Date.now()}.${parts[1]}`)
    }
})

const upload = multer({storage});

const uploads = express.Router();


uploads.route('/')

.post(upload.single("file"), (req, res, next) => {
    var imgPath = path.join(__dirname, '../public', req.file.filename);
    res.sendFile(imgPath);
});

module.exports = uploads;