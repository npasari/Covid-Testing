var mysql = require('mysql');
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "25XOvyaKRu",
    database: "finalprojectschema",
    port: "3306"
});

const express = require('express');
////const path = require('path');
// var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
const url = require('url');
const {
    strict
} = require('assert');
const { request } = require('http');
const { response } = require('express');
const { table } = require('console');
const { write } = require('fs');

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
    //res.sendFile(__dirname + '/testcollection.html')
    
    let html = `
        <!DOCTYPE html>
    <html>
    <head>
      <style>
        table {
          font-family: arial, sans-serif;
          border-collapse: collapse;
          width: 100%;
        }

        td,

        th {
          border: 1px solid #dddddd;
          text-align: left;
          padding: 8px;
        }

        h1 {
          text-align: center;
          padding: 10px;
          background: #007991;
          background: #D31027;
          background: -webkit-linear-gradient(to right, #EA384D, #D31027);
          background: linear-gradient(to right, #EA384D, #D31027);
          color: black;
          letter-spacing: 0.2rem;
          margin-bottom: 60px;
        }

        .testCollect {
          width: 412px;
          overflow: hidden;
          margin: auto;
          margin: 20 0 0 450px;
          padding: 20px;
          background: #9fa2f5;
          border-radius: 15px;
        }
      

        #employeeID {
          width: 400px;
          height: 40px;
          border: none;
          border-radius: 3px;
          padding-left: 8px;
        }

        #testbarcode {
          width: 400px;
          height: 40px;
          border: none;
          border-radius: 3px;
          padding-left: 8px;
        }

        #addButton {
          width: 150px;
          height: 35px;
          border: none;
          border-radius: 3px;
          padding-left: 8px;
        }

        #deleteButton {
          width: 150px;
          height: 35px;
          border: none;
          border-radius: 3px;
          padding-left: 8px;
        }
      </style>
    </head>

      <body>

        <h1> Test Collection </h1>
        <div class = "testCollect">

          <form id = "addForm" action = '/addTestCollection' method = "get">
          <div>
              <label>Employee ID: </label>
              <input type="text" name = "eID" id = "employeeID"/>
          </div>
          <br>
          <div>
              <label>Test Barcode: </label>
              <input type="text" name = "testB" id = "testbarcode"/>
          </div>
        </div>

        <input type="submit" id = "addButton" value="Add"  />
        </form>

        <form id="return" action='/labHome' method="get">
                <input type="submit" id="return" value="Return" />
        </form>

        <button id = "deleteButton" > Delete  </button>

          <table id="dataTable" name = "dataTable" width="350px" border="1">
            <tr>
              <th> Select </th>
              <th> Employee ID </th>
              <th> Test Barcode </th>
            </tr>`;

    sqlquery = "SELECT employeeID, testBarcode FROM EmployeeTest"

    connection.query(sqlquery, function(err, result) {
        if (err) throw err
        // creating the table with the data from result
        for (var i = 0; i < result.length; i++) {
            newRow = `<tr><td><input type="radio" name = "bill" ></td> <td>` + result[i].employeeID + `</td> <td> ` + result[i].testBarcode + `</td> </tr>`;
            html += newRow
        }
        res.write(html + "</table>\n</body>\n</html>")
        res.end();
    })
})

// app.get("/poolMapping", function(req, res){
//     res.sendFile(__dirname + "/PoolMapping.html");
// })

app.get("/labAuth", function(req, res){
    let query = url.parse(req.url, true).query; // this has all of the html body, don't need to use bodyparser

         var labID = query.labId;
         console.log("email is " + labID);
 
         var password = query.password;
         console.log("password is " + password);
 
         var sql = `SELECT * FROM LabEmployee;`;
 
         let labIDValid = false // employeeID does not exist in table
 
         connection.query(sql, function(err, result){
             if (err) throw err;
             var i = 0;
             while(!labIDValid && i < result.length){
                 console.log("lab id vals: " + result[i].labID)
                 console.log(labID);
                 console.log(result[i].labID);
                 console.log(password);
                 console.log(result[i].password);
                 if (labID == result[i].labID && password == result[i].password){
                     labIDValid = true
                 } // if the employeeID exists in the Employee Table
                 i++;
             }
             console.log("is labID in table? " + labIDValid)
             if(labIDValid){
                 res.cookie('labID', labID);
                 res.redirect('/LabHome');
                 res.end();
             } else {
                res.redirect('/LabErrorPage');
                res.end();
            }
         });
})

