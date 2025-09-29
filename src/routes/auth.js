const express = require('express');
const AuthController = require('../controllers/authController');
const { requireAuth } = require('../middlewares/auth');

const router = express.Router();

// Rutas de autenticación
router.post('/login', AuthController.login);
router.get('/logout', AuthController.logout);
router.get('/user', requireAuth, AuthController.getUser);

module.exports = router;