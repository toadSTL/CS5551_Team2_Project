
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

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Post data to the mongodb provided by node-red
app.post('/setup', function(req, res){
  MongoClient.connect(url, function(err, db) {
    if (err) {
      res.write("Connection Failed, Error while connecting to Database");
      res.end();
    } else {
      console.log("Connected to db!");
      createCol(db, req.body, function () {
        res.write("Successfully Inserted");
        res.end();
      });
    }
  });
});

var initAvail = [
  {
    "_id":             1,
    "lotID":   1,
    "userID":         "gregLogin",
    "timeReported":   1538189731656,
    "availability":   15
  },
  {
    "_id":             2,
    "lotID":   3,
    "userID":         "gregLogin",
    "timeReported":   1538189913010,
    "availability":   10
  },
  {
    "_id":             3,
    "lotID":   2,
    "userID":         "gregLogin",
    "timeReported":   1538189899338,
    "availability":   90
  },
  {
    "_id":             4,
    "lotID":   4,
    "userID":         "gregLogin",
    "timeReported":   1538189925161,
    "availability":   18
  },
  {
    "_id":             5,
    "lotID":   5,
    "userID":         "gregLogin",
    "timeReported":   1538189936380,
    "availability":   50
  },
  {
    "_id":             6,
    "lotID":   6,
    "userID":         "gregLogin",
    "timeReported":   1538189948905,
    "availability":   300
  },
  {
    "_id":             7,
    "lotID":   7,
    "userID":         "gregLogin",
    "timeReported":   1538189960851,
    "availability":   800
  }
]


var initLots = [
  {
    "_id":         1,
    "name":       "UMKC Parking Lot 11",
    "maxNumber":  20,
    "group":      1,
    "type":       "faculty"
  },
    {
      "_id":         2,
      "name":       "UMKC Parking Lot 9",
      "maxNumber":  100,
      "group":      2,
      "type":       "student"
    },
    {
      "_id":         3,
      "name":       "UMKC Parking Lot 57",
      "maxNumber":  15,
      "group":      3,
      "type":       "faculty"
    },
    {
      "_id":         4,
      "name":       "UMKC Parking Lot 10",
      "maxNumber":  20,
      "group":      4,
      "type":       "faculty"
    },
    {
      "_id":         5,
      "name":       "UMKC Parking Lot 4",
      "maxNumber":  60,
      "group":      5,
      "type":       "metered"
    },
    {
      "_id":         6,
      "name":       "UMKC Parking Lot 3",
      "maxNumber":  330,
      "group":      6,
      "type":       "student"
    },
    {
      "_id":         7,
      "name":       "Rockhill Parking Structure",
      "maxNumber":  900,
      "group":      7,
      "type":       "student"
    }
  ]

//Initialize the db
// db.createCollection("<collectionName>", { autoIndexId: false })

MongoClient.connect(url, function(err, db) {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to db!");
    //createCol(db, req.body, function () {

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

//

var createCol = function(db, data, callback) {
  //db.createCollection('parkingAvailability');
  //console.log(db.collection('parkingAvailability').stats())
  db.collection('parkingAvailability').save(data, function(err, result) {
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



//Want to post to mongodb provided by node-red
app.get('/posts', function(req, res) {

    console.log("posts!");

});


var server = app.listen(8081,function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port)
});
