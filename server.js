const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Endpoint para salvar o lucro
app.post('/save-profit', (req, res) => {
    const { planId, profit, timestamp } = req.body;
    console.log(`Lucro do plano ${planId}: ${profit}$, Timestamp: ${timestamp}`);

    // Aqui você pode integrar com seu banco de dados para salvar os dados

    res.status(200).json({ message: 'Lucro salvo com sucesso!' });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
