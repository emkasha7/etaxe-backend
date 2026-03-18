const express = require("express");
const router = express.Router();
const verifyToken = require("../../middlewares/verifyToken");
const { getArticlesByCentre } = require("./controller");

router.get("/", verifyToken, getArticlesByCentre);

module.exports = router;