var fs = require('fs');
var path = require('path');
var geoip = require('geoip-lite');


module.exports.hackCheck = function(callback){

var rawDataArray = fs.readFileSync(path.join(__dirname, './uploads/log')).toString().split('\r\n');

//remove the empty lines
var dataArray = [];
rawDataArray.forEach(function(line){
	
	if(line.length != 0){
		dataArray.push(line);
	}
	
})
//create new file without blank rows
fs.writeFileSync(path.join(__dirname, './uploads/log'), dataArray.join('\r\n'));



var finalArray = [];

//Converting data into object array
var line_num = 1;
dataArray.forEach(function(myString){
	var myRegexp = /[^\s"]+|"([^"]*)"/gi;
	var myArray = [];

	do {
		var match = myRegexp.exec(myString);
		if (match != null)
			{
			myArray.push(match[1] ? match[1] : match[0]);
		}
	} while (match != null);

	httpProp = myArray[0].split(" ");
	client_IP_PORT = myArray[6].split(":");
	backend_IP_PORT = myArray[7].split(":");
	
	myObj = {
		'HTTP_METHOD' : httpProp[0],
		'URL' : httpProp[1],
		'HTTP_VERSION' : httpProp[2],
		'ORIGIN_HEADER' : myArray[1],
		'SSL_CIPHER' : myArray[2],
		'SSL_PROTOCOL' : myArray[3],
		'DATETIME' : myArray[4],
		'LB_NAME' : myArray[5],
		'CLIENT_IP' : client_IP_PORT[0],
		'client_port' : client_IP_PORT[1],
		'BACKEND_IP' : backend_IP_PORT[0],
		'backend_port' : backend_IP_PORT[1],
		'request_processing_time' : myArray[8],
		'backend_processing_time' : myArray[9],
		'response_processing_time' : myArray[10],
		'elb_status_code' : myArray[11],        
		'backend_status_code' : myArray[12],    
		'received_bytes' : myArray[13],         
		'sent_bytes' : myArray[14],             
		'line' : line_num
	}

	finalArray.push(myObj);
	console.log(myObj);

	line_num++;
})


//Hack Check (hard coded)
var finalHackArray = [];
finalArray.forEach(function(record){

	var hack_tag = 0;
	if(record.ORIGIN_HEADER === 'MATLAB R2013a'){
		hack_tag = 1;
		
	}
	if(geoip.lookup(record.CLIENT_IP).country !== 'IN'){
		hack_tag = 1;
	}
	
	if(hack_tag == 1){
		finalHackArray.push(record);
	}
	
});
var line_num = [];
finalHackArray.forEach(function(rec){
	line_num.push(rec.line);
});

callback(line_num);

};