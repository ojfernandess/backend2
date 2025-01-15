const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();
app.use(bodyParser.json());

let userProfits = {}; // Mock database em memória

// Middleware para autenticação
function authenticate(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).send("Token não fornecido");

    try {
        const user = jwt.verify(token, "secreto");
        req.user = user;
        next();
    } catch {
        res.status(401).send("Token inválido");
    }
}

// Endpoint para buscar os ganhos
app.get("/api/profit/:planId", authenticate, (req, res) => {
    const userId = req.user.id;
    const planId = req.params.planId;
    const profit = userProfits[userId]?.[planId] || { profit: 0, updatedAt: Date.now() };
    res.json(profit);
});

// Endpoint para atualizar os ganhos
app.put("/api/profit/:planId", authenticate, (req, res) => {
    const userId = req.user.id;
    const planId = req.params.planId;
    const { profit, updatedAt } = req.body;

    if (!userProfits[userId]) userProfits[userId] = {};
    userProfits[userId][planId] = { profit, updatedAt };

    res.send("Atualizado com sucesso");
});

// Inicia o servidor
app.listen(10000, () => console.log("Servidor rodando na porta 10000"));
