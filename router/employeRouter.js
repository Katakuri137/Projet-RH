const employeRouter = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const authguard = require("../prisma/services/authguard");

const prisma = new PrismaClient();

// Route pour ajouter un employé
employeRouter.get('/addemploye', authguard, (req, res) => {
    const entreprise = req.session.entreprise;
    res.render('pages/addEmploye.twig', { entreprise });
});

employeRouter.post('/addemploye', authguard, async (req, res) => {
    try {
        const employe = await prisma.employe.create({
            data: {
                lastName: req.body.lastName,
                firstName: req.body.firstName,
                email: req.body.email,
                password: req.body.password,
                age: parseInt(req.body.age),
                entrepriseId: req.session.entreprise.id
            }
        });
        res.redirect("/");
        console.log("Employé créé avec succès !");
    } catch (error) {
        console.log(error);
        res.render("pages/addEmploye.twig", {
            entreprise: req.session.entreprise,
            error
        });
    }
});

// Page pour modifier un employé existant
employeRouter.get('/updateemploye/:id', authguard, async (req, res) => {
    try {
        const employe = await prisma.employe.findUnique({
            where: { id: parseInt(req.params.id) }
        });
        res.render('pages/addEmploye.twig', {
            entreprise: req.session.entreprise,
            employe
        });
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
});

employeRouter.post('/updateemploye/:id', authguard, async (req, res) => {
    try {
        const updatedEmploye = await prisma.employe.update({
            where: { id: parseInt(req.params.id) },
            data: {
                lastName: req.body.lastName,
                firstName: req.body.firstName,
                email: req.body.email,
                age: parseInt(req.body.age),
            }
        });
        res.redirect("/");
    } catch (error) {
        console.error(error);
        res.redirect("/");
    }
});

// Supprimer un employé
employeRouter.post('/deleteemploye/:id', authguard, async (req, res) => {
    try {
        await prisma.employe.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.redirect("/");
    } catch (error) {
        console.error(error);
        res.redirect("/");
    }
});

module.exports = employeRouter;