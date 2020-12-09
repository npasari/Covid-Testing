var mysql = require('mysql');
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "C00ki3M0nst3r",
    database: "finalprojectschema",
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
    technicianLogin(req, res);
});

app.get("/labHome", function(req, res){
    labHome(req, res);
});

app.get("/employeeLogin", function (req, res) {
    employeeLogin(req, res);
});

app.get("/testCollection", function (req, res) {

    res.sendFile(__dirname + '/testcollection.html')
})

app.get("/employeeResults", function(req, res){
        console.log(email);
        employeeResults(req, res);
});

app.get("/addTestCollection", function(req, res) {

        res.writeHead(200, { "Content-Type": "text/html" });
        let query = url.parse(req.url, true).query; // this has all of the html body, don't need to use bodyparser

        var testbarcode = query.testB // get testBarcode from testBarcode input text in html
        console.log("testb is " + testbarcode)

        var empID = Number(query.eID)
        console.log("employee ID is " + empID) // get employeeID from employeeID input text in html

        // get labID of current employee who's using the system
        //insert code for this here

        selectQuery = `SELECT employeeID FROM Employee WHERE employeeID = ` + empID + `;`;
        selectResult = ""

        connection.query(selectQuery, function(err, result) {
            if (err) throw err;
            selectResult = result
        })

        if (selectResult !== null) {
            insertQuery = `INSERT into EmployeeTest (testBarcode, employeeID, collectionTime, collectedBy) 
            VALUES (?, ?, NOW(), ?)`;

            values = [testbarcode, empID, 'abc'] // 'abc' is dummy labID until I get the actual labID

            connection.query(insertQuery, values, function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
            });
            // get last filled row in LabEmployee, and collect 
        }
        else {
            console.log("Employee ID entered was not valid")
        }
});

app.post("/deleteTestCollection", function(req, res) {

        console.log("deleted successfully")

        // user selects radio button, so get the employeeID from the same row as the radio button

        deleteQuery = `DELETE FROM EmployeeTest WHERE`; // finish query
        
        connection.query(deleteQuery, function(err, result) {
            if (err) throw err;
            console.log("deleted successfully")
        })
        
});

app.post("/employeeResults", function(req, res){
    console.log(req.body.email);
    const email = req.body.email;
    console.log(email);
    const password = req.body.password;
    console.log(password);
    if(email && password){
        connection.query('SELECT * FROM Employee WHERE email = ?', [email], function(err, results, fields){
            if(err) throw err;
            else if(results.length > 0) {
                console.log(results);
                res.redirect('/employeeResults');
            } else {
                res.send('Incorrect Login!');
            }
            res.end();
        });
    } else {
        res.send("Please enter Email and Password!");
        res.end();
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

//Lab Technician Login Page which takes you to the Lab Home
function technicianLogin(req, res){
    let html = `<!DOCTYPE html>
    <html>
    
    <head>
        <title>Technician Login Page</title>
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
    
        .labLogin {
            width: 412px;
            overflow: hidden;
            margin: auto;
            margin: 20 0 0 450px;
            padding: 80px;
            background: #9fa2f5;
            border-radius: 15px;
        }
    
        #labId {
            width: 400px;
            height: 50px;
            border: none;
            border-radius: 3px;
            padding-left: 8px;
        }
    
        #pass {
            width: 400px;
            height: 50px;
            border: none;
            border-radius: 3px;
            padding-left: 8px;
    
        }
    
        #labTechLogin {
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
    </style>
    
    <body>
        <h1>Lab Technician Login</h1>
        <form action="/labHome" method="get">
            <div class="labLogin">
                <label for="labId"><b> Lab ID
                    </b>
                </label><br>
                <input type="text" name="labId" id="labId" placeholder="Lab ID"><br><br>
                <label for="pass"><b>Password
                    </b>
                </label><br>
                <input type="password" name="password" id="pass" placeholder="Password"><br><br>
                <button type="submit" id="labTechLogin">Lab Login</button><br><br>
            </div>
        </form>
    </html>`
    res.write(html);
    res.end();
}

//Lab Home which gives you three buttons to select - Test Collection, Pool Mapping, Well Testing
function labHome(req, res){
    let html = `<!DOCTYPE html>
    <html>
    
    <head>
        <title>Lab Home Page</title>
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
    
        .labHome {
            width: 412px;
            overflow: hidden;
            margin: auto;
            margin: 20 0 0 450px;
            padding: 80px;
            background: #9fa2f5;
            border-radius: 15px;
        }
    
        #lab_home {
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
    </style>
    
    <body>
        <h1>Lab Home</h1>
        <div class="labHome">
            <form action="/testCollection" method="get">
                <button type="test_collection" id="lab_home">Test Collection</button><br><br>
            </form>
            <form action="/poolMapping" method="get">
                <button type="pool_mapping" id="lab_home">Pool Mapping</button><br><br>
            </form>
            <form action="/wellTesting" method="get">
                <button type="well_testing" id="lab_home">Well Testing</button><br><br>
            </form>
        </div>
    
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
            <div class="empLogin">
              <label for="email"><b> Email
                </b>
              </label><br>
              <input type="text" name="email" id="email" placeholder="Email" required/><br><br>
              <label for="pass"><b>Password
                </b>
              </label><br>
              <input type="password" name="password" id="pass" placeholder="Password" required/><br><br>
              <form enctype="text/html" method="post" action="/employeeResults"><button type="submit" id="login">Login</button></form><br><br>
            </div>
    </body>
    </html>`

    res.write(html);
    res.end();
}

function employeeResults(req, res){
    let email = req.body.email;
    console.log(email);
    res.writeHead(200, { "Content-Type": "text/html"});
    let query = url.parse(req.url, true).query;
    let search = query.search ? query.search : "?";
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
        </table>
    </body>
    </html>`;
    let sql = `SELECT W.testingStartTime, W.result 
                FROM WellTesting W, Employee E, Pool P, PoolMap P1
                WHERE E.email = '%${email}%' AND E.testBarcode = P1.testBarcode AND P1.poolBarcode = P.poolBarcode
                AND P1.poolBarcode = W.poolBarcode;`;
    
    connection.query(sql, function(err, result){
        if(err) throw err;
        for(let item of result){
            html += `
            <pre>
            <tr>
                <td> ` + item.testingStartTime + ` </td>
                <td> ` + item.result + ` </td>  
            </tr>
            </pre>`
        }
        res.write(html + "\n\n</body>\n</html>");
        res.end();
    });
};


port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server started!");
});
