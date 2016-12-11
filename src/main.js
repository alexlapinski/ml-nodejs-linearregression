"use strict";

const csv = require('fast-csv');
const ndarray = require('ndarray');
const npack = require('ndarray-pack');
const _ = require("underscore");


function read_csv(filepath) {

    return new Promise(function (resolve, reject) {

        var _fileData = [];

        csv
            .fromPath(filepath, {trim:true})
            .on('data', function(data){
                _fileData.push(data)
            })
            .on('end', function(){
                var _headers = _.first(_fileData);
                var _data = _.rest(_fileData);

                var _ndarray = npack(_data);

                resolve({
                    'headers': _headers,
                    'data': _ndarray
                });
            })
            .on('error', function(err){
                reject(err, filepath);
            });

    });
}


//
// Main()
//

function print_ndarray(arr) {
    const num_rows = arr.shape[0];
    const num_cols = arr.shape[1];

    console.log('Shape: [' + num_rows + ', ' + num_cols + ']');

    var i, j;
    for( i = 0; i < num_rows; i ++) {
        var row = '[';
        for( j = 0; j < num_cols; j++) {
            row += arr.get(i, j) + ', ';
        }
        row = row.slice(0, -2);
        row += '], ';
        console.log(row);
    }
}


// Read our CSV into a ndarray
read_csv("data/raw/x06Simple.csv")
    .then(function(res) {
        console.log('Headers: ');
        console.log(res.headers)
        console.log('Num Data Rows: ' + res.data.shape[1])

        print_ndarray(res.data);
    })
    .catch((err, filepath) => console.log("Error reading file: " + err));