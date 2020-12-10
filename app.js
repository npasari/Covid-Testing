var mysql = require('mysql');
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "72Buggyrides",
    database: "final",
    port: "3306"
});

const express = require('express');
////const path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const url = require('url');
const {
    strict
} = require('assert');
const { request } = require('http');
const { response } = require('express');

app.get("/", function (req, res) {
    writeHomePage(req, res);
});

app.get("/labtechLogin", function(req, res){
    //technicianLogin(req, res);
    res.sendFile(__dirname + '/TechnicianLogin.html')

});

app.get("/labHome", function(req, res){
    //labHome(req, res);
    res.sendFile(__dirname + '/LabHome.html')
});

app.get("/employeeLogin", function (req, res) {
    //employeeLogin(req, res);
    res.sendFile(__dirname + '/EmployeeLogin.html')
});

app.get("/testCollection", function (req, res) {

    res.sendFile(__dirname + '/testcollection.html')
})

app.get("/auth", function (req, res){
         //res.writeHead(200, { "Content-Type": "text/html" });
         let query = url.parse(req.url, true).query; // this has all of the html body, don't need to use bodyparser

         //var employeeEmail = req.body.email;
         var employeeEmail = query.email;
         console.log("email is " + employeeEmail);
 
         //var password = req.body.email;
         var password = query.password;
         console.log("password is " + password);
 
         var sql = `SELECT * FROM Employee;`;
 
         let employeeIDValid = false // employeeID does not exist in table
 
         connection.query(sql, function(err, result){
             if (err) throw err;
             var i = 0;
             while(!employeeIDValid && i < result.length){
                 console.log("employee id vals: " + result[i].employeeID)
                 console.log(employeeEmail);
                 console.log(result[i].email);
                 console.log(password);
                 console.log(result[i].passcode);
                 if (employeeEmail == result[i].email && password == result[i].passcode){
                     employeeIDValid = true
                     // console.log(employeeEmail);
                     // console.log(result[i].employeeID);
                     // console.log(password);
                     // console.log(result[i].passcode);
                 } // if the employeeID exists in the Employee Table
                 i++;
             }
             console.log("is employeeID in table? " + employeeIDValid)
             if(employeeIDValid){
                 res.redirect('/EmployeeResults');
                 res.end();
             }
         });
})

app.get("/EmployeeResults", function(req, res){
    res.sendFile(__dirname + '/EmployeeResults.html'); 
});

app.get("/addTestCollection", function(req, res) {
        try {
            res.writeHead(200, { "Content-Type": "text/html" });
            let query = url.parse(req.url, true).query; // this has all of the html body, don't need to use bodyparser

            var testbarcode = query.testB // get testBarcode from testBarcode input text in html
            console.log("testb is " + testbarcode)

            var empID = Number(query.eID)
            console.log("employee ID is " + empID) // get employeeID from employeeID input text in html

            // ATTENCION!!!!!!!!!
            // GET LAB ID FROM THE HOME PAGE, IMPLEMENT RIGHT HERE
            // ATTENCION!!!!!!!!!

            employeeIDSelectQuery = `SELECT employeeID FROM Employee;`;
            testbarcodeSelectQuery = `SELECT testBarcode FROM EmployeeTest;`;

            let employeeIDValid = false // employeeID does not exist in table
            let testbarcodeDoesNotExist = true // testBarcode does not exist in table

            connection.query(employeeIDSelectQuery, function(err, result) { // checking that employeeID is in the table
                if (err) throw err;
                
                for (i = 0; i < result.length; i++) {
                    console.log("employee id vals: " + result[i].employeeID)
                    if (empID == result[i].employeeID) // if the employeeID exists in the Employee Table
                        employeeIDValid = true
                }
                console.log("is employeeID in table? " + employeeIDValid)

                connection.query(testbarcodeSelectQuery, function(err, result) { // check that testbarcode is NOT in EmployeeTest
                    if (err) throw err;
                    
                    for (i = 0; i < result.length; i++) {
                        if (testbarcode == result[i].testBarcode) // if the test barcode already exists, set testbarcodeDoesNotExist to false
                            testbarcodeDoesNotExist = false
                    }
                    console.log("is testbarcode not in table? " + testbarcodeDoesNotExist)

                    if (employeeIDValid && testbarcodeDoesNotExist) { // if EmployeeID exists in table and testbarcode is not in EmployeeTest, inesrt new entry into EmployeeTest
                        insertQuery = `INSERT into EmployeeTest (testBarcode, employeeID, collectionTime, collectedBy) 
                        VALUES (?, ?, NOW(), ?)`;

                        values = [testbarcode, empID, 'abc'] // 'abc' is dummy labID until I get the actual labID

                        connection.query(insertQuery, values, function (err, result) {
                            if (err) throw err;
                            console.log("1 record inserted");
                        });
                    }

                    else {
                        console.log("Either EmployeeID is not valid or Testbarcode already exists in the database")
                        // DO NOT ADD extra row to the html
                        // implement extra code
                    }
                });
            });
        } // end of try block

        catch (e) {
            console.log("could not add")
        }

        
});

