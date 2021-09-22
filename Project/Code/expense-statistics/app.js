// Configure process.env based on a .env file, thus avoiding of messing with
// System environment variables
require("dotenv").config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const statisticsJob = require('./model/statistics_job');

const statsRouter = require('./routes/stats');

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/statistics', statsRouter);

statisticsJob.startStatisticsJob();

module.exports = app;
