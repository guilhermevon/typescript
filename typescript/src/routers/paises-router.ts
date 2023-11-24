import express, {Request, Response} from "express";
import {MongoClient, ObjectId} from "mongodb";
import Pais from "../models/pais.js";
import getMongoConn from "../db";

const paisesRouter = express.Router();

paisesRouter.get("/", async (req: Request, res: Response) => {
    const { populacao } = req.query;

    let populacaoNumber = 0;
    try {
        if (typeof populacao !== "string") {
            throw new Error("O parametro populacao nao foi informado");
        }
        populacaoNumber = parseInt(populacao);
        if (isNaN(populacaoNumber)) {
            throw new Error("O paramentro populacao nao e numero");
        }
    } catch (error) {
        res.status(400).json({ message: (error as Error).message })
        return;
    }

    let conn: MongoClient | null = null;
    try {
        conn = await getMongoConn();
        const db = conn.db();
        const paises = db.collection("paises");
        const docs = await paises.find({
            populacao: { $gte: populacaoNumber }
        }).toArray();
        res.status(200).json(docs);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    } finally {
        conn?.close();
    }
});

paisesRouter.post("/", async (req: Request, res: Response) => {
    const record = req.body;
    try {
        if (typeof record.nome === "undefined") {
            throw new Error("Nome não foi informado");
        }
        if (typeof record.nome !== "string") {
            throw new Error("Nome não é valido");
        }
        if (record.nome === "") {
            throw new Error("Nome não pode ser vazio");
        }
        if (typeof record.populacao === "undefined") {
            throw new Error("População não foi informada");
        }
        if (typeof record.populacao !== "number") {
            throw new Error("População deve ser um número");
        }
        if (record.populacao < 0) {
            throw new Error("População deve ser maior ou igual a zero");
        }
    } catch (error) {
        res.status(400).json({ message: (error as Error).message })
        return;
    }

    let conn: MongoClient | null = null;
    try {
        conn = await getMongoConn();
        const db = conn.db();
        const paises = db.collection("paises");

        const pais = new Pais(record.nome, record.populacao);
        await paises.insertOne(pais);
        res.status(201).json(pais);

    } catch (error) {
        res.status(500).json({ message: (error as Error).message })
    } finally {
        conn?.close();
    }

});

// http://localhost:3000/paises/<id>
paisesRouter.put("/:id", async (req: Request, res: Response) => {

    let objectId: ObjectId;
    try {
        objectId = new ObjectId(req.params.id);
    } catch (error) {
        res.status(400).json({ message: "O id não é válido" });
        return;
    }

    let conn: MongoClient | null = null;
    try {
        conn = await getMongoConn();
        const db = conn.db();
        const paises = db.collection("paises");

        if (await paises.find({ _id: objectId }).count() === 0) {
            res.status(404).json({ message: "Não existe documento com esse id" });
            return;
        }

        const record = req.body;
        try {
            if (typeof record.nome === "undefined") {
                throw new Error("Nome não foi informado");
            }
            if (typeof record.nome !== "string") {
                throw new Error("Nome não é valido");
            }
            if (record.nome === "") {
                throw new Error("Nome não pode ser vazio");
            }
            if (typeof record.populacao === "undefined") {
                throw new Error("População não foi informada");
            }
            if (typeof record.populacao !== "number") {
                throw new Error("População deve ser um número");
            }
            if (record.populacao < 0) {
                throw new Error("População deve ser maior ou igual a zero");
            }
        } catch (error) {
            res.status(400).json({ message: (error as Error).message })
            return;
        }

        const pais = new Pais(record.nome, record.populacao);
        await paises.updateOne({
            _id: objectId
        }, {
            $set: pais
        }); // semelhante: update paises set nome = '?', populacao = ? where _id = ?

        res.status(200).json(pais);

    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    } finally {
        conn?.close();
    }

});

paisesRouter.delete("/:id", async (req: Request, res: Response) => {

    let objectId: ObjectId;
    try {
        objectId = new ObjectId(req.params.id);
    } catch (error) {
        res.status(400).json({ message: "O id não é válido" });
        return;
    }

    let conn: MongoClient | null = null;
    try {
        conn = await getMongoConn();
        const db = conn.db();
        const paises = db.collection("paises");

        if (await paises.find({ _id: objectId }).count() === 0) {
            res.status(404).json({ message: "Não existe documento com esse id" });
            return;
        }

        await paises.deleteOne({
            _id: objectId
        }); // semelhante: delete from paises where _id = ?

        res.status(204).send("");

    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    } finally {
        conn?.close();
    }    

});

export default paisesRouter;