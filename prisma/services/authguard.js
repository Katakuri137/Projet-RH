const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const authguard = async (req, res, next) => {
    try {
        // Vérifier si l'entrepriseId est présent dans la session
        if (req.session.entrepriseId) {
            let entreprise = await prisma.entreprise.findUnique({
                where: {
                    id: req.session.entrepriseId
                }
            })
            if (entreprise) {
                // Mettre à jour les informations de l'entreprise dans la session
                req.session.entreprise = {
                    id: entreprise.id,
                    siret: entreprise.siret,
                    raisonSocial: entreprise.raisonSocial
                };
                return next()
            }
        }
        // Si on arrive ici, c'est que l'authentification a échoué
        throw new Error("Utilisateur non connecté")
    } catch (error) {
        console.error("Erreur d'authentification:", error);
        res.redirect("/login")
    }
}

module.exports = authguard