app.get("/auth", function (req, res){
         let query = url.parse(req.url, true).query; // this has all of the html body, don't need to use bodyparser

         var employeeEmail = query.email;
         console.log("email is " + employeeEmail);
 
         var password = query.password;
         console.log("password is " + password);
 
         var sql = `SELECT * FROM Employee;`;

         var employeeID = "";
 
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
                     employeeID = result[i].employeeID;
                 } // if the employeeID exists in the Employee Table
                 i++;
             }
             console.log("is employeeID in table? " + employeeIDValid)
             if(employeeIDValid){
                 res.cookie('employeeID', employeeID);
                 res.redirect('/EmployeeResults');
                 res.end();
             } else {
                 res.redirect('/EmployeeErrorPage');
                 res.end();
             }
         });
})

app.get("/EmployeeErrorPage", function(req, res){
    res.sendFile(__dirname + '/EmployeeErrorPage.html');
})

app.get("/LabErrorPage", function(req, res){
    res.sendFile(__dirname + "/LabErrorPage.html");
})

app.get("/EmployeeResults", function(req, res){
    try {
        res.writeHead(200, {"Content-Type": "text/html"});
        let query = url.parse(req.url, true).query; // this has all of the html body, don't need to use bodyparser
        let html = `<!DOCTYPE html>
        <html lang = "en">
        <head>
        <title>Employee Results</title>
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
            <h1>Employee Testing Results</h1>
            <table>
            <tr>
                <th>Collection Date</th>
                <th>Result</th>
            </tr>
            </table>`;
        var employeeID = req.cookies['employeeID'];
        console.log(employeeID);
        let sql = `SELECT E1.collectionTime, W.result FROM 
        Employee E, EmployeeTest E1, WellTesting W, PoolMap P, Pool P1 WHERE 
        E.employeeID = E1.employeeID AND E.employeeID = '%${employeeID}%' 
        AND E1.testBarcode = P.testBarcode AND
        P.poolBarcode = P1.poolBarcode AND P1.poolBarcode = W.poolBarcodeFK;`
        console.log(employeeID);
        let html1 = '';
        connection.query(sql, function(err, result){
            if(err) throw err;
            for(let item of result){
                html1 += `
                <pre>
                    <tr>
                    <td> ` + item.collectionTime + ` </td>
                    <td> ` + item.result + ` </td></pre>`;
            }
            html.replace("<td>No Test</td>", html1);
            res.write(html + "\n\n</body>\n</html>");
        });

    } catch (e) {
        console.log("could not get EmployeeResults")
    }
    //res.sendFile(__dirname + '/EmployeeResults.html'); 
});

app.get("/addTestCollection", function(req, res) {
        let html = `
                <!DOCTYPE html>
            <html>
            <head>
              <style>
                table {
                  font-family: arial, sans-serif;
                  border-collapse: collapse;
                  width: 100%;
                }

                td,

                th {
                  border: 1px solid #dddddd;
                  text-align: left;
                  padding: 8px;
                }

                h1 {
                  text-align: center;
                  padding: 10px;
                  background: #007991;
                  background: #D31027;
                  background: -webkit-linear-gradient(to right, #EA384D, #D31027);
                  background: linear-gradient(to right, #EA384D, #D31027);
                  color: black;
                  letter-spacing: 0.2rem;
                  margin-bottom: 60px;
                }

                .testCollect {
                  width: 412px;
                  overflow: hidden;
                  margin: auto;
                  margin: 20 0 0 450px;
                  padding: 20px;
                  background: #9fa2f5;
                  border-radius: 15px;
                }
              

                #employeeID {
                  width: 400px;
                  height: 40px;
                  border: none;
                  border-radius: 3px;
                  padding-left: 8px;
                }

                #testbarcode {
                  width: 400px;
                  height: 40px;
                  border: none;
                  border-radius: 3px;
                  padding-left: 8px;
                }

                #addButton {
                  width: 150px;
                  height: 35px;
                  border: none;
                  border-radius: 3px;
                  padding-left: 8px;
                }

                #deleteButton {
                  width: 150px;
                  height: 35px;
                  border: none;
                  border-radius: 3px;
                  padding-left: 8px;
                }
              </style>
            </head>

              <body>

                <h1> Test Collection </h1>
                <div class = "testCollect">

                  <form id = "addForm" action = '/addTestCollection' method = "get">
                  <div>
                      <label>Employee ID: </label>
                      <input type="text" name = "eID" id = "employeeID"/>
                  </div>
                  <br>
                  <div>
                      <label>Test Barcode: </label>
                      <input type="text" name = "testB" id = "testbarcode"/>
                  </div>
                </div>

                <input type="submit" id = "addButton" value="Add"  />
                </form>
                <form id="return" action='/labHome' method="get">
                    <input type="submit" id="return" value="Return" />
                </form>

                <button id = "deleteButton" > Delete  </button>

                  <table id="dataTable" name = "dataTable" width="350px" border="1">
                    <tr>
                      <th> Select </th>
                      <th> Employee ID </th>
                      <th> Test Barcode </th>
                    </tr>`;

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

                                sqlquery = "SELECT employeeID, testBarcode FROM EmployeeTest"

                                connection.query(sqlquery, function(err, result) {
                                    if (err) throw err
                                    // creating the table with the data from result
                                    for (var i = 0; i < result.length; i++) {
                                        newRow = `<tr><td><input type="radio" name = "bill" ></td> <td>` + result[i].employeeID + `</td> <td> ` + result[i].testBarcode + `</td> </tr>`;
                                        html += newRow
                                    }
                                    res.write(html + "</table>\n</body>\n</html>")
                                    res.end();
                                })
                        })
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

