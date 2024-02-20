const express = require("express");
const uploadService = express();
const cors = require("cors");

const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");

uploadService.use(cors());
uploadService.use(bodyParser.urlencoded({extended: true}));
// uploadService.use(express.static(path.resolve(__dirname, "public")));

const storage = multer.diskStorage({
  destination: (req, file, cb ) => {
    cb(null, "./public/uploads");
  },
  fileName: (req, file, cb) => {
    const acceptableExtensions = ['csv']
      if (!(acceptableExtensions.some(extension => 
        path.extname(file.originalname).toLowerCase() === `.${extension}`)
      )) {
        return cb(new Error(`Extension not allowed, accepted extensions are ${acceptableExtensions.join(',')}`))
      }
      cb(null, file.originalname+'.csv');
  },
});

const upload = multer({storage});

const uploadController = require("./../controllers/uploadController");

uploadService.post("/api/upload-excel",upload.single('file'), uploadController.uploadExcelSheet);

module.exports = uploadService;

