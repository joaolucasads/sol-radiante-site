const express = require('express');
const expressEjsLayout = require('express-ejs-layouts');
const cookieParser = require('cookie-parser'); // <- aqui

let homeRoute = require("./routes/homeRoute");
let adminRoute = require("./routes/adminRoute");

const app = express();

// Middlewares
app.use(express.static("public"));
app.use(expressEjsLayout);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // <- aqui também

// Configurações de view
app.set("views", "./views");
app.set("view engine", "ejs");
app.set("layout", "./layout");

// Rotas
app.use("/", homeRoute);
app.use("/admin", adminRoute);

// Inicialização do servidor
app.listen(5000, function () {
    console.log("Servidor web iniciado na porta 5000");
});