app.get("/poolMapping", function(req, res){
    try {
        res.writeHead(200, {"Content-Type": "text/html"});
        let query = url.parse(req.url, true).query; // this has all of the html body, don't need to use bodyparser
        let html = `<!DOCTYPE html>
        <html>
        
        <head>
            <title>Pool Mapping</title>
        </head>
        
        <style type="text/css">
            h1 {
                text-align: center;
                padding: 20px;
                background: #007991;
                background: #D31027;
                background: -webkit-linear-gradient(to right, #EA384D, #D31027);
                background: linear-gradient(to right, #EA384D, #D31027);
                color: black;
                letter-spacing: 0.2rem;
                margin-bottom: 90px;
            }
        
            .poolMapping {
                width: 412px;
                overflow: hidden;
                margin: auto;
                margin: 20 0 0 450px;
                padding: 80px;
                background: #9fa2f5;
                border-radius: 15px;
            }
        
            #poolBarcode {
                width: 400px;
                height: 50px;
                border: none;
                border-radius: 3px;
                padding-left: 8px;
            }
        
            #test {
                border-style: solid;
                border-radius: 3px;
                padding-left: 25px;
                padding-top: 10px;
                padding-right: 25px;
                padding-bottom: 10px;
            }
        
            #testBarcode {
                float: left;
                width: 250px;
                height: 30px;
                border: none;
                border-radius: 3px;
                padding-left: 8px;
                margin-right: 25px;
            }
        
            #deleteTest {
                float: left;
                color: darkred;
                width: 70px;
                height: 30px;
                border-radius: 3px;
            }
        
            #addTest {
                width: 100px;
                height: 30px;
                color: blue;
                border-radius: 3px;
            }
        
            #submitPool {
                width: 400px;
                height: 50px;
                border: none;
                border-radius: 17px;
                padding-left: 7px;
                color: blue;
            }
        
            span {
                font-size: 17px;
            }

            .abc{
                border-left: 7px solid #9bdfe8 ;
                padding-left: 6px;
                background-color: #9fa2f5;
            }

            .dist{
                width: 120px;
                transition: background, 2.0s;
            }
        </style>
        
        <body>
            <h1>Pool Mapping</h1>
            <div class="poolMapping">
                <!-- <form action="/submitPool" method="get"> -->
                <form id = "poolMapForm" action="/addPoolMapping" method = "get">
                    <label for="poolBarcode"><b>Pool Barcode</b></label><br>
                    <input type="text" name="poolB" id="poolBarcode" placeholder="Pool Barcode" required><br><br>
                    
                    
                    <label for="testBarcodes"><b>Test Barcodes</b></label><br>
                    <div id="test">
                        <div class="input_field">
                            <input type="text" name="testB1" class="testBarcode" placeholder="Test Barcode" required>
                            <input type="text" name="testB2" class="testBarcode" placeholder="Test Barcode optional" >
                            <input type="text" name="testB3" class="testBarcode" placeholder="Test Barcode optional" >
                            <input type="text" name="testB4" class="testBarcode" placeholder="Test Barcode optional" >
                            <input type="text" name="testB5" class="testBarcode" placeholder="Test Barcode optional" >
                            <br><br>    
                        </div>
                    </div><br>
                    <button id= "addTest">Add Barcode</button><br><br>
                    <button type="submit" value ="click" id="submitPool">Submit Pool</button><br><br>
                </form>
            </div>
        
            <table class="displaytable" id="tablecodes">
                <thead>
                    <tr>
                        <th class="abc dist">Select</th>
                        <th class="abc dist">Pool Barcode</th>
                        <th class="abc dist">Test Barcodes</th>
                    </tr>
                </thead>
                <tr></tr>
            </table>`;
        connection.query(constructSQLPoolCommand(), function(err, results){
            if(err) throw err;
            let arr = writePoolTable(results);
            //console.log(arr);
            html = html.replace("<tr></tr>", arr)
            res.write(html + "\n\n</body>\n</html>");
            res.end();
        });
    } // end of try block
    catch (e) {
        console.log("could not add");
    }

});

