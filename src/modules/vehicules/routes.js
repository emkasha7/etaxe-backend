const express = require("express");
const router = express.Router();

const verifyToken = require("../../middlewares/verifyToken");
const requireAdmin = require("../../middlewares/requireAdmin");

const {
    getVehicules,
    createVehicule,
    updateVehicule,
    deleteVehicule
} = require("./controller"); // ⚠ attention ici

router.get("/", verifyToken, getVehicules);
router.post("/", verifyToken, createVehicule);
router.put("/:id", verifyToken, updateVehicule);
router.delete("/:id", verifyToken, requireAdmin, deleteVehicule);

module.exports = router;