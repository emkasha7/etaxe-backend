const pool = require("../../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function login(req, res) {
    try {
        const { username, password } = req.body;

        const result = await pool.query(
            "SELECT * FROM etaxe.users WHERE username = $1 AND actif = true",
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Utilisateur introuvable" });
        }

        const user = result.rows[0];

        const validPassword = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!validPassword) {
            return res.status(401).json({ message: "Mot de passe incorrect" });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
                centre_id: user.centre_id
            },
            process.env.JWT_SECRET,
            { expiresIn: "8h" }
        );

        res.json({
            message: "Connexion réussie",
            token,
            user: {
                id: user.id,
                nom: user.nom,
                role: user.role,
                centre_id: user.centre_id
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}

module.exports = { login };