function constructSQLPoolCommand(){
    var sql = `SELECT * FROM PoolMap P1, Pool P
                WHERE P.poolBarcode = P1.poolBarcode;`;
    return sql;
};

// Updates the Pool Testing HTML table dependent on the queries made to the database
function writePoolTable(SQLResult){
    console.log(SQLResult);
    let tableStr = "";
    for(let item of SQLResult){
        tableStr += "<tr><td><input type=\"radio\" id=\"" + item.poolBarcode + "\" value=\"" + item.poolBarcode +"\"></td>" +
        "<td> " + item.poolBarcode + " </td>" +
        "<td> " + item.testBarcode + " </td>" +
        "</tr>";
    }
    //tableStr += "</table>"
    console.log(tableStr);
    return tableStr;
}


app.get("/addPoolMapping", function (req, res) {
    try {
        // res.writeHead(200, {
        //     "Content-Type": "text/html"
        // });

        let html = `<!DOCTYPE html>
        <html>
        
        <head>
            <title>Pool Mapping</title>
        </head>
        
        <style type="text/css">
            h1 {
                text-align: center;
                padding: 20px;
                background: #007991;
                background: #D31027;
                background: -webkit-linear-gradient(to right, #EA384D, #D31027);
                background: linear-gradient(to right, #EA384D, #D31027);
                color: black;
                letter-spacing: 0.2rem;
                margin-bottom: 90px;
            }
        
            .poolMapping {
                width: 412px;
                overflow: hidden;
                margin: auto;
                margin: 20 0 0 450px;
                padding: 80px;
                background: #9fa2f5;
                border-radius: 15px;
            }
        
            #poolBarcode {
                width: 400px;
                height: 50px;
                border: none;
                border-radius: 3px;
                padding-left: 8px;
            }
        
            #test {
                border-style: solid;
                border-radius: 3px;
                padding-left: 25px;
                padding-top: 10px;
                padding-right: 25px;
                padding-bottom: 10px;
            }
        
            #testBarcode {
                float: left;
                width: 250px;
                height: 30px;
                border: none;
                border-radius: 3px;
                padding-left: 8px;
                margin-right: 25px;
            }
        
            #deleteTest {
                float: left;
                color: darkred;
                width: 70px;
                height: 30px;
                border-radius: 3px;
            }
        
            #addTest {
                width: 100px;
                height: 30px;
                color: blue;
                border-radius: 3px;
            }
        
            #submitPool {
                width: 400px;
                height: 50px;
                border: none;
                border-radius: 17px;
                padding-left: 7px;
                color: blue;
            }
        
            span {
                font-size: 17px;
            }

            .abc{
                border-left: 7px solid #9bdfe8 ;
                padding-left: 6px;
                background-color: #9fa2f5;
            }

            .dist{
                width: 120px;
                transition: background, 2.0s;
            }
        </style>
        
        <body>
            <h1>Pool Mapping</h1>
            <div class="poolMapping">
                <!-- <form action="/submitPool" method="get"> -->
                <form id = "poolMapForm" action="/addPoolMapping" method = "get">
                    <label for="poolBarcode"><b>Pool Barcode</b></label><br>
                    <input type="text" name="poolB" id="poolBarcode" placeholder="Pool Barcode" required><br><br>
                    
                    
                    <label for="testBarcodes"><b>Test Barcodes</b></label><br>
                    <div id="test">
                        <div class="input_field">
                            <input type="text" name="testB1" class="testBarcode" placeholder="Test Barcode" required>
                            <input type="text" name="testB2" class="testBarcode" placeholder="Test Barcode optional" >
                            <input type="text" name="testB3" class="testBarcode" placeholder="Test Barcode optional" >
                            <input type="text" name="testB4" class="testBarcode" placeholder="Test Barcode optional" >
                            <input type="text" name="testB5" class="testBarcode" placeholder="Test Barcode optional" >
                            <br><br>    
                        </div>
                    </div><br>
                    <button id= "addTest">Add Barcode</button><br><br>
                    <button type="submit" value ="click" id="submitPool">Submit Pool</button><br><br>
                </form>
            </div>
        
            <table class="displaytable" id="tablecodes">
                <thead>
                    <tr>
                        <th class="abc dist">Select</th>
                        <th class="abc dist">Pool Barcode</th>
                        <th class="abc dist">Test Barcodes</th>
                    </tr>
                </thead>
                <tr></tr>
            </table>
            
        </body>
        </html>`;
        let query = url.parse(req.url, true).query; // this has all of the html body, don't need to use bodyparser

        var poolbarcode = query.poolB // get PoolBarcode from poolBarcode input text in html
        console.log("Pool Barcode is " + poolbarcode)
        
        var count=1;
        
        var testbarcode1 = query.testB1
        console.log("Test Barcode is " + testbarcode1) // get test Barcode from test Barcode input text in html
        
        var testbarcode2 = query.testB2
        console.log("Test Barcode is " + testbarcode2) // get test Barcode from test Barcode input text in html
        if(testbarcode2 != null){
            count++;
        }

        var testbarcode3 = query.testB3
        console.log("Test Barcode is " + testbarcode3) // get test Barcode from test Barcode input text in html
        if(testbarcode3 != null){
            count++;
        }
        
        var testbarcode4 = query.testB4
        console.log("Test Barcode is " + testbarcode4) // get test Barcode from test Barcode input text in html
        if(testbarcode4 != null){
            count++;
        }
        
        var testbarcode5 = query.testB5
        console.log("Test Barcode is " + testbarcode5) // get test Barcode from test Barcode input text in html
        if(testbarcode5 != null){
            count++;
        }
        console.log(count) //count for how many are not null

        poolBarcodeSelectQuery = `SELECT poolBarcode FROM pool;`;
        testBarcodeSelectQuery = `SELECT testBarcode FROM Employeetest;`;

        let poolBarcodeDoesNotExist = true // poolBarcode does not exist in table
        let testbarcodeExists = false // testBarcode exists in table

        connection.query(poolBarcodeSelectQuery, function (err, result) { // checking that poolbarcode is not in the table
            if (err) throw err;

            for (i = 0; i < result.length; i++) {
                console.log("pool barcode vals: " + result[i].poolBarcode)
                if (poolbarcode == result[i].poolBarcode) // if the poolbarcode exists in the pool Table
                    poolBarcodeDoesNotExist = false
            }
            console.log("is poolbarcode in table? " + poolBarcodeDoesNotExist)
            if(count==1){
            connection.query(testBarcodeSelectQuery, function (err, result) { // check that testbarcode is in the EmployeeTest
                if (err) throw err;

                for (i = 0; i < result.length; i++) {
                    console.log("test barcode vals: " + result[i].testBarcode)
                    if (testbarcode == result[i].testBarcode) // if the test barcode already exists, set testbarcodeExists to true
                        testbarcodeExists = true
                }
                console.log("is testbarcode not in table? " + testbarcodeExists)

                if (poolBarcodeDoesNotExist && testbarcodeExists) {
                    //inserts into the pool table first
                    let sqlQuery = `INSERT INTO Pool(poolBarcode) VALUES ('` + poolbarcode + `')`;
                    console.log(sqlQuery);
                    connection.query(sqlQuery, function(err, results){
                        if(err) throw err;
                    });
                    
                    //inserts into the poolMapping table
                    sqlQuery = `INSERT INTO poolMap(testBarcode, poolBarcode)
                    VALUES ((SELECT testBarcode from EmployeeTest WHERE testBarcode = '` + testbarcode + `'), 
                    (SELECT poolBarcode from Pool WHERE poolBarcode = '` + poolbarcode + `'))`;
                    connection.query(sqlQuery, function(err, results){
                        if(err) throw err;
                    });
                } else {
                    console.log("Either pool Barcode already exists or test barcode doesn't exist in the database")
                    // DO NOT ADD extra row to the html
                    // implement extra code
                }
            });
        }
    
    
    }); 
    }catch(e){
            console.log("did not add pool mapping");
        }
});


