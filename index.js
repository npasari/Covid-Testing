var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
const url = require('url');

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "72Buggyrides",
    database: "final",
    port: 3306
});

var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});

app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM Employee WHERE email = ? AND passcode = ?', [username, password], function(error, results, fields) {
			if (error) throw error;
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

function employeeResults(req, res){
    res.writeHead(200, { "Content-Type": "text/html"});
	let query = url.parse(req.url, true).query;
	console.log(query);
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
                FROM WellTesting W, Employee E, EmployeeTest E1, Pool P, PoolMap P1
				WHERE E.email = '%${email}%' AND E1.employeeID = E.email 
				AND E1.testBarcode = P1.testBarcode AND P1.poolBarcode = P.poolBarcode
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