//  biblioteca do node para fazer requisição api
import express from "express";
// biblioteca para transformar o formato dos dados em JSON 
import bodyParser from "body-parser";

import deviceRoutes from "./routes/deviceRoutes";
// Biblioteca para nao dar erro de cors
import cors from 'cors'

// Inicializa um express
const app = express();

// Porta onde vai rodar o backEnd - Tanto para o servidor quando localmente
const port = process.env.PORT || 3000;

// Formata o retorno da api para JSON
app.use(bodyParser.json());
// Evitar o erro de cors
app.use(cors());

// Entrada das rotas
app.use("/devices", deviceRoutes);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