// app.get("/wellTesting", function (req, res) {
//     res.sendFile(__dirname + '/WellTesting.html')
// });

/*When you open: 
The HTML page requests the app.js for the table contents
   The app.js SELECT queries the SQL Database
   app.js returns a json to the front end
Render that json as a table using javascript

Add:
The HTML page has a form and sends the form results to app.js
   The app.js inserts the form data into the SQL
   The app.js SELECT  queries the SQL Database
   app.js returns a json to the front end
Render that json as a table using javascript

Delete:
The HTML page sends which line to delete to app.js
   The app.js deletes the specified row in the SQL
   The app.js SELECT  queries the SQL Database
   app.js returns a json to the front end
Render that json as a table using javascript

Edit:
The HTML page sends which line to edit to app.js and what the new status is
   The app.js UPDATE the specified row to the new status in the SQL
   The app.js SELECT queries the SQL Database
   app.js returns a json to the front end
Render that json */

app.get("/wellTesting", function(req, res){
    try {
        res.writeHead(200, {"Content-Type": "text/html"});
        let query = url.parse(req.url, true).query; // this has all of the html body, don't need to use bodyparser
        let html = `<html>
        <head>
        <title>Well Testing</title>
        </head>
        <style type="text/css">
            h1 {
                text-align: center;
                padding: 8px;
                background: #007991;
                background: #D31027;
                background: -webkit-linear-gradient(to right, #EA384D, #D31027);
                background: linear-gradient(to right, #EA384D, #D31027);
                color: black;
                letter-spacing: 0.2rem;
                margin-bottom: 30px;
            }
        
            .wellBar {
                width: 362px;
                margin: 20 0 0 450px;
                padding: 40px;
                background: #9fa2f5;
                border-radius: 15px;
                position: absolute;
                left: 180px;
            }
        
        
            #wellBarcode {
                width: 350px;
                height: 40px;
                border: none;
                border-radius: 3px;
                padding-left: 8px;
            }
        
            #poolBarcode {
                width: 350px;
                height: 40px;
                border: none;
                border-radius: 3px;
                padding-left: 8px;
            }
        
            #result {
                width: 100px;
                height: 30px;
                border: none;
                border-radius: 3px;
                padding-left: 8px;
            }
        
            #add {
                width: 150px;
                height: 35px;
                border: none;
                border-radius: 3px;
                padding-left: 8px;
            }
        
            #edit {
                width: 80px;
                height: 30px;
                border: none;
                border-radius: 3px;
                padding-left: 8px;
            }
            
            
            #delete {
                width: 80px;
                height: 30px;
                border: none;
                border-radius: 3px;
                padding-left: 8px;
            }
        
            .abc{
                    border-left: 7px solid #9bdfe8 ;
                    padding-left: 6px;
                    background-color: #9fa2f5;
                }
            .dist{
                    width: 120px;
                    transition: background, 2.0s;
                }
        </style>
        <body>
            <h1>Well Testing</h1>
            <form id = "addWT" action = '/addWellTesting' method = "get">
                <div class="wellBar">
                    <label for="wellBarcode"><b> Well Barcode
                        </b>
                    </label><br>
                    <input type="text" name="wellB" id="wellBarcode" placeholder="Well Barcode"><br><br>
                    <label for="poolBarcode"><b>Pool Barcode
                        </b>
                    </label><br>
                    <input type="text" name="poolB" id="poolBarcode" placeholder="Pool Barcode"><br><br>
                    <label for="results"><b>Result:
                        </b>
                    </label>
                    <select name="results" id="results">
                        <option value="inProgress">in-progress</option>
                        <option value="positive">positive</option>
                        <option value="negative">negative</option>
                    </select><br><br>
                    <button type="submit" id="add" class="add">Add</button><br><br>
                </div>
            </form>
        
            <div id="tab">
                <table id="list" border="1">
                        <tr>
                            <th class="abc dist">Select</th>
                            <th class="abc dist">Well Barcode</th>
                            <th class="abc dist">Pool Barcode</th>
                            <th class="abc dist">Results</th>
                        </tr>
                        <tr></tr>
                </table>
            </div>
            <br>
        
            <form id="editWT" action='/editWellTesting' method="get">
                <input type="submit" id="edit" value="Edit" />
            </form>
            <form id="deleteWT" action='/deleteWellTesting' method="get">
                <input type="submit" id="delete" value="Delete" />
            </form>
            <form id="return" action='/labHome' method="get">
                <input type="submit" id="return" value="Return" />
            </form>`;
            connection.query(constructSQLWellCommand(), function(err, results){
                if(err) throw err;
                let arr = writeWellTable(results);
                //console.log(arr);
                html = html.replace("<tr></tr>", arr)
                res.write(html + "\n\n</body>\n</html>");
                res.end();
            });
    } // end of try block
    catch (e) {
        console.log("could not add");
    }

});

