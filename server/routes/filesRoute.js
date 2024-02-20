const express = require("express");
const filesService = express();
const cors = require("cors");

filesService.use(cors());

const filesController = require("./../controllers/filesController");

filesService.get("/api/get-user-sheets", filesController.getUserExcels);
filesService.get("/api/get-sheet-data", filesController.getUserExcelData);

module.exports = filesService;

