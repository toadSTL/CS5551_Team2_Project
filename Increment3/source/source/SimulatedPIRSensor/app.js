/**
 * Copyright 2016 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Updated by Muhammad Ali, Gregory Brown, Pravalhika Kampally, and Seunghyun Oh
 *
 * 10/26/2018
 *
 * Updated for University of Missouri-Kansas City course CS5551
 */

// Use sctrict mode
'use strict';

//------------------------------------------------------------------------------
// Change variable values in this section to customize emitted data
//------------------------------------------------------------------------------

// Name of the MQTT topic that the data should be published on
var topicToBePublishedOn = 'umkcParking';

// Wait this many seconds before publishing the next set of data
var varIntervalBetweenData = 2;

// Quality of Serive for the publish event. Supported values : 0, 1, 2
var QosLevel = 0;

// read the id of the IoT foundation org out of a local .env file
// format of .env file:
// iotf_org=<id of IoT Foundation organization>
require('dotenv').load();

// Note that the following configuration must match with the parameters that
// the device-simulator was registered with. This device registration can
// either be done in the dashboard of the IoT Foundation service or via its
// API

var iotfConfig = {
    "org" : process.env.iotf_org,
    "id" : process.env.iotf_id,
    "auth-token" : process.env.iotf_authtoken,
    "type" : process.env.iotf_type,
    "auth-method" : "token"
};


//------------------------------------------------------------------------------
// Setup all the required node modules we'll need
//------------------------------------------------------------------------------

// Require the express framework
var express = require('express');

// Initialize the app as an express application
var app = express();

//---The ibmiotf package simplifies intractions with the IoT Foundation Service-
var Iotf = require("ibmiotf");

//---The cfenv module helps to access the Cloud Foundry environment-------------
var cfenv = require('cfenv');

// get the application environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

console.log('');
console.log('--- DEBUG appENV: ---');
console.log(appEnv);
console.log('');


//---Start the express server---------------------------------------------------

 app.listen(appEnv.port, function() {
     console.log("Server started on " + appEnv.url);
  }).on('error', function(err) {
    if (err.errno === 'EADDRINUSE') {
        console.log('Server not started, port ' + appEnv.url + ' is busy');
    } else {
        console.log(err);
    }
});


//---Connect to the IoT Foundation service--------------------------------------

console.log('');
console.log('--- DEBUG iotConfig: ---');
console.log(iotfConfig);
console.log('');

// Create a client (used to send data)
var iotfClient = new Iotf.IotfDevice(iotfConfig);

// Connect to the initialized iotf service
iotfClient.connect();


var countingUp = true;

// Handle errors coming from the iotf service
iotfClient.on("error", function (err) {
    // console.log("Error received while connecting to IoTF service: " + err.message);
    if (err.message.indexOf('authorized') > -1) {
        console.log('');
        console.log("Make sure the device-simulator is registered in the IotF org with the following configuration:")
        console.log(iotfConfig);
        console.log('');
    }
    process.exit( );
});

iotfClient.on("connect", function () {
    console.log("Device simulator is connected to the IoT Foundation service");
    console.log("QoS level set to: " + QosLevel);

    // inital data packet to be emitted as a JSON object
    var dataPacket = {
        "d" : {
            "temperature" : 0,
            "pressure" : 50,
            "humidity" : 10,
            "luminosity" : 5
        },
        "_id" : 1,
        "lotID" : 1,
        "availabilityChange": 2
    };


    //--loop forever------------------------------------------------------------
//Ultimately the goal is to have separate sensor devices which will update the Node.js
    setInterval(function(){

        // add a time stamp to the data packet
        var date = new Date();
        dataPacket.ts = date.toISOString();

        // convert the data packet into a string and then publish it
        iotfClient.publish("status","json", JSON.stringify(dataPacket) );
        // log out the emitted dataPacket
        console.log(JSON.stringify(dataPacket));

        //
        // increment temperature up to 100 then back down to 0

        if (dataPacket.d.temperature === 0) {
           countingUp = true;
        } else if (dataPacket.d.temperature === 100) {
           countingUp = false;
        }
        if (countingUp === true) {
            if (dataPacket.d.temperature === 100) {
               countingUp = false;
            }
            var temperatureIncrement = 20;
        } else {
            if (dataPacket.d.temperature === 0) {
                countingUp = true
            }
            var temperatureIncrement = -20;
        }
//            var temperatureIncrement = 20;
            var humidityIncrement = 2;
          //  var luminosityIncrement = 1;
        //}
//        if (dataPacket.d.temperature === 100) {
//            dataPacket.d.temperature = 0;
//        }
        dataPacket.d.temperature = dataPacket.d.temperature + temperatureIncrement;

        if (dataPacket.d.humidity === 100) {
            dataPacket.d.humidity = 0;
        }
        dataPacket.d.humidity = dataPacket.d.humidity + humidityIncrement;


        //
        // increment the pressure until 100 and start again at 0
        //
        var pressureIncrement = 2;
        if (dataPacket.d.pressure === 100) {
            dataPacket.d.pressure = 0;
        }
        dataPacket.d.pressure = dataPacket.d.pressure + pressureIncrement;

    }, varIntervalBetweenData*1000);

});