app.get("/addWellTesting", function (req, res) {
    try {
        // res.writeHead(200, {
        //     "Content-Type": "text/html"
        // });

        let html = `<html>
        <head>
        <title>Well Testing</title>
        </head>
        <style type="text/css">
            h1 {
                text-align: center;
                padding: 8px;
                background: #007991;
                background: #D31027;
                background: -webkit-linear-gradient(to right, #EA384D, #D31027);
                background: linear-gradient(to right, #EA384D, #D31027);
                color: black;
                letter-spacing: 0.2rem;
                margin-bottom: 30px;
            }
        
            .wellBar {
                width: 362px;
                margin: 20 0 0 450px;
                padding: 40px;
                background: #9fa2f5;
                border-radius: 15px;
                position: absolute;
                left: 180px;
            }
        
        
            #wellBarcode {
                width: 350px;
                height: 40px;
                border: none;
                border-radius: 3px;
                padding-left: 8px;
            }
        
            #poolBarcode {
                width: 350px;
                height: 40px;
                border: none;
                border-radius: 3px;
                padding-left: 8px;
            }
        
            #result {
                width: 100px;
                height: 30px;
                border: none;
                border-radius: 3px;
                padding-left: 8px;
            }
        
            #add {
                width: 150px;
                height: 35px;
                border: none;
                border-radius: 3px;
                padding-left: 8px;
            }
        
            #edit {
                width: 80px;
                height: 30px;
                border: none;
                border-radius: 3px;
                padding-left: 8px;
            }
            
            
            #delete {
                width: 80px;
                height: 30px;
                border: none;
                border-radius: 3px;
                padding-left: 8px;
            }
        
            .abc{
                    border-left: 7px solid #9bdfe8 ;
                    padding-left: 6px;
                    background-color: #9fa2f5;
                }
            .dist{
                    width: 120px;
                    transition: background, 2.0s;
                }
        </style>
        <body>
            <h1>Well Testing</h1>
            <form id = "addWT" action = '/addWellTesting' method = "get">
                <div class="wellBar">
                    <label for="wellBarcode"><b> Well Barcode
                        </b>
                    </label><br>
                    <input type="text" name="wellB" id="wellBarcode" placeholder="Well Barcode"><br><br>
                    <label for="poolBarcode"><b>Pool Barcode
                        </b>
                    </label><br>
                    <input type="text" name="poolB" id="poolBarcode" placeholder="Pool Barcode"><br><br>
                    <label for="results"><b>Result:
                        </b>
                    </label>
                    <select name="results" id="results">
                        <option value="inProgress">in-progress</option>
                        <option value="positive">positive</option>
                        <option value="negative">negative</option>
                    </select><br><br>
                    <button type="submit" id="add" class="add">Add</button><br><br>
                </div>
            </form>
        
            <div id="tab">
                <table id="list" border="1">
                        <tr>
                            <th class="abc dist">Select</th>
                            <th class="abc dist">Well Barcode</th>
                            <th class="abc dist">Pool Barcode</th>
                            <th class="abc dist">Results</th>
                        </tr>
                </table>
            </div>
            <br>
        
            <form id="editWT" action='/editWellTesting' method="get">
                <input type="submit" id="edit" value="Edit" />
            </form>
            <form id="deleteWT" action='/deleteWellTesting' method="get">
                <input type="submit" id="delete" value="Delete" />
            </form>`;

        let query = url.parse(req.url, true).query; // this has all of the html body, don't need to use bodyparser

        var wellbarcode = query.wellB // get WellBarcode from wellBarcode input text in html
        console.log("well Barcode is " + wellbarcode)
        var poolbarcode = query.poolB
        console.log("Pool Barcode is " + poolbarcode) // get pool Barcode from pool Barcode input text in html
        var employeeResult = query.results
        console.log("Result is " + employeeResult) // get result from result input text in html

        //inserts into the well table first
        // let sqlQuery = `INSERT INTO Well(wellBarcode) VALUES ('` + wellbarcode + `')`;
        // console.log(sqlQuery);
        // connection.query(sqlQuery, function(err, results){
        //     if(err) throw err;
        // });
        
        // //inserts into the wellTesting table
        // sqlQuery = `INSERT INTO WellTesting(poolBarcodeFK, wellBarcodeFK, testingStartTime, testingEndTime, result)
        // VALUES ((SELECT poolBarcode from Pool WHERE poolBarcode = '` + poolbarcode + `'), 
        // (SELECT wellBarcode from Well WHERE wellBarcode = '` + wellbarcode + `'), 
        // CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), '` + employeeResult + `')`;
        // connection.query(sqlQuery, function(err, results){
        //     if(err) throw err;
        // });

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

                if (wellBarcodeDoesNotExist && poolbarcodeExists) {
                    //inserts into the well table first
                    let sqlQuery = `INSERT INTO Well(wellBarcode) VALUES ('` + wellbarcode + `')`;
                    console.log(sqlQuery);
                    connection.query(sqlQuery, function(err, results){
                        if(err) throw err;
                    });
                    
                    //inserts into the wellTesting table
                    sqlQuery = `INSERT INTO WellTesting(poolBarcodeFK, wellBarcodeFK, testingStartTime, testingEndTime, result)
                    VALUES ((SELECT poolBarcode from Pool WHERE poolBarcode = '` + poolbarcode + `'), 
                    (SELECT wellBarcode from Well WHERE wellBarcode = '` + wellbarcode + `'), 
                    CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), '` + employeeResult + `')`;
                    connection.query(sqlQuery, function(err, results){
                        if(err) throw err;
                    });
                } else {
                    console.log("Either Well Barcode already exists or Pool barcode doesn't exist in the database")
                    // DO NOT ADD extra row to the html
                    // implement extra code
                }
            });
        });
        connection.query(constructSQLWellCommand(), function(err, results){
            if(err) throw err;
            let arr = writeWellTable(results);
            //html = html.replace("</table>", writeWellTable(results));
            console.log(arr);
            //res.write(html + "</table>\n\n</body>\n</html>");
            res.redirect('/wellTesting')
            res.end();
        });
    } // end of try block
    catch (e) {
        console.log("Error could not add")
    }
});

