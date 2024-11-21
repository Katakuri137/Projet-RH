const ordinateurRouter = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const authguard = require("../prisma/services/authguard");

const prisma = new PrismaClient();

// Route pour ajouter un ordinateur
ordinateurRouter.get("/addordinateur", authguard, async (req, res) => {
    try {
        const employes = await prisma.employe.findMany({
            where: {
                entrepriseId: req.session.entreprise.id,
                ordinateur: null
            }
        });
        res.render("pages/addOrdinateur.twig", { employes });
    } catch (error) {
        console.error(error);
        res.redirect("/");
    }
});

ordinateurRouter.post("/addordinateur", authguard, async (req, res) => {
    try {
        const { mac, employeId } = req.body;
        await prisma.ordinateur.create({
            data: {
                mac,
                entrepriseId: req.session.entreprise.id,
                employeId: employeId ? parseInt(employeId) : null
            }
        });
        res.redirect("/");
    } catch (error) {
        console.error(error);
        res.render("pages/addOrdinateur.twig", {
            employes: await prisma.employe.findMany({
                where: {
                    entrepriseId: req.session.entreprise.id,
                    ordinateur: null
                }
            }),
            error
        });
    }
});

// Modifier un ordinateur
ordinateurRouter.get("/updatepc/:id", authguard, async (req, res) => {
    try {
        const employes = await prisma.employe.findMany({
            where: {
                entrepriseId: req.session.entreprise.id,
                ordinateur: null
            }
        });
        const ordinateur = await prisma.ordinateur.findUnique({
            where: { id: parseInt(req.params.id) }
        });
        res.render("pages/addOrdinateur.twig", { ordinateur, employes });
    } catch (error) {
        console.error(error);
        res.redirect("/");
    }
});

ordinateurRouter.post("/updatepc/:id", authguard, async (req, res) => {
    try {
        const { name, mac, employeId } = req.body;
        await prisma.ordinateur.update({
            where: { id: parseInt(req.params.id) },
            data: {
                name,
                mac,
                employeId: employeId ? parseInt(employeId) : null
            }
        });
        res.redirect("/");
    } catch (error) {
        console.error(error);
        res.redirect("/");
    }
});

// Supprimer un ordinateur
ordinateurRouter.post("/deletepc/:id", authguard, async (req, res) => {
    try {
        await prisma.ordinateur.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.redirect("/");
    } catch (error) {
        console.error(error);
        res.redirect("/");
    }
});

module.exports = ordinateurRouter;