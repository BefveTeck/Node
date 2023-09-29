const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/admin', (req, res) => {
    res.status(200).render(path.join(__dirname, `../pages/management/admin.ejs`));
});

module.exports = router;