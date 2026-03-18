const express = require("express");

const router = express.Router();

const verifyToken = require("../../middlewares/verifyToken");
const requireRole = require("../../middlewares/requireRole");

const usersController = require("./controller");


// créer utilisateur
router.post(
    "/",
    verifyToken,
    requireRole("ADMIN"),
    usersController.createUser
);


// liste utilisateurs
router.get(
    "/",
    verifyToken,
    requireRole("ADMIN","DIRECTEUR"),
    usersController.listUsers
);


module.exports = router;