// end of get request for the "add" button

// switch to post request
app.post("/deleteTestCollection", function(req, res) {
        res.writeHead(200, { "Content-Type": "text/html" });
        
        // req.body contains whatever was in the "data" part of the Ajax post request
        var testbarcodemessy = Object.keys(req.body)[0]; // getting the first key/value pair
        var testbarcode = testbarcodemessy.match(/\d/g); // extracting just the digits, which is testbarcode
        testbarcode = testbarcode.join("");

        deleteQuery = `DELETE from EmployeeTest where testBarcode = ` + testbarcode + `;`;

        connection.query(deleteQuery, function(err, result) {
            if (err) throw err;
            console.log("deleted successfully")
        })
});



app.get("/wellTesting", function (req, res) {
    res.sendFile(__dirname + '/WellTesting.html')
});


app.get("/addWellTesting", function (req, res) {
    try {
        res.writeHead(200, {
            "Content-Type": "text/html"
        });
        let query = url.parse(req.url, true).query; // this has all of the html body, don't need to use bodyparser

        var wellbarcode = query.wellB // get WellBarcode from wellBarcode input text in html
        console.log("well Barcode is " + wellbarcode)
        var poolbarcode = query.poolB
        console.log("Pool Barcode is " + poolbarcode) // get pool Barcode from pool Barcode input text in html
        var employeeResult = query.results
        console.log("Result is " + employeeResult) // get result from result input text in html

        wellBarcodeSelectQuery = `SELECT wellBarcode FROM well;`;
        poolcodeSelectQuery = `SELECT poolBarcode FROM pool;`;

        let wellBarcodeDoesNotExist = true // wellBarcode does not exist in table
        let poolbarcodeExists = false // poolBarcode exists in table

        connection.query(wellBarcodeSelectQuery, function (err, result) { // checking that wellbarcode is not in the table
            if (err) throw err;

            for (i = 0; i < result.length; i++) {
                console.log("well barcode vals: " + result[i].wellBarcode)
                if (wellbarcode == result[i].wellBarcode) // if the wellbarcode exists in the well Table
                    wellBarcodeDoesNotExist = false
            }
            console.log("is wellbarcode in table? " + wellBarcodeDoesNotExist)

            connection.query(poolcodeSelectQuery, function (err, result) { // check that poolbarcode is in the Pool
                if (err) throw err;

                for (i = 0; i < result.length; i++) {
                    console.log("pool barcode vals: " + result[i].poolBarcode)
                    if (poolbarcode == result[i].poolBarcode) // if the pool barcode already exists, set poolbarcodeExists to true
                        poolbarcodeExists = true
                }
                console.log("is poolbarcode not in table? " + poolbarcodeExists)

                if (wellBarcodeDoesNotExist && poolbarcodeExists) { // if Well Barcode does not exist in table and poolbarcode is in pool, insert new entry 
                    insertQuery = `INSERT into welltesting (poolBarcodeFK, wellBarcodeFK, testingStartTime, testingEndTime, result) 
                        VALUES (?, ?, NOW(), NOW(), ?)`;

                    values = [wellbarcode, poolbarcode, employeeResult]

                    connection.query(insertQuery, values, function (err, result) {
                        if (err) throw err;
                        console.log("1 record inserted");
                    });
                } else {
                    console.log("Either Well Barcode already exists or Pool barcode doesn't exist in the database")
                    // DO NOT ADD extra row to the html
                    // implement extra code
                }
            });
        });
    } // end of try block
    catch (e) {
        console.log("Error could not add")
    }
});

//Home page that gives the user two options to choose - Technician Login or Employee Login
function writeHomePage(req, res) {
    let html = `<!DOCTYPE html>
    <html lang="en">
        <head>
            <title>COVID19 TESTING</title>
        </head>
        <style type="text/css">
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
                <button name="labtech" id="techButton">Lab Technician Login</button></form>
            </div>
        </body>
    </html>`
    res.write(html);
    res.end();
}

port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server started!");
});
