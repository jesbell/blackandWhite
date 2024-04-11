import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from "uuid"; //generar UUID
import { promises as fs } from 'fs';
import Jimp from 'jimp';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(__dirname);
app.use(express.static(join(__dirname, "public")));

app.use("/css", express.static(join(__dirname + "/node_modules/bootstrap/dist/css")));
app.use("/js", express.static(join(__dirname, "/node_modules/bootstrap/dist/js")));

app.use(express.urlencoded({ extended: true }));

// Definir ruta principal ("/index.html")
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

app.post('/transformar', async (req, res) => {

    const id = uuidv4().slice(0,6);
    // Leer la URL de la imagen del formulario
    const { urlImagen } = req.body;
    
    // Procesar la imagen
    const imagen = await Jimp.read(urlImagen);

    await imagen
    .resize(350, Jimp.AUTO)
    .greyscale()
    .writeAsync(`public/img/${id}.jpg`)
    const imagenData = await fs.readFile(`public/img/${id}.jpg`);
    res.send(`<img src="/img/${id}.jpg" alt="Imagen procesada">`);
});

// Creando servidor con express en puerto 3000
app.listen(3000, () => {
    console.log("El servidor está inicializado en el puerto 3000");
});

// Ruta genérica 
app.get("*", (req, res) => {
    res.send("<center><h1>Esta página no existe... </h1></center>");
});