function requireAdmin(req, res, next) {
    if (req.user.role !== "ADMIN") {
        return res.status(403).json({ message: "Accès refusé - ADMIN uniquement" });
    }
    next();
}

module.exports = requireAdmin;