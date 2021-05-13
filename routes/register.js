const express = require('express');
const { registerController } = require('../controllers/authController');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('register');
});

router.post('/', (req, res) => {
  try {
    registerController(req, res);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
