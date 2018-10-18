const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const path = require('path');
const connectionStr = process.env.DATABASE_URL || 'postgresql://postgres:root@localhost:5432/MyBD';
const debug = require('debug')('pool');
const fs = require('fs');
const copyTo = require('pg-copy-streams').to;
const copyFrom = require('pg-copy-streams').from;

const pool = new Pool({
    connectionString: connectionStr,
    max: 20,
    ssl: true
});

pool.on('connect', () => {
    debug('connected to the db');
});

exports.getContacts = (req, res) => {
    pool.connect((err, client, done) => {
        if (err) {
            return debug('Error acquiring client', err.stack);
        }
        client.query('SELECT Id, First_Name, Last_Name, Status FROM Contact', (err, result) => {
            console.log(result.rows);
            client.release();
            res.render('contactListView', {
                title: 'Contacts',
                contacts: result.rows
            });
            if (err) {
              return debug('Error executing query', err.stack);
            }
        })
    })
};

exports.downloadContacts = (req, res) => {
    let data = '';
    pool.connect((err, client) => {
        if (err) {
            return debug('Error acquiring client', err);
        }
        const stream = client.query(copyTo('COPY (SELECT First_Name, Last_Name, Status FROM Contact) TO STDOUT With CSV HEADER'));
        stream.on('data', chunk => {
            data += chunk; 
        });
        stream.on('end', err => {
            client.release();
            res.setHeader('Content-disposition', 'attachment; filename=contacts.csv');
            res.set('Content-Type', 'text/csv');
            res.send(data);
        });
        stream.on('error', err => {});
    });
};

exports.insertContacts = (req, res) => {
    debug(req.file);
    if (req.file == null) {
        res.json({
            message: 'Select file'
        });
    }
    const csvFile = req.file.path;
    debug(csvFile);
    pool.connect((err, client) => {
        if (err) {
            return debug('Error acquiring client', err);
        }
        const stream = client.query(copyFrom('COPY Contact (First_Name, Last_Name, Status) FROM STDIN WITH CSV HEADER'));
        const fileStream = fs.createReadStream(csvFile);
        fileStream.on('error', () => {});
        fileStream.pipe(stream)
        .on('finish', () => {
            client.release();
            res.send('successfully inserted');
        })
        .on('error', () => {
            res.send('some error occured');
        });
    });
};

exports.updateContact = (req, res) => {
    const results = {};
    let name = req.body.name;
    let value = req.body.value;
    let pk = req.body.pk;
    
    console.log(name + ' ' + value + ' ' + pk);
    if (value == '') {
        value = null;
    }
    const data = {text: value, id: pk};
 
    pool.connect((err, client) => {
        if (err) {
            return debug('Error acquiring client', err.stack);
        }
        client.query('UPDATE Contact SET Last_Name=($1) WHERE id=($2)', [data.text, data.id], (err, result) => {
            if (err) {
                return debug('Error executing query', err.stack);
            }
            client.release();
            results.id = req.body.pk;
            res.send(results);
        });
    });
};