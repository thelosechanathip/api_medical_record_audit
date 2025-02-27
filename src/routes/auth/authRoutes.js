const express = require('express');
const router = express.Router();
const { authAdminSetting } = require('../../middleware/auth/authAdmin');
const { authRegister, authLogin, authVerifyOtp, authVerifyToken, authRemoveUser } = require('../../controllers/auth/authController'); // require AuthController

// @ENDPOINT = http://localhost:3715/api_m/
router.post('/authRegister', authRegister);
router.post('/authLogin', authLogin);
router.post('/authVerifyOtp', authVerifyOtp);
router.post('/authVerifyToken', authVerifyToken);
router.delete('/authRemoveUser/:id', authAdminSetting, authRemoveUser);

module.exports = router;