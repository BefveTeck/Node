const AdressUser = require('../models/AddressUser');
const User = require('../models/User');
const path = require('path');

exports.signup = (req, res) => {
    res.status(200).render(path.join(__dirname, '../pages/signup.ejs'));
}

exports.createUser = (req,res) => {}

exports.signin = (req, res) => {
    res.status(200).render(path.join(__dirname, '../pages/signin.ejs'));
}



exports.login = (req, res) => {}
exports.logout = (req, res) => {}