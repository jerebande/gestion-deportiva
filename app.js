const express = require("express");  
const app = express();  
const http = require('http');  
const session = require('express-session');  
const path = require('path');  
const fs = require('fs');  
const server = http.createServer(app);  
const port = 3000;  
 
app.use(express.urlencoded({ extended: true })); // <-- NECESARIO para leer POST de formularios
app.use(express.json());
// rutas
const routerintegrantes = require("./routers/integrantes")

 
app.use("/", routerintegrantes);  
app.use('/public', express.static("public"));  
app.use(express.static(path.join(__dirname, 'public')));  

app.set("view engine", "ejs"); 
const sessionMiddleware = session({  
    secret: 'hola',  
    saveUninitialized: true,  
    resave: true,  
    cookie: {  
        maxAge: 30 * 60 * 1000
    }  
});  


app.use(sessionMiddleware);  
server.listen(port, () => {  
    console.log(`Servidor corriendo en ${port}`);  
});