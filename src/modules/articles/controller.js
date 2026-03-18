const pool = require("../../config/db");

async function getArticlesByCentre(req, res) {
    try {
        const centre_id = req.user.centre_id;

        const result = await pool.query(
            `SELECT code_article_budgetaire,
              designation,
              montant
       FROM etaxe.article_budgetaire
       WHERE centre_id = $1`,
            [centre_id]
        );

        res.json(result.rows);

    } catch (error) {
        console.error("Erreur articles:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}

module.exports = { getArticlesByCentre };