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
const pais_js_1 = __importDefault(require("./models/pais.js"));
const db_1 = __importDefault(require("./db"));
const paisesArray = [
    new pais_js_1.default("Estados Unidos", 339987103),
    new pais_js_1.default("Brasil", 203062512),
    new pais_js_1.default("Japão", 124127899),
    new pais_js_1.default("África do Sul", 59308690),
    new pais_js_1.default("Austrália", 25499884)
];
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    let conn = null;
    try {
        conn = yield (0, db_1.default)();
        const db = conn.db();
        const paises = db.collection("paises");
        // forma simples
        yield paises.deleteMany({}); // delete from paises;
        /*await paises.deleteMany({
            $and: [
                { populacao: { $gte: 10000} },
                { nome: "Teste" }
            ]
        }); // delete from paises where populacao >= 100000 and nome = 'Teste';*/
        yield paises.insertMany(paisesArray);
        /*// forma verbosa
        for (let pais of paisesArray) {
            await paises.insertOne(pais);
        }

        paisesArray.forEach(async (pais) => {
            await paises.insertOne(pais);
        });*/
    }
    catch (error) {
        console.log(error);
    }
    finally {
        conn === null || conn === void 0 ? void 0 : conn.close();
    }
});
main();
