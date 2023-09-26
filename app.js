const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
dotenv.config();

const app = express();

app.use('/images', express.static(`${__dirname}/public/images`));

app.use('/styles', express.static(`${__dirname}/public/styles`));

app.use((req, res, next) => {
    console.log(new Date().toLocaleDateString())
    next();
});

app.use(morgan('dev'));

app.get('/', (req, res,) => {
    res.status(200).sendFile(`${__dirname}/index.html`);
});

app.get('/contact', (req, res) => {
    res.status(200).sendFile(`${__dirname}/pages/contact.html`);
});

app.use((req, res) => {
    res.status(404).sendFile(`${__dirname}/pages/error.html`);
});

app.listen((process.env.PORT || 3000), () => {
    console.log(`Le serveur est disponible à l'adresse :
    http://${process.env.HOST}:${process.env.PORT ? process.env.PORT : 3000}`);
    });