const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cuaca = require('../weather');

const weatherRouter = express();
weatherRouter.use(bodyParser.json());
weatherRouter.use(bodyParser.urlencoded({ extended: false }));
weatherRouter.use(cors());

weatherRouter.get('/', cuaca.index);

module.exports = weatherRouter;