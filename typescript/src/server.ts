import { MongoClient, ObjectId } from 'mongodb';
import express, { Request, Response, json } from "express";
import cors from "cors";
import getMongoConn from './db';
import Pais from './models/pais';
import routers from "./routers";

const port = 3000;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/paises", routers.paisesRouter);

app.listen(port, () => {
    console.log(`Servidor sendo executado na porta ${port}`);
});