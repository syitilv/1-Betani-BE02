const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const CLIENT_ID = process.env['CLIENT_ID'];
const CLIENT_SECRET = process.env['CLIENT_SECRET'];
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = process.env['REFRESH_TOKEN'];

const express = require('express');
const User = require('../models/users');

const forgotPass = express.Router();

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN});

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

async function sendMail(emailUser, link){
    try {
        const accessToken = await oAuth2Client.getAccessToken();
        const transport  = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'viaviano22@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        })

        const mailOptions = {
            from: 'BETANIADMIN <viaviano22@gmail.com>',
            to: emailUser,
            subject: 'Welcome to Betani.',
            text: 'Halo! Silahkan menuju ke link ini untuk reset password anda: ' + link
        };

        const result = await transport.sendMail(mailOptions);
        return result;

    } catch (error) {
        return error;
    }
}

forgotPass.route('/')
.post(async(req, res, next) => {
    try {
        let user = await User.findOne({ email: {$eq: req.body.email} });
        console.log(user);
        if (user) {
            const token = crypto.randomBytes(20).toString('hex');
            console.log(token);
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000;
            user.save().then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }).catch(err => console.log(err));
            const link = 'http://' + req.headers.host + '/lupaPassword/reset/' + token; 
            sendMail(user.email, link)
            .then(result => console.log('Email terkirim....', result))
            .catch((error) => console.log(error.message));
        } else {
            res.send('Email tidak terdaftar');
        }
    } catch (error) {
        return error;
    }

});

forgotPass.route('/reset/:token')
.put(async(req, res, next) => {
    try {
        let user = await User.findOne({ resetPasswordToken: {$eq: req.params.token} });
        if (user) {
            user.resetPasswordToken = '';
            user.resetPasswordExpires = 0;
            user.password = await bcrypt.hash(req.body.password, 12);
            user.save().then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }).catch(err => console.log(err));
        }
    } catch (error) {
        return error;
    }
});
module.exports = forgotPass;