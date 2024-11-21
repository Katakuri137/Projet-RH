const taskRouter = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const authguard = require("../prisma/services/authguard");

const prisma = new PrismaClient();

taskRouter.get('/', authguard, async (req, res) => {
    try {
        const entreprise = req.session.entreprise;
        const [tasks, ordinateurs, employes] = await Promise.all([
            prisma.task.findMany({
                where: { employee: { entrepriseId: entreprise.id } },
                include: { employee: true }
            }),
            prisma.ordinateur.findMany({
                where: { entrepriseId: entreprise.id },
                include: { employe: true }
            }),
            prisma.employe.findMany({ where: { entrepriseId: entreprise.id } })
        ]);

        res.render('pages/dashboard.twig', { entreprise, tasks, ordinateurs, employes });
    } catch (error) {
        console.error("Erreur dashboard:", error);
        res.status(500).send("Erreur lors du chargement du tableau de bord");
    }
});

taskRouter.get('/addtask', authguard, async (req, res) => {
    const employes = await prisma.employe.findMany({ where: { entrepriseId: req.session.entreprise.id } });
    res.render('pages/addTask.twig', { entreprise: req.session.entreprise, employes });
});

taskRouter.post('/addtask', authguard, async (req, res) => {
    try {
        await prisma.task.create({
            data: {
                title: req.body.title,
                description: req.body.description,
                dueDate: req.body.dueDate ? new Date(req.body.dueDate) : null,
                employeeId: parseInt(req.body.employeeId),
            }
        });
        res.redirect("/");
    } catch (error) {
        console.error("Erreur ajout tâche:", error);
        res.render("pages/addTask.twig", { entreprise: req.session.entreprise, error });
    }
});

taskRouter.get('/updatetask/:id', authguard, async (req, res) => {
    try {
        const task = await prisma.task.findUnique({ where: { id: parseInt(req.params.id) } });
        res.render('pages/updatetask.twig', { entreprise: req.session.entreprise, task });
    } catch (error) {
        console.error("Erreur formulaire mise à jour:", error);
        res.redirect('/');
    }
});

taskRouter.post('/updatetask/:id', authguard, async (req, res) => {
    try {
        await prisma.task.update({
            where: { id: parseInt(req.params.id) },
            data: {
                title: req.body.title,
                description: req.body.description,
                dueDate: req.body.dueDate ? new Date(req.body.dueDate) : null,
                status: req.body.status
            }
        });
        res.redirect("/");
    } catch (error) {
        console.error("Erreur mise à jour tâche:", error);
        res.redirect("/");
    }
});

taskRouter.post('/deletetask/:id', authguard, async (req, res) => {
    try {
        await prisma.task.delete({ where: { id: parseInt(req.params.id) } });
        res.redirect("/");
    } catch (error) {
        console.error("Erreur suppression tâche:", error);
        res.redirect("/");
    }
});

module.exports = taskRouter;