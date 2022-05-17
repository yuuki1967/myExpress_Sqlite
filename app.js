var createError = require('http-errors');
var express = require('express');
var sql = require("mssql");
http = require('http');
//Commented out 1 2
xpath = require('xpath');
dom = require('xmldom').DOMParser;
fs = require('fs');
xml = fs.readFileSync('test.xml',"utf-8");
doc = new dom().parseFromString(xml);
select = xpath.useNamespaces({
  "a": "http://example.com/XMLSchema"
});

city = select("/a:School/a:Address/a:City/text()",
doc, true);

if(city){
  console.log(city.nodeValue);
}

var app = express();

var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.post('/student/', (req, res) =>{
  console.log(req.body);
  res.send("Received POST Data");
});

app.get('/:name', function(req, res) {

  //config for the database
  var config = {
    server: 'localhost',
    authentication:{
      type: 'default',
      options:{
        userName: 'sa',
        password: 'Checkmarx\!123'
      }
    },
    options:{ 
      database: 'demo'
    }
  };

  //connect to the database 'demo'
  sql.connect('Server=localhost,1433;Database=demo;User Id=sa;Password=Checkmarx!123;Trust_Connection=True;TrustServerCertificate=True', function(err) {
    if (err) console.log(err);

    //create Request object
    var request = new sql.Request();

    // query to the database and get the records
    var name=req.params.name,
      id=2,
      sqlQueryString="select * from dbo.students where (standardId='"+id+"' AND studentName='"+name+"')"; // SQL injection 
    request.query(sqlQueryString, function (err, recordset){
      if (err) console.log(err)
        // send records as a response
        res.send(recordset);
    });
  });
});

var server = app.listen(5000, function(){
  console.log('Server is running');
});
module.exports = app;
