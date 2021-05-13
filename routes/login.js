const express = require('express');
const { loginController } = require('../controllers/authController');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('login');
});

router.post('/', (req, res) => {
  try {
    loginController(req, res);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
