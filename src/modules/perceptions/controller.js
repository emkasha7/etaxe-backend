const pool = require("../../config/db");

async function createPerception(req, res) {
  try {
    const { code_article_budgetaire, redevable_type, redevable_id, quantite } =
      req.body;

    const agent_id = req.user.id;
    const centre_id = req.user.centre_id;

    if (!code_article_budgetaire || !quantite || quantite <= 0) {
      return res.status(400).json({
        message: "Article ou quantité invalide",
      });
    }

    const articleResult = await pool.query(
      `SELECT montant, centre_id
       FROM etaxe.article_budgetaire
       WHERE code_article_budgetaire = $1`,
      [code_article_budgetaire]
    );

    if (articleResult.rows.length === 0) {
      return res.status(400).json({
        message: "Article budgétaire invalide",
      });
    }

    const article = articleResult.rows[0];

    if (article.centre_id !== centre_id) {
      return res.status(403).json({
        message: "Article non autorisé pour ce centre",
      });
    }

    const montant_total = Number(article.montant) * Number(quantite);

    const numero_recu = `REC-${Date.now()}`;

    await pool.query(
      `INSERT INTO etaxe.perceptions
       (
         code_article_budgetaire,
         redevable_type,
         redevable_id,
         quantite,
         montant_total,
         agent_id,
         centre_id,
         numero_recu
       )
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [
        code_article_budgetaire,
        redevable_type,
        redevable_id,
        quantite,
        montant_total,
        agent_id,
        centre_id,
        numero_recu,
      ]
    );

    res.json({
      message: "Perception enregistrée",
      numero_recu,
      montant_total,
    });

  } catch (error) {

    console.error("Erreur perception:", error);

    res.status(500).json({
      message: "Erreur serveur"
    });

  }
}


async function getPerceptions(req, res) {

  try {

    const user = req.user;

    let result;

    if (user.role === "ADMIN" || user.role === "DIRECTEUR") {

      result = await pool.query(`
        SELECT
        p.*,
        v.plaque,
        v.proprietaire,
        u.nom as agent
        FROM etaxe.perceptions p
        LEFT JOIN etaxe.vehicules v
        ON p.redevable_id=v.id
        LEFT JOIN etaxe.users u
        ON p.agent_id=u.id
        ORDER BY p.id DESC
      `);

    } 
    else if (user.role === "SUPERVISEUR") {

      result = await pool.query(
        `
        SELECT
        p.*,
        v.plaque,
        v.proprietaire,
        u.nom as agent
        FROM etaxe.perceptions p
        LEFT JOIN etaxe.vehicules v
        ON p.redevable_id=v.id
        LEFT JOIN etaxe.users u
        ON p.agent_id=u.id
        WHERE p.centre_id=$1
        ORDER BY p.id DESC
        `,
        [user.centre_id]
      );

    } 
    else {

      result = await pool.query(
        `
        SELECT
        p.*,
        v.plaque,
        v.proprietaire,
        u.nom as agent
        FROM etaxe.perceptions p
        LEFT JOIN etaxe.vehicules v
        ON p.redevable_id=v.id
        LEFT JOIN etaxe.users u
        ON p.agent_id=u.id
        WHERE p.agent_id=$1
        ORDER BY p.id DESC
        `,
        [user.id]
      );

    }

    res.json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Erreur serveur"
    });

  }

}


async function getStats(req, res) {

  try {

    const user = req.user;

    let result;

    if (user.role === "ADMIN" || user.role === "DIRECTEUR") {

      result = await pool.query(`
        SELECT
        COUNT(*) as total_perceptions,
        COALESCE(SUM(montant_total),0) as total_montant
        FROM etaxe.perceptions
      `);

    } 
    else if (user.role === "SUPERVISEUR") {

      result = await pool.query(`
        SELECT
        COUNT(*) as total_perceptions,
        COALESCE(SUM(montant_total),0) as total_montant
        FROM etaxe.perceptions
        WHERE centre_id = $1
      `,[user.centre_id]);

    } 
    else {

      result = await pool.query(`
        SELECT
        COUNT(*) as total_perceptions,
        COALESCE(SUM(montant_total),0) as total_montant
        FROM etaxe.perceptions
        WHERE agent_id = $1
      `,[user.id]);

    }

    res.json(result.rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Erreur serveur"
    });

  }

}


module.exports = {
  createPerception,
  getPerceptions,
  getStats
};