const bcrypt = require("bcrypt");

const password = "password@123"; // le mot de passe que tu veux sécuriser
const saltRounds = 10; // niveau de sécurité

bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log("Mot de passe hashé :", hash);
});