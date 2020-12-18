const express = require('express');
const request = require('request');
const dotenv = require('dotenv').config();

const weatherRouter = express();

weatherRouter.route('/:kota')
.get((req, res, next) => {
    const address = req.params.kota;

    const url = `http://api.openweathermap.org/data/2.5/weather?q=${address},id&appid=${process.env.API_KEY}`;

    request(url, (err, q, body) => { 
        const data = JSON.parse(body);
        res.json({
            city: data.name,
            main: data.main,
            weather: data.weather[0].main,
            description: data.weather[0].description,
            wind: 'speed = '+data.wind.speed+', deg = '+data.wind.deg,
            rain : data.rain,
            sunrise: data.sys.sunrise,
            sunset: data.sys.sunset
        })
    });
})

module.exports = weatherRouter;