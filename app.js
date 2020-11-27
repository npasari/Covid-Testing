var mysql = require('mysql');
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "cse316",
    port: 3306
});

const express = require('express');
const app = express();
const url = require('url');
const { strict } = require('assert');

app.get("/", function(req, res){
    writeHomePage(req, res);
});

function writeHomePage(req, res){
    let html = `<!DOCTYPE html>
    <html lang="en">
        <head>
            <title>COVID19 TESTING</title>
        </head>
        <body>
            <h1>WELCOME</h1>
            <form action = "/employeelogin" method="get">
            <button name="employee">Employee Login</button></form>
            <form action ="/labtechlogin" method="get">
                <button name="labtech"> Lab Technician Login</button></form>
        </body>
    </html>`
    res.write(html);
    res.end();
}

app.get("/schedule", function(req, res){
    writeSchedule(req, res);
});

port = process.env.PORT || 3000;
app.listen(port, function(){
    console.log("server started!");
});

