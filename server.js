var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var multer  = require('multer');
var fs = require('fs');
var check = require('./hackCheck');

var app = express();
app.use(express.static(path.join(__dirname, '/client/js/')));


var storage = multer.diskStorage({
  destination: path.join(__dirname, './uploads/'),
  filename: function (req, file, cb) {
     cb(null, 'log');
  }
});
var upload = multer({ storage: storage })


var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res){

     fs.readFile(path.join(__dirname, '/client/index.html'), function(err, data){
        if(err){
            res.writeHead(500);
            return res.end("error loading index.html");
        }else {
            res.writeHead(200);
            res.end(data);
        }
    });

});


app.post('/logUpload', upload.single('file'), function(req, res){

    res.end('Message from server: File uploaded!');
    
});

app.get('/processLog' , function(req, res){

    if(!fs.existsSync(path.join(__dirname, './uploads/log'))){
        res.end("Message from server: Please upload the file!");
    }else{
        check.hackCheck(function(arr){
        
        var finalString = '';
        var rawDataArray = fs.readFileSync(path.join(__dirname, './uploads/log')).toString().split('\r\n');
        arr.forEach(function(line){
            finalString += 'Yes, ' + rawDataArray[line-1];
            finalString += '        ';
        });      
        fs.unlinkSync(path.join(__dirname, './uploads/log'));
        res.end(finalString);
    });
    }
});


app.listen(port, function(){
    console.log("the server is up on port " + port);
});