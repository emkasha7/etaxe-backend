require("dotenv").config();
const app = require("./app");
const pool = require("./config/db");

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await pool.query("SELECT NOW()");
        console.log("🟢 Base PostgreSQL connectée");

        app.listen(PORT, () => {
            console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Erreur connexion base :", error);
    }
}

startServer();