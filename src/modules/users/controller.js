const pool = require("../../config/db");
const bcrypt = require("bcrypt");


/*
================================
CREATION UTILISATEUR
================================
*/
async function createUser(req, res) {

    try {

        const { nom, username, password, role, centre_id } = req.body;

        // vérifier si username existe déjà
        const exist = await pool.query(
            "SELECT id FROM etaxe.users WHERE username=$1",
            [username]
        );

        if (exist.rows.length > 0) {

            return res.status(400).json({
                message: "Utilisateur existe déjà"
            });

        }

        // hash mot de passe
        const hash = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO etaxe.users
            (nom, username, password_hash, role, centre_id, actif)
            VALUES ($1,$2,$3,$4,$5,$6)
            RETURNING id, nom, username, role`,
            [nom, username, hash, role, centre_id, true]
        );

        res.json({
            message: "Utilisateur créé",
            user: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Erreur serveur"
        });

    }

}


/*
================================
LISTE UTILISATEURS
================================
*/
async function listUsers(req, res) {

    try {

        const result = await pool.query(`
            SELECT
            id,
            nom,
            username,
            role,
            actif,
            created_at
            FROM etaxe.users
            ORDER BY id
        `);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Erreur serveur"
        });

    }

}


/*
================================
MODIFIER MOT DE PASSE
================================
*/
async function changePassword(req, res) {

    try {

        const { oldPassword, newPassword } = req.body;

        const userId = req.user.id;

        const user = await pool.query(
            "SELECT password_hash FROM etaxe.users WHERE id=$1",
            [userId]
        );

        if (user.rows.length === 0) {

            return res.status(404).json({
                message: "Utilisateur introuvable"
            });

        }

        const match = await bcrypt.compare(
            oldPassword,
            user.rows[0].password_hash
        );

        if (!match) {

            return res.status(400).json({
                message: "Ancien mot de passe incorrect"
            });

        }

        const hash = await bcrypt.hash(newPassword, 10);

        await pool.query(
            "UPDATE etaxe.users SET password_hash=$1 WHERE id=$2",
            [hash, userId]
        );

        res.json({
            message: "Mot de passe modifié"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Erreur serveur"
        });

    }

}


/*
================================
EXPORT DES FONCTIONS
================================
*/
module.exports = {
    createUser,
    listUsers,
    changePassword
};