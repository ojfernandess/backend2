const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();

// Middleware para processar o corpo das requisições
app.use(bodyParser.json());

// Banco de dados simulado em memória (como um objeto)
let userProfits = {}; 

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

// Endpoint para buscar os ganhos (GET)
app.get("/api/profit/:planId", authenticate, (req, res) => {
    const userId = req.user.id;
    const planId = req.params.planId;
    const profit = userProfits[userId]?.[planId] || { profit: 0, updatedAt: Date.now() };
    res.json(profit);
});

// Endpoint para atualizar os ganhos (PUT)
app.put("/api/profit/:planId", authenticate, (req, res) => {
    const userId = req.user.id;
    const planId = req.params.planId;
    const { profit, updatedAt } = req.body;

    if (!userProfits[userId]) userProfits[userId] = {};
    userProfits[userId][planId] = { profit, updatedAt };

    res.status(200).send("Ganhos atualizados com sucesso");
});

// Endpoint para criar ganhos (POST), caso necessário
app.post("/api/profit/:planId", authenticate, (req, res) => {
    const userId = req.user.id;
    const planId = req.params.planId;
    const { profit, updatedAt } = req.body;

    if (!userProfits[userId]) userProfits[userId] = {};
    userProfits[userId][planId] = { profit, updatedAt };

    res.status(201).send("Ganhos criados com sucesso");
});

// Inicia o servidor
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
