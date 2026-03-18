const express = require("express");
const router = express.Router();

const verifyToken = require("../../middlewares/verifyToken");

const { createPerception, 
    getPerceptions,
    getStats 
} = require("./controller");

// POST /api/perceptions
router.post("/", verifyToken, createPerception);
router.get("/", verifyToken, getPerceptions);
router.get("/stats", verifyToken, getStats);


module.exports = router;