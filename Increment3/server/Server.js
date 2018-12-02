
//Not sure if we actually need a mongodb
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var bodyParser = require('body-parser');
var express = require('express');
var cors = require('cors');
//Url of node-red mongodb https://umkcparking.mybluemix.net/??? (not sure)
//maybe: mongodb://umkcParkTest:umkcParkTest@umkcparking.mybluemix.net:27017/parkingAvailability  ?
//var url = 'mongodb://umkcParkTest:umkcParkTest@umkcparking.mybluemix.net:27017/UMKCParking';
var url = 'mongodb://umkcParkTest:umkcParkTest1@ds237735.mlab.com:37735/umkc-parking';
var app = express();

var db;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
  next();
});


//Initialize the db
// db.createCollection("<collectionName>", { autoIndexId: false })
MongoClient.connect(url, function(err, database) {
  if(err) {
    return console.error(err);
  }else{
    console.log("Connected to db!");
    db = database;

    var cursor = db.collection('availabilityUpdate').find();
    cursor.forEach(function(data){
      //Per lotID
      if(data.payload._id == 1){
        //update the availability of that lot
        console.log(data);
      }
    });

    //Used to initialize 'parkingAvailaibily' ccollection
    db.createCollection('parkingAvailability', { autoIndexId: false });
    initAvail.forEach(function(avail){
      console.log(avail);
      db.collection('parkingAvailability').insertOne(avail);
      console.log("Successfully Inserted");
    });
    //db.collection('parkingAvailability').insertMany(initAvail);
    //Used to initialize 'parkingAvailaibily' ccollection
    db.createCollection('parkingLots', { autoIndexId: false });
    db.collection('parkingLots').insertMany(initLots);

    //Bring the db up-to-date
  }
});

//Post data to the mongodb
app.post('/setup', function(req, res){

  //MongoClient.connect(url, function(err, db) {
  //
  //
  //  if (err) {
  //    res.write("Connection Failed, Error while connecting to Database");
  //    res.end();
  //  } else {
  //    console.log("Connected to db!");
  //    createCol(db, req.body, function () {
  //      res.write("Successfully Inserted");
  //      res.end();
  //    });
  //  }
  //});

  console.log("Within the Post/setup method!");
  createCol(db, req.body, function () {
    res.write("Successfully Inserted");
    res.end();
  });
});

var createCol = function(db, data, callback) {
  //db.createCollection('parkingAvailability');
  //console.log(db.collection('parkingAvailability').stats())
  db.collection('parkingAvailability').insertOne(data, function(err, result) {
    //db.collection('parkingAvailability').insertOne( data, function(err, result) {
    if(err)
    {
      res.write("Insert Failed, Error while inserting document");
      res.end();
    }
    console.log("Inserted document into the 'parkingAvailability' collection.");
    callback();
  });
};

var initAvail = [
  {
    "_id":            1,
    "availableSpots": 100
  },
  {
    "_id":            2,
    "availableSpots": 50
  }
];


var initLots = [
  {
    "_id":         1,
    "name":       "Rockhill Parking Structure",
    "address":    "5277 Charlotte St, Kansas City, MO 64110, USA",
    "location" : {
      "lat": 39.03205,
      "lng": -94.5765
    },
    "capacity":  900,
    "group":      1,
    "type":       "student"
  },
  {
    "_id":         2,
    "name":       "UMKC Parking Lot 4",
    "address":    "4921 Rockhill Rd, Kansas City, MO 64110",
    "location" : {
      "lat": 39.0363009,
      "lng": -94.576883
    },
    "capacity":  330,
    "group":      2,
    "type":       "student"
  }
];


//Want to post to mongodb provided by node-red
app.get('/reportAvailability', function(req, res) {

    console.log("posts!");

});

app.get('/getAvailability', function(req, res){
  var cursor = db.collection('parkingAvailability').find();
  cursor.forEach(function(data){
    //Per lotID
    if(data.payload._id == 1){
      //update the availability of that lot
      console.log(data);
    }
  });
});

app.get('/getLots', function(req, res){
  var cursor = db.collection('parkingLots').find();
  cursor.forEach(function(data){
    //Per lotID
    if(data.payload._id == 1){
      //update the availability of that lot
      console.log(data);
    }
  });
});


var server = app.listen(8081,function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port)
});
