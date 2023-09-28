const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/contact', (req, res) => {
    res.status(200).render(path.join(__dirname, `../pages/contact.ejs`));
});

module.exports = router;