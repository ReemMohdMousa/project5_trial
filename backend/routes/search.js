const express = require("express");
const { mainSearch } = require("../controllers/search");

const searchRouter = express.Router();
searchRouter.get("/", mainSearch);

module.exports = searchRouter;
