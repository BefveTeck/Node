const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');
dotenv.config();

app.use(express.json());
mongoose.connect(process.env.URL_DATABASE)
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch((error) => console.log(`${error}`));


app.use('/images', express.static(`${__dirname}/public/images`));

app.use('/styles', express.static(`${__dirname}/public/styles`));

app.use((req, res, next) => {
    console.log(new Date().toLocaleDateString())
    next();
});

app.use(morgan('dev'));

const homeRoutes = require('./routes/home');
app.use(homeRoutes); 

const contactRoutes = require('./routes/contact');
app.use(contactRoutes);

const userRoutes = require('./routes/user');
app.use(userRoutes);

const adminRoutes = require('./routes/admin');
app.use(adminRoutes);

const signRoutes = require('./routes/sign');
app.use(signRoutes);

const errorRoutes = require('./routes/error');
app.use(errorRoutes);

app.listen((process.env.PORT || 3000), () => {
    console.log(`Le serveur est disponible à l'adresse :
    http://${process.env.HOST}:${process.env.PORT ? process.env.PORT : 3000}`);
    });