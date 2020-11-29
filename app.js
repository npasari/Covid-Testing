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
const {
    strict
} = require('assert');

app.get("/", function (req, res) {
    writeHomePage(req, res);
});

app.get("/employeeLogin", function (req, res) {
    employeeLogin(req, res);
});

//Home page that gives the user two options to choose - Technician Login or Employee Login
function writeHomePage(req, res) {
    let html = `<!DOCTYPE html>
    <html lang="en">
        <head>
            <title>COVID19 TESTING</title>
        </head>
        <style>
        h1{  
            text-align: center;  
            padding: 20px;  
            background: #007991;
            background: #D31027;
            background: -webkit-linear-gradient(to right, #EA384D, #D31027);
            background: linear-gradient(to right, #EA384D, #D31027);
            color: black;
            letter-spacing: 0.4rem;
            margin-bottom:90px;
        }      
        
        h1:hover {
            letter-spacing: 0.8rem;
        }

        #empButton{  
            width: 400px;  
            height: 60px;  
            border: none;  
            border-radius: 17px;  
            padding-left: 8px;  
            color: blue;   
        }  
        
        #techButton{
            width: 400px;  
            height: 60px;  
            border: none;  
            border-radius: 17px;  
            padding-left: 8px;  
            color: blue; 
        }

        .foo{
            width: 412px;  
            overflow: hidden;  
            margin: auto;  
            margin: 20 0 0 450px;  
            padding: 80px;  
            background: #9fa2f5;  
            border-radius: 15px ;  
        }

        </style>
        <body>
            <h1>WELCOME</h1>
            <div class="foo">
            <form action = "/employeeLogin" method="get">
                <button name="employee" id="empButton">Employee Login</button></form><br>
            <form action ="/labtechLogin" method="get">
                <button name="labtech" id="techButton"> Lab Technician Login</button></form>
            </div>
        </body>
    </html>`
    res.write(html);
    res.end();
}

//Employee Login page that takes you to results of the employee's covid test
function employeeLogin(req, res) {
    let html = `<!DOCTYPE html>
    <html lang = "en">
    <head>
    <title>Employee Login</title>
    <style type="text/css">
    h1{  
        text-align: center;  
        padding: 20px;  
        background: #007991;
        background: #D31027;
        background: -webkit-linear-gradient(to right, #EA384D, #D31027);
        background: linear-gradient(to right, #EA384D, #D31027);
        color: black;
        letter-spacing: 0.2rem;
        margin-bottom:90px;
    }  
    
    .empLogin{  
        width: 412px;  
        overflow: hidden;  
        margin: auto;  
        margin: 20 0 0 450px;  
        padding: 80px;  
        background: #9fa2f5;  
        border-radius: 15px ;  
    }  
    
    #email{  
        width: 400px;  
        height: 50px;  
        border: none;  
        border-radius: 3px;  
        padding-left: 8px;  
    }  
    
    #pass{
        width: 400px;  
        height: 50px;  
        border: none;  
        border-radius: 3px;  
        padding-left: 8px;  
          
    }
    
    #login{  
        width: 400px;  
        height: 50px;  
        border: none;  
        border-radius: 17px;  
        padding-left: 7px;  
        color: blue; 
    }  
    span{   
        font-size: 17px;  
    }  

    </style>
    </head>
    <body>
        <h1>Employee Login Page for Results</h1>
        <form action ="/employeeResult" method="get">
            <div class="empLogin">
              <label for="email"><b> Email
                </b>
              </label><br>
              <input type="text" name="email" id="email" placeholder="Email" required><br><br>
              <label for="pass"><b>Password
                </b>
              </label><br>
              <input type="password" name="password" id="pass" placeholder="Password" required><br><br>
              <button type="submit" id="login">Login</button><br><br>
            </div>
          </form>
    </body>
    </html>`
    res.write(html);
    res.end();
}


port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server started!");
});