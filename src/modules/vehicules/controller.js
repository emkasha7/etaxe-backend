const pool = require("../../config/db");

// 🔹 Lister véhicules
async function getVehicules(req, res) {
    try {
        const result = await pool.query(
            "SELECT * FROM etaxe.vehicules ORDER BY created_at DESC"
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}

// 🔹 Créer véhicule
async function createVehicule(req, res) {
    try {
        const { plaque, proprietaire, categorie } = req.body;

        if (!plaque || !proprietaire || !categorie) {
            return res.status(400).json({ message: "Champs requis manquants" });
        }

        const result = await pool.query(
            `INSERT INTO etaxe.vehicules (plaque, proprietaire, categorie)
       VALUES ($1, $2, $3)
       RETURNING *`,
            [plaque, proprietaire, categorie]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}

// 🔹 Modifier véhicule
async function updateVehicule(req, res) {
    try {
        const { id } = req.params;
        const { plaque, proprietaire, categorie } = req.body;

        const result = await pool.query(
            `UPDATE etaxe.vehicules
       SET plaque=$1, proprietaire=$2, categorie=$3
       WHERE id=$4
       RETURNING *`,
            [plaque, proprietaire, categorie, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Véhicule introuvable" });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}

// 🔹 Supprimer véhicule
async function deleteVehicule(req, res) {
    try {
        const { id } = req.params;

        await pool.query(
            "DELETE FROM etaxe.vehicules WHERE id=$1",
            [id]
        );

        res.json({ message: "Véhicule supprimé" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}

module.exports = {
    getVehicules,
    createVehicule,
    updateVehicule,
    deleteVehicule
};