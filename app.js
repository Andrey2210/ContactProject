const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const routes = require('./src/routes/routes');

require('dotenv').config();

const router = express.Router();
const app = express();
const port = process.env.PORT || 8080;

app.set('views', './src/views');
app.set('view engine', 'ejs');

app.use(morgan('combined'));
app.use([bodyParser.json(), bodyParser.urlencoded({ extended: true })]);
app.use(express.static(path.join(__dirname, '/public/')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));

app.use((err, req, res, next) => {
    debug(err);
    res.status(500).send('Server Error');
});

app.use('/contactProject', routes);

router.get('/', (req, res, next) => {
    res.redirect('/contactProject/contact');
});

app.listen(port, (err) => {
    debug(`listening on port ${chalk.green(port)}`);
});