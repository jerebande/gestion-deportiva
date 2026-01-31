const mysql = require("mysql")
//crear conexion
const conx = mysql.createConnection({
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "pescado"
})
conx.connect((error)=>{
   if(error){
    console.log(error)
    return;
   }
   console.log("conectado")
})
module.exports = conx;  