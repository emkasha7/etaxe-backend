const express = require("express");
const cors = require("cors");

const articleRoutes = require("./modules/articles/routes");
const authRoutes = require("./modules/auth/auth.routes");
const vehiculesRoutes = require("./modules/vehicules/routes");
const perceptionsRoutes = require("./modules/perceptions/routes");
const userRoutes = require("./modules/users/routes");



const app = express();

app.use(cors());
app.use(express.json()); // ⚠ obligatoire

app.use("/api/auth", authRoutes);
app.use("/api/vehicules", vehiculesRoutes);
app.use("/api/perceptions", perceptionsRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
    res.json({ message: "API eTaxe POS opérationnelle" });
});

module.exports = app;