app.get("/editWellTesting", function (req, res) {
    try {
        let query = url.parse(req.url, true).query;
        console.log(query.edit);
        

    } // end of try block
    catch (e) {
        console.log("Error could not edit")
    }
});

function constructSQLWellCommand(){
    var sql = `SELECT * FROM WellTesting W1, Well W
                WHERE W.wellBarcode = W1.wellBarcodeFK;`;
    return sql;
};

// Updates the Well Testing HTML table dependent on the queries made to the database
function writeWellTable(SQLResult){
    console.log(SQLResult);
    let tableStr = "";
    // `<table id="list" border="1">
    // <tr>
    //     <th class="abc dist">Select</th>
    //     <th class="abc dist">Well Barcode</th>
    //     <th class="abc dist">Pool Barcode</th>
    //     <th class="abc dist">Results</th>
    // </tr>`;
    for(let item of SQLResult){
        tableStr += "<tr><td><input type=\"radio\" id=\"" + item.wellBarcodeFK + "\" value=\"" + item.wellBarcodeFK +"\"></td>" +
        "<td> " + item.wellBarcodeFK + " </td>" +
        "<td> " + item.poolBarcodeFK + " </td>" +
        "<td> " + item.result + " </td>" +
        "</tr>";
    }
    //tableStr += "</table>"
    console.log(tableStr);
    return tableStr;

}

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
