"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
const pais_js_1 = __importDefault(require("../models/pais.js"));
const db_1 = __importDefault(require("../db"));
const paisesRouter = express_1.default.Router();
paisesRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    }
    catch (error) {
        res.status(400).json({ message: error.message });
        return;
    }
    let conn = null;
    try {
        conn = yield (0, db_1.default)();
        const db = conn.db();
        const paises = db.collection("paises");
        const docs = yield paises.find({
            populacao: { $gte: populacaoNumber }
        }).toArray();
        res.status(200).json(docs);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
    finally {
        conn === null || conn === void 0 ? void 0 : conn.close();
    }
}));
paisesRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    }
    catch (error) {
        res.status(400).json({ message: error.message });
        return;
    }
    let conn = null;
    try {
        conn = yield (0, db_1.default)();
        const db = conn.db();
        const paises = db.collection("paises");
        const pais = new pais_js_1.default(record.nome, record.populacao);
        yield paises.insertOne(pais);
        res.status(201).json(pais);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
    finally {
        conn === null || conn === void 0 ? void 0 : conn.close();
    }
}));
// http://localhost:3000/paises/<id>
paisesRouter.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let objectId;
    try {
        objectId = new mongodb_1.ObjectId(req.params.id);
    }
    catch (error) {
        res.status(400).json({ message: "O id não é válido" });
        return;
    }
    let conn = null;
    try {
        conn = yield (0, db_1.default)();
        const db = conn.db();
        const paises = db.collection("paises");
        if ((yield paises.find({ _id: objectId }).count()) === 0) {
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
        }
        catch (error) {
            res.status(400).json({ message: error.message });
            return;
        }
        const pais = new pais_js_1.default(record.nome, record.populacao);
        yield paises.updateOne({
            _id: objectId
        }, {
            $set: pais
        }); // semelhante: update paises set nome = '?', populacao = ? where _id = ?
        res.status(200).json(pais);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
    finally {
        conn === null || conn === void 0 ? void 0 : conn.close();
    }
}));
paisesRouter.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let objectId;
    try {
        objectId = new mongodb_1.ObjectId(req.params.id);
    }
    catch (error) {
        res.status(400).json({ message: "O id não é válido" });
        return;
    }
    let conn = null;
    try {
        conn = yield (0, db_1.default)();
        const db = conn.db();
        const paises = db.collection("paises");
        if ((yield paises.find({ _id: objectId }).count()) === 0) {
            res.status(404).json({ message: "Não existe documento com esse id" });
            return;
        }
        yield paises.deleteOne({
            _id: objectId
        }); // semelhante: delete from paises where _id = ?
        res.status(204).send("");
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
    finally {
        conn === null || conn === void 0 ? void 0 : conn.close();
    }
}));
exports.default = paisesRouter;
