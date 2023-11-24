import { MongoClient } from 'mongodb';
import Pais from "./models/pais.js";
import getMongoConn from './db';

const paisesArray: Pais[] = [
    new Pais("Estados Unidos", 339_987_103),
    new Pais("Brasil", 203_062_512),
    new Pais("Japão", 124_127_899),
    new Pais("África do Sul", 59_308_690),
    new Pais("Austrália", 25_499_884)
];

const main = async () => {
    let conn: MongoClient | null = null;
    try {
        conn = await getMongoConn();
        const db = conn.db();
        const paises = db.collection("paises");

        // forma simples
        await paises.deleteMany({}); // delete from paises;
        
        /*await paises.deleteMany({
            $and: [
                { populacao: { $gte: 10000} },
                { nome: "Teste" }
            ]
        }); // delete from paises where populacao >= 100000 and nome = 'Teste';*/

        await paises.insertMany(paisesArray);

        /*// forma verbosa
        for (let pais of paisesArray) {
            await paises.insertOne(pais);
        }

        paisesArray.forEach(async (pais) => {
            await paises.insertOne(pais);
        });*/

    } catch (error) {
        console.log(error);
    } finally {
        conn?.close();
    }
}

main();