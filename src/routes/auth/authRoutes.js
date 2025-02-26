const express = require('express');
const router = express.Router();
const { authRegister, authLogin, authVerifyOtp } = require('../../controllers/authController'); // require AuthController

// @ENDPOINT = http://localhost:3715/api_m/
router.post('/authRegister', authRegister);
router.post('/authLogin', authLogin);
router.post('/authVerifyOtp', authVerifyOtp);

module.exports = router;