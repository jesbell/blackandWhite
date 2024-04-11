import express from 'express'; // módulo Express para crear el servidor web
import { join, dirname } from 'path'; // funciones para manejo de rutas de archivos y directorios
import { fileURLToPath } from 'url'; // función para convertir URL de archivo a ruta de sistema de archivos
import { v4 as uuidv4 } from "uuid"; //generar UUID
import { promises as fs } from 'fs'; // operaciones de sistema de archivos de forma asincrónica
import Jimp from 'jimp'; // Biblioteca para procesamiento de imágenes en Node.js

// Instancia de la aplicación Express
const app = express();

// convertir a una ruta de sistema de archivos
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// middleware para servir archivos estáticos desde el directorio 'public'
app.use(express.static(join(__dirname, "public")));

// middleware para servir archivos CSS y JS desde la biblioteca Bootstrap
app.use("/css", express.static(join(__dirname + "/node_modules/bootstrap/dist/css")));
app.use("/js", express.static(join(__dirname, "/node_modules/bootstrap/dist/js")));

app.use(express.urlencoded({ extended: true }));

// Definir ruta principal ("/index.html")
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

// Ruta POST para procesar una imagen
app.post('/transformar', async (req, res) => {

    try {
        // Generar un ID único de 6 caracteres
        const id = uuidv4().slice(0,6);
        
        // Leer la URL de la imagen del formulario
        const { urlImagen } = req.body;
        
        // Procesar la imagen con Jimp
        const imagen = await Jimp.read(urlImagen);
        await imagen
        .resize(350, Jimp.AUTO)
        .greyscale()
        .writeAsync(`public/img/${id}.jpg`)

        // Leer imagen procesada 
        const imagenData = await fs.readFile(`public/img/${id}.jpg`);

        // Enviar una respuesta html con la imagen
        res.send(`<img src="/img/${id}.jpg" alt="Imagen procesada">`);
        
    } catch (error) {
        res.send('Hubo un error al procesar la imagen');
    }
});

// Creando servidor con express en puerto 3000
app.listen(3000, () => {
    console.log("El servidor está inicializado en el puerto 3000");
});

// Ruta genérica 
app.get("*", (req, res) => {
    res.send("<center><h1>Esta página no existe... </h1></center>");
});