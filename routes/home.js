const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
    const hello = 'Bonjour';
    const year = new Date().getFullYear();
    const userConnected = req.session.userConnected ? req.session.userConnected : null;
   res.status(200).render(path.join(__dirname,`../index.ejs`), { hello, year, userConnected});
});
module.exports = router;
