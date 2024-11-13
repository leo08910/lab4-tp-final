import mysql from "mysql2/promise";

export let db;

export async function conectarDB() {
  db = await mysql.createConnection({ // en vez de crear una conxion unica cree un pool de conexiones donde con los metodos me ayuda a manejarlas en caso de errores
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });
}