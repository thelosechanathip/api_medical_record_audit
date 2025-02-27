const express = require('express');
const router = express.Router();
const { authAdminSetting, authCheckToken } = require('../../middleware/auth/authAdmin');
const { authRegister, authLogin, authVerifyOtp, authVerifyToken, authRemoveUser, authLogout } = require('../../controllers/auth/authController'); // require AuthController

// @ENDPOINT = http://localhost:3715/api_m/
router.post('/authRegister', authRegister);
router.post('/authLogin', authLogin);
router.post('/authVerifyOtp', authVerifyOtp);
router.post('/authVerifyToken', authCheckToken, authVerifyToken);
router.delete('/authRemoveUser/:id', authCheckToken, authAdminSetting, authRemoveUser);
router.post('/authLogout', authLogout);

module.exports = router;