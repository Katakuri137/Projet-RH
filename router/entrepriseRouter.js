const entrepriseRouter = require("express").Router()
const { PrismaClient } = require("@prisma/client")
const hashPasswordExtension = require("../prisma/services/extentions/hashPasswordExtension")
const bcrypt = require('bcryptjs')
const authguard = require("../prisma/services/authguard")

const prisma = new PrismaClient().$extends(hashPasswordExtension)

// entrepriseRouter.get('/', authguard, async (req, res) => {
//     try {
//         const entrepriseId = req.session.entrepriseId
//         const employes = await prisma.employe.findMany({
//             where: {
//                 entrepriseId
//             },
//             include: {
//                 entreprise: true,
//                 ordinateur: true
//             }
//         });

//         const ordinateurs = await prisma.ordinateur.findMany({
//             where: {
//                 entrepriseId
//             },
//             include: {
//                 entreprise: true,
//                 employe: true
//             }
//         });
//         res.render('pages/dashboard.twig', {
//             ordinateurs,
//             employes,
//             entreprise: req.session.entreprise
//         });
//     } catch (error) {
//         console.error(error);
//         res.redirect('/');
//     }
// });

entrepriseRouter.get("/logout", (req, res) => {
    req.session.destroy()
    res.redirect("/login")
})
entrepriseRouter.get("/login", (req, res) => {
    res.render("pages/login.twig")
})

entrepriseRouter.post("/login", async (req, res) => {
    try {
        const entreprise = await prisma.entreprise.findUnique({
            where: {
                siret: req.body.siret
            }
        })
        if (entreprise) {
            if (await bcrypt.compare(req.body.password, entreprise.password)) {
                req.session.entrepriseId = entreprise.id
                res.redirect("/")
                console.log("Connexion Réussi !");
            }
            else {
                console.log(entreprise);

                throw { password: "Mot de passe incorrect" };
            }
        } else {
            throw { siret: "SIRET incorrect" };
        }
    } catch (error) {
        console.log(error);
        res.render("pages/login.twig", {
            error
        })
    }
})

entrepriseRouter.get("/register", (req, res) => {
    res.render("pages/register.twig")
})

entrepriseRouter.post("/register", async (req, res) => {
    try {
        // Vérifie si les mots de passe correspondent
        if (req.body.password === req.body.confirmPassword) {
            // Vérifie si le SIRET existe déjà
            const existingEntreprise = await prisma.entreprise.findUnique({
                where: {
                    siret: req.body.siret,
                },
            });

            if (existingEntreprise) {
                throw { siret: "Ce SIRET est déjà utilisé." }; // Si le SIRET existe, retourne une erreur
            }

            const entreprise = await prisma.entreprise.create({
                data: {
                    siret: req.body.siret,
                    raisonSocial: req.body.raisonSocial,
                    password: req.body.password,
                }
            });
            res.redirect("/login");
            console.log("Compte entreprise crée avec succès !");

        } else {
            throw { confirmPassword: "Les mots de passe ne correspondent pas." };
        }
    } catch (error) {
        console.log(error);

        res.render("pages/register.twig", {
            error: error,
            title: "Inscription"
        });
    }
});
module.exports = entrepriseRouter
